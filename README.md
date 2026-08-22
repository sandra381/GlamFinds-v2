# GlamFinds v2

Red social de moda con inteligencia artificial.

## Estructura del proyecto

- `frontend/` - Aplicación Angular 16+
- `backend/` - API REST Node.js + Express
- `ai_service/` - Microservicio Python FastAPI para análisis de imágenes

## Configuración rápida

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run dev

### 2. Frontend
cd frontend
npm install
ng serve

### 3.  AI Service
cd ai_service
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py


### Documentación
- Frontend
- Backend
- AI Service
