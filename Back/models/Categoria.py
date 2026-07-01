from sqlalchemy import Column, Integer, String
from config.database import Base 
from sqlalchemy.orm import relationship

class Categoria(Base):

    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(100), unique=True, index=True, nullable=False)

    tareas = relationship("Tarea", back_populates="categoria", cascade="all, delete-orphan")