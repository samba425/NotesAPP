from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

# ============================================
# CONFIGURATION
# ============================================
JWT_SECRET = os.getenv("JWT_SECRET", "fallback-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# Initialize FastAPI
app = FastAPI(
    title="Notes API - FastAPI",
    description="Notes application with JWT authentication",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# DATA MODELS
# ============================================
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class NoteCreate(BaseModel):
    title: str
    content: str

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class Note(BaseModel):
    id: int
    userId: int
    title: str
    content: str
    createdAt: datetime
    updatedAt: datetime

class User(BaseModel):
    id: int
    username: str
    email: str

# ============================================
# IN-MEMORY DATA STORAGE (Demo purposes)
# ============================================
users_db = []
notes_db = []
note_id_counter = [1]  # Using list to make it mutable

# ============================================
# HELPER FUNCTIONS
# ============================================
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or expired token"
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("id")
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    return payload

# ============================================
# AUTH ROUTES
# ============================================
@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    # Check if user exists
    if any(u["email"] == user_data.email for u in users_db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = {
        "id": len(users_db) + 1,
        "username": user_data.username,
        "email": user_data.email,
        "password": hashed_password,
        "createdAt": datetime.utcnow()
    }
    
    users_db.append(new_user)
    
    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user["id"],
            "username": new_user["username"],
            "email": new_user["email"]
        }
    }

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    # Find user
    user = next((u for u in users_db if u["email"] == credentials.email), None)
    
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create token
    token = create_access_token({
        "id": user["id"],
        "email": user["email"],
        "username": user["username"]
    })
    
    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"]
        }
    }

# ============================================
# NOTES ROUTES (Protected)
# ============================================
@app.get("/api/notes", response_model=List[Note])
async def get_notes(current_user: dict = Depends(get_current_user)):
    user_notes = [note for note in notes_db if note["userId"] == current_user["id"]]
    return user_notes

@app.get("/api/notes/{note_id}", response_model=Note)
async def get_note(note_id: int, current_user: dict = Depends(get_current_user)):
    note = next((n for n in notes_db if n["id"] == note_id and n["userId"] == current_user["id"]), None)
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return note

@app.post("/api/notes", response_model=Note, status_code=status.HTTP_201_CREATED)
async def create_note(note_data: NoteCreate, current_user: dict = Depends(get_current_user)):
    new_note = {
        "id": note_id_counter[0],
        "userId": current_user["id"],
        "title": note_data.title,
        "content": note_data.content,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    note_id_counter[0] += 1
    notes_db.append(new_note)
    
    return new_note

@app.put("/api/notes/{note_id}", response_model=Note)
async def update_note(
    note_id: int,
    note_data: NoteUpdate,
    current_user: dict = Depends(get_current_user)
):
    note = next((n for n in notes_db if n["id"] == note_id and n["userId"] == current_user["id"]), None)
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    if note_data.title is not None:
        note["title"] = note_data.title
    if note_data.content is not None:
        note["content"] = note_data.content
    
    note["updatedAt"] = datetime.utcnow()
    
    return note

@app.delete("/api/notes/{note_id}")
async def delete_note(note_id: int, current_user: dict = Depends(get_current_user)):
    note_index = next((i for i, n in enumerate(notes_db) if n["id"] == note_id and n["userId"] == current_user["id"]), None)
    
    if note_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    notes_db.pop(note_index)
    
    return {"message": "Note deleted successfully"}

# ============================================
# HEALTH CHECK
# ============================================
@app.get("/api/health")
async def health_check():
    return {
        "status": "OK",
        "message": "FastAPI Notes API is running",
        "timestamp": datetime.utcnow(),
        "users": len(users_db),
        "notes": len(notes_db)
    }

# ============================================
# ROOT ENDPOINT
# ============================================
@app.get("/")
async def root():
    return {
        "message": "Welcome to Notes API - FastAPI Version",
        "docs": "/docs",
        "health": "/api/health"
    }

# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    print(f"FastAPI Server starting on http://localhost:{port}")
    print(f"API Documentation: http://localhost:{port}/docs")
    uvicorn.run(app, host="0.0.0.0", port=port)
