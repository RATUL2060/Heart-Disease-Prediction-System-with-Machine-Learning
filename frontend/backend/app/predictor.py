import shap
import numpy as np
import pandas as pd
from app.model import model

# ── Human-readable feature names (must match model.feature_names_in_ order) ──
FEATURE_LABELS = {
    "Age":            "Age",
    "Sex":            "Sex",
    "ChestPainType":  "Chest Pain Type",
    "RestingBP":      "Resting Blood Pressure",
    "Cholesterol":    "Cholesterol",
    "FastingBS":      "Fasting Blood Sugar",
    "RestingECG":     "Resting ECG",
    "MaxHR":          "Maximum Heart Rate",
    "ExerciseAngina": "Exercise-Induced Angina",
    "Oldpeak":        "ST Depression (Oldpeak)",
    "ST_Slope":       "ST Slope",
}

# ── Cache the LinearExplainer once at module load (not per-request) ──
# maskers.Independent with a zero-row background implies interventional
# perturbation — appropriate for LogisticRegression (a linear model).
_explainer = shap.LinearExplainer(
    model,
    masker=shap.maskers.Independent(
        data=np.zeros((1, len(model.feature_names_in_))),
        max_samples=1
    ),
)


def predict_heart_disease(patient: "Patient"):
    """Run ML prediction and compute SHAP explanation. Returns dict."""
    # Build DataFrame in exact feature order the model expects
    feature_order = list(model.feature_names_in_)
    patient_dict = patient.model_dump()
    data = pd.DataFrame([patient_dict], columns=feature_order)

    # ── Prediction (unchanged) ──
    prediction = int(model.predict(data)[0])

    # ── SHAP values ──
    shap_values = _explainer.shap_values(data)
    # shap_values shape: (1, n_features) — take first (only) row
    sv = shap_values[0] if shap_values.ndim == 2 else shap_values

    # Build explanation list sorted by absolute SHAP value (descending)
    explanation = []
    for i, feat in enumerate(feature_order):
        shap_val = float(sv[i])
        explanation.append({
            "feature_name": FEATURE_LABELS[feat],
            "feature_key":  feat,
            "value":        patient_dict[feat],
            "shap_value":   round(shap_val, 6),
            "direction":    "higher_risk" if shap_val > 0 else "lower_risk",
        })
    explanation.sort(key=lambda x: abs(x["shap_value"]), reverse=True)

    return {
        "prediction":  prediction,
        "explanation": explanation,
    }