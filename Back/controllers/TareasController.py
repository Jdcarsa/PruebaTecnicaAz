from models.Categoria import Categoria
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from config.database import get_db
from models.Tarea import Tarea
from schemas.Tarea import (
    TareaCreate,
    TareaUpdate,
    TareaOut,
)

router = APIRouter(
    prefix="/tareas",
    tags=["Tareas"],
)

@router.post("/", response_model=TareaOut, status_code=status.HTTP_201_CREATED)
def createTarea(tarea: TareaCreate, db: Session = Depends(get_db)):

    if tarea.categoria_id:
        categoria = db.query(Categoria).filter(Categoria.id == tarea.categoria_id).first()
        if not categoria:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
        
    new_tarea = Tarea(**tarea.dict())
    db.add(new_tarea)
    db.commit()
    db.refresh(new_tarea)
    return new_tarea

@router.get("/", response_model=list[TareaOut])
def getTareas(estado: str = Query(None, description="Filtrar por estado de la tarea"),
    categoria_nombre: str = Query(None, description="Filtrar por categoría"),
    db: Session = Depends(get_db)):

    query = db.query(Tarea)

    if estado:
        query = query.filter(Tarea.estado == estado)
    if categoria_nombre:
        query = query.join(Categoria).filter(Categoria.nombre == categoria_nombre)

    tareas = query.all()

    return tareas


@router.put("/{tarea_id}", response_model=TareaOut)
def updateTarea(tarea_id: int, tarea: TareaUpdate, db: Session = Depends(get_db)):

    existing_tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
    if not existing_tarea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarea no encontrada"
        )

    if tarea.categoria_id is not None:
        categoria = db.query(Categoria).filter(Categoria.id == tarea.categoria_id).first()
        if not categoria:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="La categoría especificada no existe"
            )

    for key, value in tarea.dict(exclude_unset=True).items():
        setattr(existing_tarea, key, value)

    db.commit()
    db.refresh(existing_tarea)

    return existing_tarea

@router.delete("/{tarea_id}", status_code=status.HTTP_204_NO_CONTENT)
def deleteTarea(tarea_id: int, db: Session = Depends(get_db)):

    existing_tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()

    if not existing_tarea:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarea no encontrada")

    db.delete(existing_tarea)
    db.commit()
    return None

