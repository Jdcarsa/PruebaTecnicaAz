from enum import Enum
from pydantic import BaseModel, Field, field_serializer
from typing import Optional
from datetime import datetime

class EstadoTarea(str, Enum):
    PENDIENTE = "pendiente"
    EN_PROGRESO = "en_progreso"
    COMPLETADA = "completada"

class TareaBase(BaseModel):
    nombre: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Nombre único de la tarea",
        examples=["Comprar leche"],
    )
    descripcion: str = Field(
        ...,
        max_length=255,
        description="Descripción detallada de la tarea",
        examples=["Ir al supermercado y comprar leche entera"],
    )
    estado: Optional[EstadoTarea] = Field(
        EstadoTarea.PENDIENTE,
        description="Estado actual de la tarea",
        examples=["pendiente"],
    )
    categoria_id: int = Field(
        None,
        description="ID de la categoría a la que pertenece",
        examples=[1],
    )

class TareaCreate(TareaBase):
    pass

class TareaUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    descripcion: Optional[str] = Field(None, max_length=255)
    estado: EstadoTarea = None
    categoria_id: int = None

class TareaOut(TareaBase):
    id: int
    fecha_creacion: datetime

    @field_serializer('fecha_creacion')
    def serialize_fecha(self, fecha: datetime, _info):
        return fecha.strftime('%Y-%m-%d')

    model_config = {
        "from_attributes": True
    }


