from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Nutrition
from schemas import NutritionCreate, NutritionResponse
from routes.auth import get_current_user

router = APIRouter(prefix="/nutrition", tags=["nutrition"])

@router.post("", response_model=NutritionResponse)
def log_nutrition(nutrition: NutritionCreate, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    db_nutrition = Nutrition(**nutrition.dict(), user_id=user.id)
    db.add(db_nutrition)
    db.commit()
    db.refresh(db_nutrition)
    return db_nutrition

@router.get("", response_model=list[NutritionResponse])
def get_nutrition(days: int = 14, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    nutrition_logs = db.query(Nutrition).filter(Nutrition.user_id == user.id).order_by(Nutrition.date.desc()).limit(days).all()
    return nutrition_logs