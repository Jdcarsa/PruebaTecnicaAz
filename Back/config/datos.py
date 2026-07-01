
from sqlalchemy.orm import Session
from models.Categoria import Categoria
from models.Tarea import Tarea
from config.database import SessionLocal

def cargarDatosPrueba():
    db: Session = SessionLocal()

    if db.query(Categoria).count() == 0:
        categoria1 = Categoria(nombre="Trabajo")
        categoria2 = Categoria(nombre="Personal")
        db.add(categoria1)
        db.add(categoria2)
        db.commit()

    if db.query(Tarea).count() == 0:

        tarea1 = Tarea(nombre="Reunión con el equipo", descripcion="Reunión semanal del equipo de desarrollo", estado="pendiente", categoria_id=1)
        tarea2 = Tarea(nombre="Comprar víveres", descripcion="Comprar leche, pan y huevos", estado="pendiente", categoria_id=2)
        db.add(tarea1)
        db.add(tarea2)
        db.commit()

    db.close()