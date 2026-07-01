from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.database import engine, Base
from controllers.CategoriasController import router as categorias_router
from controllers.TareasController import router as tareas_router

Base.metadata.create_all(bind=engine)

# ── Crear la aplicación ───────────────────────────────────────
app = FastAPI(
    title="Prueba Tecnica Az",
    description="API REST de tareas y categorías",
    version="1.0.0",
    docs_url="/docs",       
    redoc_url="/redoc",    
)

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],           # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],
)

# ── Registrar routers ──────────────────────────
app.include_router(categorias_router)
app.include_router(tareas_router)

# ── Ruta de salud ─────────────────────────────────────────────
@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "mensaje": "API funcionando",
        "docs": "http://localhost:8000/docs",
    }
