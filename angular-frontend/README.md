# Angular Notes App - Professional Full-Stack Demo

A beautiful, professional notes application built with **Angular 17** frontend and supporting both **Node.js/Express** and **Python/FastAPI** backends.

## 🎯 Features

✨ **Professional UI/UX**
- Modern, responsive design with Bootstrap 5
- Glass-morphism effects and smooth animations
- Grid and List view modes for notes
- Real-time search and filtering
- Beautiful gradient backgrounds

🔐 **Authentication & Security**
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with guards
- Automatic token attachment via interceptors
- Secure logout functionality

📝 **Notes Management**
- Create, Read, Update, Delete (CRUD) operations
- Rich text editing capabilities
- Character counters and validation
- Auto-save timestamps
- User-specific data isolation

🔄 **Backend Flexibility**
- Switch between Node.js and Python backends
- Identical API contracts
- Environment-based configuration
- Easy backend switching with single flag

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- One of the backend servers running (Node.js or Python)

### Installation

1. **Install Dependencies**
```bash
cd angular-frontend
npm install
```

2. **Configure Backend**

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  backendType: 'nodejs',  // Change to 'python' for Python backend
  nodeApiUrl: 'http://localhost:3000/api',
  pythonApiUrl: 'http://localhost:8000/api',
  // ...
};
```

3. **Start the Backend**

**For Node.js:**
```bash
cd ../nodejs-backend
npm install
npm start
# Server runs on http://localhost:3000
```

**For Python:**
```bash
cd ../python-backend
pip install -r requirements.txt
uvicorn main:app --reload
# Server runs on http://localhost:8000
```

4. **Run Angular App**
```bash
cd angular-frontend
npm start
```

Visit `http://localhost:4200` in your browser!

## 🎨 UI Showcase

### Login Screen
- Elegant gradient background
- Animated logo with pulse effect
- Form validation with helpful error messages
- Password visibility toggle
- Backend indicator badge

### Notes Dashboard
- Clean, modern navigation bar
- Search bar with real-time filtering
- Grid/List view toggle
- Empty state with helpful prompts
- Responsive card design with hover effects

### Note Editor
- Intuitive form layout
- Character counters
- Real-time validation
- Helpful tips and guidelines
- Auto-save indicators

## 🏗️ Project Structure

```
angular-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── notes-list/
│   │   │   └── note-form/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── notes.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   │   └── app.component.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── styles.css
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

## 🔧 Configuration

### Switching Backends

**Option 1: Environment File**
```typescript
// src/environments/environment.ts
backendType: 'nodejs'  // or 'python'
```

**Option 2: Runtime Configuration**
The app automatically uses the correct API URL based on `backendType`:
- Node.js: `http://localhost:3000/api`
- Python: `http://localhost:8000/api`

### Environment Variables

Both backends use `.env` files:

```env
PORT=3000                    # or 8000 for Python
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

## 📱 Responsive Design

The app is fully responsive and works perfectly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1920px+)

## 🎯 Key Technologies

### Frontend
- **Angular 17** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Bootstrap 5** - UI framework
- **Bootstrap Icons** - Icon library
- **Google Fonts (Inter)** - Typography

### Backend Options

**Node.js Stack:**
- Express 4.18
- jsonwebtoken 9.0
- bcryptjs 2.4
- CORS enabled

**Python Stack:**
- FastAPI 0.104
- python-jose (JWT)
- passlib (bcrypt)
- Pydantic validation
- Auto-generated Swagger docs

## 🔐 Security Features

1. **JWT Authentication**
   - Secure token generation
   - Automatic token expiration (24h)
   - Token verification on protected routes

2. **Password Security**
   - bcrypt hashing (10 salt rounds)
   - No plain-text password storage
   - Secure password comparison

3. **Route Protection**
   - AuthGuard prevents unauthorized access
   - Automatic redirect to login
   - Return URL preservation

4. **HTTP Security**
   - CORS configuration
   - Request/Response interceptors
   - Error handling and logging

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register  - Create new account
POST /api/auth/login     - Login and get JWT token
```

### Notes (Protected)
```
GET    /api/notes       - Get all user notes
GET    /api/notes/:id   - Get specific note
POST   /api/notes       - Create new note
PUT    /api/notes/:id   - Update note
DELETE /api/notes/:id   - Delete note
```

## 🎓 Demo Talking Points

When presenting this app:

1. **Architecture**: Show the clean separation between frontend/backend
2. **Flexibility**: Demonstrate switching between Node.js and Python
3. **Security**: Explain JWT flow and password hashing
4. **UX**: Highlight the professional design and animations
5. **Code Quality**: Show TypeScript types, services, and guards
6. **Responsiveness**: Test on different screen sizes
7. **Performance**: Mention optimizations like lazy loading
8. **Testing**: Discuss unit tests and e2e tests (if implemented)

## 🐛 Troubleshooting

**CORS Errors:**
- Ensure backend CORS is configured correctly
- Check API URL in environment files

**Login Issues:**
- Verify backend is running
- Check JWT secret matches
- Clear browser localStorage

**Build Errors:**
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check Angular CLI version

## 📈 Future Enhancements

- [ ] Note categories/tags
- [ ] Markdown support
- [ ] Rich text editor
- [ ] File attachments
- [ ] Search with highlighting
- [ ] Sorting and filtering options
- [ ] Export notes (PDF, Markdown)
- [ ] Dark mode toggle
- [ ] User profile management
- [ ] Email verification
- [ ] Password reset functionality

## 📄 License

This is a demo project for educational and portfolio purposes.

## 👨‍💻 Developer

Built with ❤️ for full-stack development demonstrations.

---

**Pro Tip:** This project showcases modern web development best practices including:
- Clean code architecture
- Separation of concerns
- Reactive programming patterns
- Professional UI/UX design
- Security best practices
- Type safety with TypeScript
- RESTful API design
