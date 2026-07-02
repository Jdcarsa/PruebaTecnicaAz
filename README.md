# Prueba Técnica AZ Smart

## Tecnologías

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy
- SQLite

### Frontend
- React 18
- TypeScript
- Bootstrap 5
- Vite

### Estructura del proyecto

```
Back/
├── config/
│   └── database.py              # Configuración de BD
|   └── datos.py                 # Datos de prueba 
├── controllers/
│   ├── CategoriasController.py  # Endpoints de categorías
│   └── TareasController.py      # Endpoints de tareas
├── models/
│   ├── Categoria.py             # Modelo Categoria
│   └── Tarea.py                 # Modelo Tarea
├── schemas/
│   ├── Categoria.py             # Schemas de categorías
│   └── Tarea.py                 # Schemas de tareas
├── main.py                      # Punto de entrada
└── requirements.txt

Front/
├── src/
│   ├── pages/
│   │   └── TareasPage.tsx       # Página principal
│   ├── services/
│   │   ├── TareasService.ts     # API de tareas
│   │   └── CategoriaService.ts  # API de categorías
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts

BD/
├── tablas.sql

```

## Instalación y ejecución

### Backend

```bash
cd Back

# 1. Crear entorno virtual
python -m venv venv

# 2. Activar entorno virtual
source venv/bin/activate        # Linux / Mac
venv\Scripts\activate           # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Iniciar API 
uvicorn main:app --reload --port 8000
```

La API estará disponible en: http://localhost:8000/docs
Al iniciar, se crean automáticamente datos de ejemplo.

### Frontend

```bash
cd Front

# Instalar dependencias
npm install
# o
pnpm install

# Iniciar desarrollo
npm run dev
# o
pnpm run dev
```

El frontend estará disponible en: http://localhost:5173

## Preguntas de reflexión

### 1. ¿Cómo evitarías la inyección SQL en este proyecto?

El proyecto usa **SQLAlchemy ORM**, que previene la inyección SQL mediante **parametrización automática** de consultas.El ORM genera SQL con placeholders (`?` o `:param`) y los valores se pasan por separado, haciendo imposible la inyección.  Tambien para evitar la inyeccion de sql se debe hacer exclusivo de ORM, no incluir consutlas sql y sanitizar los campos de en el front

### 2. Si la tabla de tareas llegara a 100.000 registros, ¿qué cambiarías?

Si la tabla de tareas llegara a 100.000 registros, primero crearía índices en las columnas más consultadas como estado, categoria_id y fecha_creacion para acelerar las búsquedas, y añadiría paginación limitando los resultados a unos 50 por página en lugar de devolver todo de golpe.

### 3. ¿Qué harías diferente o agregarías si tuvieras más tiempo?

Si tuviera más tiempo, en el backend lo primero que haría sería migrar de MVC a Clean Architecture, separando Domain, Application e Infrastructure. Además, añadiría pruebas unitarias con pytest y pruebas de integración, y también implementaría un manejo global de errores junto con logging centralizado.

En cuanto al frontend, crearía componentes reutilizables como Input, Button, Table y Modal, y extraería la lógica en custom hooks como useTareas y useFiltros. Asimismo, reemplazaría Bootstrap por Shadcn/ui para tener componentes más robustos, añadiría React Router para la navegación y, por último, sumaría pruebas con React Testing Library.

