# GlamFinds - AI Service

Microservicio de visión por computador con FastAPI.


#### Comando para correr el ai service

uvicorn app:app --reload --host 0.0.0.0 --port 8000


## Modelos utilizados

- Segmentación: `sayeed99/segformer-b3-fashion`
- Detección zero-shot: `google/owlvit-base-patch32`
- Face mesh: MediaPipe

## Endpoints

- `POST /analyze-outfit` - Análisis completo de outfit
- `POST /segment-outfit` - Segmentación de prendas
- `POST /detect-jewelry` - Detección de joyería
- `POST /detect-makeup` - Detección de maquillaje
