from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func 
from config.database import Base 

class Tarea(Base):

    __tablename__ = "tareas"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(100), unique=True, index=True, nullable=False)

    descripcion = Column(String(255), nullable=False)

    estado = Column(Enum("pendiente", "en_progreso", "completada"), nullable=False, default="pendiente")

    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())

    categoria_id = Column(Integer, nullable=True)

