from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.predict_service import predict_service

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
