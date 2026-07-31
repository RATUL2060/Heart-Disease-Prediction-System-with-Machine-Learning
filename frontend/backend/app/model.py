import pickle
from pathlib import Path

# Go up from app/ → backend/ → frontend/ → project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

MODEL_PATH = BASE_DIR / "models" / "model.sav"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)