# Full-Stack Notes Application Demo
## Angular + Node.js/Express + Python/FastAPI

A complete full-stack application demonstrating JWT authentication and CRUD operations with two backend options.

---

## 🎯 Features

- ✅ User Registration & Login
- ✅ JWT Token Authentication
- ✅ Protected Routes
- ✅ CRUD Operations (Create, Read, Update, Delete Notes)
- ✅ Password Hashing (bcrypt)
- ✅ CORS Handling
- ✅ Responsive UI
- ✅ HTTP Interceptors
- ✅ Route Guards

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     Angular Frontend (Port 4200)    │
│  - Components, Services, Guards     │
│  - HTTP Interceptor                 │
│  - JWT Token Management             │
└───────────┬─────────────────────────┘
            │
            │ HTTP Requests (JWT Token)
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
┌─────────┐      ┌──────────┐
│ Node.js │      │  Python  │
│ Express │  OR  │ FastAPI  │
│Port 3000│      │Port 8000 │
└─────────┘      └──────────┘
```

---

## 📦 Prerequisites

- **Node.js** 16+ (for frontend and Node.js backend)
- **Python** 3.8+ (for Python backend)
- **Angular CLI** 16+
- **npm** or **yarn**
- **pip** (Python package manager)

---

## 🚀 Quick Start

### 1. Node.js Backend Setup

```bash
cd nodejs-backend
npm install
npm start
```

Server runs on: `http://localhost:3000`

**API Endpoints:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/notes` - Get all notes (Protected)
- POST `/api/notes` - Create note (Protected)
- PUT `/api/notes/:id` - Update note (Protected)
- DELETE `/api/notes/:id` - Delete note (Protected)

---

### 2. Python Backend Setup (Alternative)

```bash
cd python-backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

Server runs on: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

---

### 3. Angular Frontend Setup

```bash
# Install Angular CLI globally (if not already installed)
npm install -g @angular/cli

# Create new Angular project
ng new angular-notes-app
cd angular-notes-app

# Install dependencies
npm install

# Generate components and services
ng generate component auth/login
ng generate component auth/register
ng generate component notes/note-list
ng generate component notes/note-form
ng generate service auth/auth
ng generate service notes/notes
ng generate guard auth/auth
ng generate interceptor auth/auth

# Start development server
ng serve
```

App runs on: `http://localhost:4200`

---

## 🔧 Configuration

### Backend Configuration

**Node.js** - Edit `.env`:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**Python** - Edit `.env`:
```env
PORT=8000
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Frontend Configuration

Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // or 8000 for Python
};
```

---

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### Get Notes (Protected)
```bash
curl -X GET http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Create Note (Protected)
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my note"
  }'
```

---

## 🧪 Testing

### Using Postman

1. Import the collection (if provided)
2. Set environment variable `baseUrl` to `http://localhost:3000/api` or `http://localhost:8000/api`
3. Register a user
4. Login and copy the token
5. Set token in Authorization header for protected requests

### Using FastAPI Swagger UI (Python only)

1. Open `http://localhost:8000/docs`
2. Click "Authorize" button
3. Enter: `Bearer YOUR_TOKEN_HERE`
4. Test all endpoints directly in browser

---

## 🔐 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: Signed with HS256 algorithm
- **Token Expiration**: 24 hours (configurable)
- **Protected Routes**: Middleware/dependency injection
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Pydantic models (Python), manual validation (Node.js)

---

## 🏛️ Project Structure

### Node.js Backend
```
nodejs-backend/
├── server.js          # Main application file
├── package.json       # Dependencies
├── .env              # Environment variables
└── README.md
```

### Python Backend
```
python-backend/
├── main.py           # Main application file
├── requirements.txt  # Dependencies
├── .env             # Environment variables
└── README.md
```

### Angular Frontend
```
angular-notes-app/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── auth.service.ts
│   │   ├── notes/
│   │   │   ├── note-list/
│   │   │   ├── note-form/
│   │   │   └── notes.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   └── app.module.ts
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
├── package.json
└── angular.json
```

---

## 🎨 UI Features

- Login page with form validation
- Registration page
- Notes dashboard with list view
- Create/Edit note form
- Delete confirmation
- Loading indicators
- Error messages
- Responsive design (mobile-friendly)
- Logout functionality

---

## 🔄 Switching Between Backends

The Angular frontend can work with either backend by changing the API URL:

**For Node.js:**
```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api'
};
```

**For Python:**
```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:8000/api'
};
```

Both backends implement the same API contract!

---

## 📊 Technology Stack

### Frontend
- **Angular** 16+
- **TypeScript** 5+
- **RxJS** 7+
- **Angular Router**
- **Angular Forms** (Reactive)
- **Angular HTTP Client**

### Backend Option 1 (Node.js)
- **Node.js** 16+
- **Express** 4+
- **jsonwebtoken** (JWT)
- **bcryptjs** (Password hashing)
- **cors** (CORS handling)
- **dotenv** (Environment variables)

### Backend Option 2 (Python)
- **Python** 3.8+
- **FastAPI** 0.104+
- **Uvicorn** (ASGI server)
- **python-jose** (JWT)
- **passlib** (Password hashing)
- **Pydantic** (Data validation)

---

## 🚧 Current Limitations (Demo Version)

- ❌ No database (in-memory storage)
- ❌ No token refresh mechanism
- ❌ No email verification
- ❌ No password reset
- ❌ No rate limiting
- ❌ No unit tests
- ❌ No logging
- ❌ No file uploads

---

## 📈 Next Steps (Production-Ready)

1. **Add Database:**
   - Node.js: MongoDB with Mongoose or PostgreSQL with Sequelize
   - Python: SQLAlchemy with PostgreSQL or Motor with MongoDB

2. **Implement Refresh Tokens:**
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)

3. **Add Email Features:**
   - Email verification on registration
   - Password reset via email

4. **Security Enhancements:**
   - Rate limiting (express-rate-limit or FastAPI middleware)
   - Input sanitization
   - HTTPS only in production
   - httpOnly cookies for tokens

5. **Testing:**
   - Unit tests (Jest for Node.js, pytest for Python, Jasmine for Angular)
   - Integration tests
   - E2E tests (Cypress or Playwright)

6. **Deployment:**
   - Frontend: Vercel, Netlify, or AWS S3
   - Backend: Heroku, AWS EC2, or Docker containers
   - Database: MongoDB Atlas or AWS RDS

7. **Monitoring:**
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)
   - Logging (Winston for Node.js, Loguru for Python)

---

## 🤝 Contributing

This is a demo project for educational purposes. Feel free to fork and enhance!

---

## 📄 License

MIT License - Feel free to use for learning and teaching.

---

## 👤 Author

**Alla Samba Siva Rao**
- Email: asiva325@gmail.com
- GitHub: [@samba425](https://github.com/samba425)
- LinkedIn: [Your LinkedIn]

---

## 🙏 Acknowledgments

- Angular documentation
- Express.js documentation
- FastAPI documentation
- JWT.io for JWT debugging
- MDN Web Docs

---

## 📞 Support

For questions or issues:
1. Check the DEMO_GUIDE.md for detailed walkthrough
2. Review API documentation
3. Check browser console for errors
4. Verify backend is running
5. Check CORS configuration

---

**Happy Coding! 🚀**
