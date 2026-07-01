from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from config.database import get_db

from models.Categoria import Categoria
from schemas.Categoria import (
    CategoriaCreate,
    CategoriaOut,
)

router = APIRouter(
    prefix="/categorias",
    tags=["Categorías"],
)

@router.get("/", response_model=list[CategoriaOut])
def get_categorias(db: Session = Depends(get_db)):
    categorias = db.query(Categoria).all()
    return categorias

