from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Recovery
from schemas import RecoveryCreate, RecoveryResponse
from routes.auth import get_current_user

router = APIRouter(prefix="/recovery", tags=["recovery"])

@router.post("", response_model=RecoveryResponse)
def log_recovery(recovery: RecoveryCreate, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    db_recovery = Recovery(**recovery.dict(), user_id=user.id)
    db.add(db_recovery)
    db.commit()
    db.refresh(db_recovery)
    return db_recovery

@router.get("", response_model=list[RecoveryResponse])
def get_recovery(days: int = 14, token: str = None, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    recovery_logs = db.query(Recovery).filter(Recovery.user_id == user.id).order_by(Recovery.date.desc()).limit(days).all()
    return recovery_logs