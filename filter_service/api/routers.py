from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from filter_service.filter import filter_service

router = APIRouter()

class AppendRequest(BaseModel):
    spendings: Dict[str, str]
    category: str

@router.get("/", status_code=200)
def health_check():
    return {"status": "ok"}

@router.post("/api/filter")
def filter(req: AppendRequest):
    result = filter_service(req.spendings, req.category)

    return result