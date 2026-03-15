from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from category_color_mapping_service.color import assign_colors, reassign_colors

router = APIRouter()

@router.get("/")
def root():
    return {"status": "ok", "service": "Category Color Mapping Service"}


class CategoryRequest(BaseModel):
    categories: list[str]

@router.post("/api/category_colors")
def assign_colors_endpoint(request: CategoryRequest):
    result = assign_colors(request.categories)
    return result

class ReassignCategoryRequest(BaseModel):
    cat_colors: Dict
    category: str
    new_color: str
    

@router.post("/api/reassign_category_colors")
def reassign_category_colors(req: ReassignCategoryRequest):
    result = reassign_colors(req.cat_colors, req.category, req.new_color)
    
    return result