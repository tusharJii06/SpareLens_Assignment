# app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Dict
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class DatasetOut(BaseModel):
    id: int
    name: str
    uploaded_at: datetime
    schema: Dict

    class Config:
        from_attributes = True
