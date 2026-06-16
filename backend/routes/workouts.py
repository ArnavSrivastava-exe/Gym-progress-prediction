from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Workout, User
from schemas import WorkoutCreate, WorkoutResponse
from routes.auth import get_current_user

router = APIRouter(prefix="/workouts", tags=["workouts"])

@router.post("", response_model=WorkoutResponse)
def log_workout(workout: WorkoutCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_workout = Workout(**workout.dict(), user_id=current_user.id)
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@router.get("", response_model=list[WorkoutResponse])
def get_workouts(limit: int = 50, offset: int = 0, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).order_by(Workout.date.desc()).limit(limit).offset(offset).all()
    return workouts

@router.get("/count")
def get_workout_count(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    count = db.query(Workout).filter(Workout.user_id == current_user.id).count()
    return {"total_workouts": count, "unlocked": count >= 7}

@router.get("/recent")
def get_recent_workouts(limit: int = 7, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).order_by(Workout.date.desc()).limit(limit).all()
    return {"workouts": workouts[::-1]}

@router.delete("/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workout = db.query(Workout).filter(Workout.id == workout_id, Workout.user_id == current_user.id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(workout)
    db.commit()
    return {"message": "Workout deleted"}

@router.get("/exercises")
def get_exercises():
    exercises = [
        "Bench Press", "Incline Bench Press", "Dumbbell Bench Press",
        "Squat", "Front Squat", "Leg Press", "Hack Squat",
        "Deadlift", "Romanian Deadlift", "Sumo Deadlift", "Trap Bar Deadlift",
        "Overhead Press", "Push Press", "Dumbbell Shoulder Press",
        "Pull Ups", "Chin Ups", "Lat Pulldown", "Assisted Pull Ups",
        "Barbell Row", "Dumbbell Row", "Cable Row", "Seal Row",
        "Dips", "Chest Dips", "Tricep Dips",
        "Bicep Curl", "Dumbbell Curl", "Cable Curl", "Hammer Curl",
        "Tricep Pushdown", "Rope Pushdown", "Skull Crushers", "Close Grip Bench",
        "Lateral Raise", "Front Raise", "Reverse Fly",
        "Leg Curl", "Leg Extension", "Calf Raise",
        "Planks", "Ab Wheel", "Machine Crunch", "Decline Situps"
    ]
    return {"exercises": exercises}