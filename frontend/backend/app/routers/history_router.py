from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from typing import List
from datetime import date

from ..database import get_db
from ..schemas import PredictionHistoryItem, DashboardStats
from .. import models
from ..auth import get_current_user

router = APIRouter(prefix="/history", tags=["History & Stats"])


@router.get("/", response_model=List[PredictionHistoryItem])
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get prediction history for the current user."""
    return db.query(models.PredictionRecord).filter(
        models.PredictionRecord.user_id == current_user.id
    ).order_by(models.PredictionRecord.created_at.desc()).all()


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Get aggregated dashboard statistics for the current user."""
    base_q = db.query(models.PredictionRecord).filter(
        models.PredictionRecord.user_id == current_user.id
    )

    total_predictions = base_q.count()
    high_risk_count = base_q.filter(models.PredictionRecord.result == 1).count()
    low_risk_count = base_q.filter(models.PredictionRecord.result == 0).count()

    today = date.today()
    today_predictions = base_q.filter(
        cast(models.PredictionRecord.created_at, Date) == today
    ).count()

    total_patients = db.query(models.Patient).filter(
        models.Patient.user_id == current_user.id
    ).count()

    return DashboardStats(
        total_predictions=total_predictions,
        high_risk_count=high_risk_count,
        low_risk_count=low_risk_count,
        today_predictions=today_predictions,
        total_patients=total_patients,
    )
