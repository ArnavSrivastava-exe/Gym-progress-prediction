from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    body_fat_pct: float
    training_experience: str
    goal: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    body_fat_pct: Optional[float] = None
    training_experience: Optional[str] = None
    goal: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Workout Schemas
class WorkoutCreate(BaseModel):
    exercise_name: str
    weight_kg: float
    reps: int
    sets: int
    rpe: Optional[float] = None
    date: str
    notes: Optional[str] = None

class WorkoutResponse(WorkoutCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Nutrition Schemas
class NutritionCreate(BaseModel):
    date: str
    calories: float
    protein_g: float
    carbs_g: float
    fats_g: float

class NutritionResponse(NutritionCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Metrics Schemas
class MetricsCreate(BaseModel):
    date: str
    weight_kg: float
    body_fat_pct: Optional[float] = None

class MetricsResponse(MetricsCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Recovery Schemas
class RecoveryCreate(BaseModel):
    date: str
    sleep_hours: float
    stress_level: int
    recovery_score: int

class RecoveryResponse(RecoveryCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Login
class LoginRequest(BaseModel):
    email: str
    password: str