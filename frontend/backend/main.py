from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app import models
from app.schemas import Patient
from app.predictor import predict_heart_disease
from app.auth import get_current_user
from app.routers import auth_router, patients_router, history_router, nearby_router

# Create all database tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CardioCare AI — Heart Disease Prediction API",
    version="2.0.0",
    description="Professional Heart Disease Prediction System with JWT Authentication, Patient Management, and Prediction History.",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(patients_router.router)
app.include_router(history_router.router)
app.include_router(nearby_router.router)


@app.get("/")
def home():
    return {
        "message": "CardioCare AI — Heart Disease Prediction API is running",
        "version": "2.0.0",
        "docs": "/docs",
    }


@app.post("/predict")
def predict(
    patient: Patient,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Run the ML prediction and save the result to history.
    Returns prediction result + SHAP explanation.
    Requires a valid JWT Bearer token.
    """
    result = predict_heart_disease(patient)
    prediction = result["prediction"]
    explanation = result["explanation"]

    # Save prediction to history (unchanged — uses only the integer prediction)
    record = models.PredictionRecord(
        user_id=current_user.id,
        result=prediction,
        age=patient.Age,
        sex=patient.Sex,
        chest_pain_type=patient.ChestPainType,
        resting_bp=patient.RestingBP,
        cholesterol=patient.Cholesterol,
        fasting_bs=patient.FastingBS,
        resting_ecg=patient.RestingECG,
        max_hr=patient.MaxHR,
        exercise_angina=patient.ExerciseAngina,
        oldpeak=patient.Oldpeak,
        st_slope=patient.ST_Slope,
    )
    db.add(record)
    db.commit()

    return {
        "prediction":  prediction,
        "explanation": explanation,
    }