### Backend

```bash
cd Back

# 1. Crear entorno virtual 
python -m venv venv
python3 -m venv venv #Linux

# 2. Activar entorno virtual
source venv/bin/activate        # Linux / Mac
venv\Scripts\activate           # Windows

# 3. Instalar dependencias en el entorno virtual
pip install -r requirements.txt

# 4. Iniciar API 
uvicorn main:app --reload --port 8000
```
### DataBase

Despues de ejecutar el comando anterior para iniciar la API, en el archivo `main.py` se llama una funcion para
generar unos datos de prueba. 


### Frontend

```bash
cd Front
pnpm install
pnpm run dev
```