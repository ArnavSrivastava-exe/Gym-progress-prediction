from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import get_db
from models import User, OnboardingData, TrainingMetrics, Goals
from schemas import (
    UserCreate, UserResponse, LoginRequest, Token,
    OnboardingDataSchema, TrainingMetricsSchema, GoalsSchema, OnboardingStatusResponse
)
from passlib.context import CryptContext
from jose import JWTError, jwt
import os

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "test-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        full_name=user.full_name,
        age=user.age,
        gender=user.gender,
        height_cm=user.height_cm,
        weight_kg=user.weight_kg,
        body_fat_pct=user.body_fat_pct,
        training_experience=user.training_experience,
        goal=user.goal,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(updated_data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for key, value in updated_data.items():
        if value is not None:
            setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/onboarding")
def save_onboarding(data: OnboardingDataSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Save onboarding data (6 steps)"""
    onboarding = db.query(OnboardingData).filter(OnboardingData.user_id == current_user.id).first()
    
    if onboarding:
        for key, value in data.dict(exclude_unset=True).items():
            setattr(onboarding, key, value)
    else:
        onboarding = OnboardingData(user_id=current_user.id, **data.dict(exclude_unset=True))
        db.add(onboarding)
    
    current_user.onboarding_completed = True
    db.commit()
    db.refresh(onboarding)
    
    return {"message": "Onboarding data saved", "onboarding_completed": True}

@router.get("/onboarding-status", response_model=OnboardingStatusResponse)
def get_onboarding_status(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Check if user completed onboarding and days until dashboard unlock"""
    onboarding_completed = current_user.onboarding_completed
    first_workout_date = current_user.first_workout_date
    
    days_since_first_workout = None
    can_access_dashboard = False
    
    if first_workout_date:
        days_since = (datetime.utcnow() - first_workout_date).days
        days_since_first_workout = days_since
        can_access_dashboard = days_since >= 7
    
    return {
        "onboarding_completed": onboarding_completed,
        "days_since_first_workout": days_since_first_workout,
        "can_access_dashboard": can_access_dashboard
    }

@router.post("/training-metrics")
def save_training_metrics(data: TrainingMetricsSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Save current training metrics (PRs)"""
    metrics = db.query(TrainingMetrics).filter(TrainingMetrics.user_id == current_user.id).first()
    
    if metrics:
        for key, value in data.dict(exclude_unset=True).items():
            setattr(metrics, key, value)
    else:
        metrics = TrainingMetrics(user_id=current_user.id, **data.dict(exclude_unset=True))
        db.add(metrics)
    
    db.commit()
    db.refresh(metrics)
    
    return {"message": "Training metrics saved"}

@router.post("/goals")
def save_goals(data: GoalsSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Save fitness goals"""
    goals = db.query(Goals).filter(Goals.user_id == current_user.id).first()
    
    if goals:
        for key, value in data.dict(exclude_unset=True).items():
            setattr(goals, key, value)
    else:
        goals = Goals(user_id=current_user.id, **data.dict(exclude_unset=True))
        db.add(goals)
    
    db.commit()
    db.refresh(goals)
    
    return {"message": "Goals saved"}

@router.get("/onboarding-data")
def get_onboarding_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's onboarding data"""
    data = db.query(OnboardingData).filter(OnboardingData.user_id == current_user.id).first()
    return data if data else {"message": "No onboarding data found"}

@router.get("/training-metrics")
def get_training_metrics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's training metrics"""
    metrics = db.query(TrainingMetrics).filter(TrainingMetrics.user_id == current_user.id).first()
    return metrics if metrics else {"message": "No training metrics found"}

@router.get("/goals")
def get_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's goals"""
    goals = db.query(Goals).filter(Goals.user_id == current_user.id).first()
    return goals if goals else {"message": "No goals found"}