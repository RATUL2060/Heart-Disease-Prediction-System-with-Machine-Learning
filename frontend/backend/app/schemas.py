from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ---- Patient (original ML input) ----
class Patient(BaseModel):
    Age: int
    Sex: int
    ChestPainType: int
    RestingBP: int
    Cholesterol: int
    FastingBS: int
    RestingECG: int
    MaxHR: int
    ExerciseAngina: int
    Oldpeak: float
    ST_Slope: int


# ---- Auth ----
class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ---- Patients (DB records) ----
class PatientCreate(BaseModel):
    name: str
    age: Optional[int] = None
    sex: Optional[str] = None
    notes: Optional[str] = None


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None
    notes: Optional[str] = None


class PatientResponse(BaseModel):
    id: int
    name: str
    age: Optional[int]
    sex: Optional[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Prediction History ----
class PredictionHistoryItem(BaseModel):
    id: int
    result: int
    age: Optional[int]
    sex: Optional[int]
    chest_pain_type: Optional[int]
    resting_bp: Optional[int]
    cholesterol: Optional[int]
    max_hr: Optional[int]
    patient_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Dashboard Stats ----
class DashboardStats(BaseModel):
    total_predictions: int
    high_risk_count: int
    low_risk_count: int
    today_predictions: int
    total_patients: int