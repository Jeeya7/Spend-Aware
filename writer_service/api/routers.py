from fastapi import APIRouter
from pydantic import BaseModel
from writer_service.writer import append_expense

router = APIRouter()

class AppendRequest(BaseModel):
    title: str
    category: str

@router.get("/", status_code=200)
def health_check():
    return {"status": "ok"}

@router.post("/api/append_expense")
def predict(req: AppendRequest):
    result = append_expense(req.title, req.category)

    if result:
        return {"status": "saved"}
    else:
        return {"status": "error"}
