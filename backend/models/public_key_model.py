from pydantic import BaseModel, EmailStr
from typing import Literal

class PublicKeyModel(BaseModel):
    email: EmailStr
    name: str
    role: Literal["professor", "student"]
    public_key: str
