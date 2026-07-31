import pandas as pd
from app.model import model

def predict_heart_disease(patient):
    data = pd.DataFrame([patient.model_dump()])
    prediction = model.predict(data)

    return int(prediction[0])