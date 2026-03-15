from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from visualizer_microservice.visualizer import visualize

router = APIRouter()


class ExpenseItem(BaseModel):
    title: str
    category: Optional[str]
    amount: float


class VisualizeRequest(BaseModel):
    expenses: List[ExpenseItem]


@router.get("/")
def root():
    return {"status": "ok", "service": "Visualizer Microservice"}


@router.post("/api/visualize")
def visualize_expenses(request: VisualizeRequest):

    img_buffer = visualize(request.expenses)

    return StreamingResponse(img_buffer, media_type="image/png")