from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import BodyMetrics
from schemas import BodyMetricsCreate, BodyMetricsResponse
from routes.auth import get_current_user

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.post("", response_model=BodyMetricsResponse)
def log_metrics(
    metrics: BodyMetricsCreate,
    token: str = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)

    db_metrics = BodyMetrics(
        **metrics.dict(),
        user_id=user.id
    )

    db.add(db_metrics)
    db.commit()
    db.refresh(db_metrics)

    return db_metrics


@router.get("", response_model=list[BodyMetricsResponse])
def get_metrics(
    days: int = 60,
    token: str = None,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)

    metrics = (
        db.query(BodyMetrics)
        .filter(BodyMetrics.user_id == user.id)
        .order_by(BodyMetrics.date.desc())
        .limit(days)
        .all()
    )

    return metrics