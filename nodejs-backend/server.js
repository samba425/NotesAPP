const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (for demo purposes)
const users = [];
const notes = [];
let noteIdCounter = 1;

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// AUTH ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============================================
// NOTES ROUTES (Protected)
// ============================================

// Get all notes for logged-in user
app.get('/api/notes', authenticateToken, (req, res) => {
  const userNotes = notes.filter(note => note.userId === req.user.id);
  res.json(userNotes);
});

// Get single note
app.get('/api/notes/:id', authenticateToken, (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id) && n.userId === req.user.id);
  
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  
  res.json(note);
});

// Create note
app.post('/api/notes', authenticateToken, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const note = {
    id: noteIdCounter++,
    userId: req.user.id,
    title,
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  notes.push(note);
  res.status(201).json(note);
});

// Update note
app.put('/api/notes/:id', authenticateToken, (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id) && n.userId === req.user.id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const { title, content } = req.body;
  
  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title || notes[noteIndex].title,
    content: content || notes[noteIndex].content,
    updatedAt: new Date()
  };

  res.json(notes[noteIndex]);
});

// Delete note
app.delete('/api/notes/:id', authenticateToken, (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id) && n.userId === req.user.id);
  
  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes.splice(noteIndex, 1);
  res.json({ message: 'Note deleted successfully' });
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Notes API is running',
    timestamp: new Date(),
    users: users.length,
    notes: notes.length
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Node.js Server running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   POST /api/auth/register - Register new user`);
  console.log(`   POST /api/auth/login - Login user`);
  console.log(`   GET  /api/notes - Get all notes (Protected)`);
  console.log(`   POST /api/notes - Create note (Protected)`);
  console.log(`   PUT  /api/notes/:id - Update note (Protected)`);
  console.log(`   DELETE /api/notes/:id - Delete note (Protected)`);
});
