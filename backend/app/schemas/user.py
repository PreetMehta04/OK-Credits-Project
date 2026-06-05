from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Dict, Any
from enum import Enum


class UserRole(str, Enum):
    customer = "customer"
    staff = "staff"
    admin = "admin"


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    preferred_language: str = "en"

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    preferred_language: str
    body_measurements: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    preferred_language: Optional[str] = None
    body_measurements: Optional[Dict[str, Any]] = None
