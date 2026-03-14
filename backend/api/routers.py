from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.predict_service import predict_service
from backend.services.train_services import train_service
from backend.services.fill_filter_services import fill_filter_service

router = APIRouter()

class PredictRequest(BaseModel):
    text: str

@router.get("/", status_code=200)
def health_check():
    return {"status": "ok"}

@router.post("/api/predict")
def predict(req: PredictRequest):
    prediction = predict_service(req.text)
    return {"prediction": prediction}

@router.post("/api/train")
def train():
    train_service()
    return {"status": "model retrained"}

@router.post("/api/fill_filter")
def fill_filter():
    return fill_filter_service()