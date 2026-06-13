from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Workout, User
from schemas import WorkoutCreate, WorkoutResponse
from routes.auth import get_current_user

router = APIRouter(prefix="/workouts", tags=["workouts"])

@router.post("", response_model=WorkoutResponse)
def log_workout(workout: WorkoutCreate, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    db_workout = Workout(**workout.dict(), user_id=user.id)
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.get("", response_model=list[WorkoutResponse])
def get_workouts(limit: int = 50, offset: int = 0, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    workouts = db.query(Workout).filter(Workout.user_id == user.id).order_by(Workout.date.desc()).limit(limit).offset(offset).all()
    return workouts

@router.delete("/{workout_id}")
def delete_workout(workout_id: int, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    workout = db.query(Workout).filter(Workout.id == workout_id, Workout.user_id == user.id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(workout)
    db.commit()
    return {"message": "Workout deleted"}

@router.get("/exercises")
def get_exercises():
    exercises = [
        "Bench Press", "Squat", "Deadlift", "Overhead Press", "Pull Ups",
        "Barbell Row", "Incline Press", "Leg Press", "Romanian Deadlift",
        "Dips", "Lat Pulldown", "Cable Row", "Bicep Curl", "Tricep Pushdown",
    ]
    return {"exercises": exercises}