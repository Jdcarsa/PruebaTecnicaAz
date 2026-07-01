from pydantic import BaseModel, Field
from typing import Optional

class CategoriaBase(BaseModel):
    nombre: str = Field(
        ...,                
        min_length=1,
        max_length=100,
        description="Nombre único de la categoría",
        examples=["Trabajo"],
    )

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaOut(CategoriaBase):
    id: int
    model_config = {
        "from_attributes": True
    }


