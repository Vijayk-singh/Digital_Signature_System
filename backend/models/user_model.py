from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # "professor" or "student"
    is_verified: bool = False
    verification_token: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
