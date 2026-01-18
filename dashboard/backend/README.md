# Backend FastAPI - Dashboard Cancún

## Descripción

Backend API construido con FastAPI que proporciona datos para el dashboard de propiedades en Cancún. Maneja 2000 propiedades con análisis de mercado en tiempo real.

**Creado por:** Angel Alexander

## Stack Tecnológico

- **FastAPI** - Framework web moderno para APIs
- **PostgreSQL** - Base de datos relacional
- **SQLAlchemy** - ORM para Python
- **Pydantic** - Validación de datos
- **Python 3.10+**

## Requisitos

```bash
# Windows PowerShell / CMD
python --version  # Debe ser 3.10+
pip install -r requirements.txt
```

## Instalación

```bash
# 1. Crear virtual environment (recomendado)
python -m venv venv
venv\Scripts\activate

# 2. Instalar dependencias
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv

# 3. Configurar base de datos
# Crear archivo .env con:
DATABASE_URL=postgresql://user:password@localhost/cancun_properties
DEBUG=True

# 4. Inicializar base de datos
python -c "from database import init_db; init_db()"

# 5. Cargar datos
python load_data.py
```

## Iniciar el Servidor

```bash
# Modo desarrollo
python main.py

# O manualmente con uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Accesible en:
- **API**: http://localhost:8000
- **Documentación**: http://localhost:8000/docs
- **Documentación alternativa**: http://localhost:8000/redoc

## API Endpoints

### Estadísticas Generales
```
GET /api/stats
```
Retorna: Total de propiedades, precio promedio, disponibilidad

### Listado de Propiedades
```
GET /api/properties?zone=Centro&property_type=Departamento&min_price=1000000&max_price=5000000&limit=50
```
Filtros disponibles:
- `zone`: Nombre de la zona
- `property_type`: Departamento, Casa, Villa, Penthouse
- `min_price` / `max_price`: Rango de precio
- `bedrooms`: Número de recámaras
- `has_pool`: true/false
- `has_ocean_view`: true/false
- `limit`: Número máximo de resultados (default 50)
- `offset`: Para paginación

### Datos para Mapa
```
GET /api/map-data
```
Retorna: Propiedades con coordenadas para mostrar en mapa

### Tendencias de Precios
```
GET /api/trends
```
Retorna: Datos históricos de precios últimos 12 meses

### Opciones para Filtros
```
GET /api/filters/options
```
Retorna: Zonas disponibles, tipos de propiedad, rangos de precio

### Calculadora ROI
```
POST /api/roi-calculator
Content-Type: application/json

{
  "property_price": 5000000,
  "monthly_rent": 50000,
  "appreciation_rate": 0.05,
  "years": 10
}
```

### Comparación de Precios
```
GET /api/price-comparison
```
Retorna: Análisis de precio por m² por zona

## Estructura de Datos

### Propiedad
```json
{
  "id": 1,
  "property_type": "Departamento",
  "zone": "Centro Cancún",
  "price": 5000000,
  "bedrooms": 3,
  "bathrooms": 2,
  "area_sqm": 150,
  "has_pool": true,
  "has_ocean_view": true,
  "address": "Av. Tulum #100",
  "latitude": 21.1633,
  "longitude": -87.0432,
  "created_at": "2024-01-15T10:30:00"
}
```

## Zonas Disponibles

1. Centro Cancún
2. Playa del Carmen
3. Región 15
4. Zona Hotelera
5. Puerto Cancún
6. Tulum
7. Puerto Morelos

## Tipos de Propiedad

- Departamento
- Casa
- Villa
- Penthouse

## CORS

El servidor permite requests desde:
- http://localhost:3000 (desarrollo)
- http://127.0.0.1:3000

Para agregar más orígenes, edita la configuración en `main.py`.

## Manejo de Errores

### Errores Comunes

**500 - Error de Conexión a BD**
```
Solución: Verifica que PostgreSQL esté corriendo
psql -U postgres -d cancun_properties -c "SELECT COUNT(*) FROM properties;"
```

**422 - Validación Fallida**
```
Error: Parámetros inválidos
Solución: Revisa que los tipos sean correctos (int, str, bool)
```

**404 - Endpoint no encontrado**
```
Solución: Verifica la URL en http://localhost:8000/docs
```

## Performance

### Optimizaciones Implementadas

- Índices en campos frecuentes (price, zone, bedrooms)
- Caching de API con HTTP headers
- Paginación de resultados grandes
- Validación de entrada en Pydantic

### Tiempos de Respuesta Esperados

- GET /api/stats: <100ms
- GET /api/properties: <200ms (con 50 resultados)
- GET /api/map-data: <300ms (2000 propiedades)
- POST /api/roi-calculator: <50ms

## Desarrollo

### Agregar Nuevo Endpoint

```python
from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/api/mi-endpoint")
async def mi_endpoint(param: str):
    """Documentación del endpoint"""
    try:
        # Tu lógica aquí
        return {"resultado": "éxito"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# En main.py:
app.include_router(router)
```

### Agregar Nueva Propiedad a BD

```python
from database import SessionLocal
from models import Property

db = SessionLocal()
nueva_prop = Property(
    property_type="Casa",
    zone="Centro Cancún",
    price=3500000,
    # ... otros campos
)
db.add(nueva_prop)
db.commit()
```

## Deployment

### Docker

```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t cancun-api .
docker run -p 8000:8000 cancun-api
```

### Heroku

```bash
heroku create cancun-dashboard-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### AWS Lambda

```bash
pip install zappa
zappa init
zappa deploy production
```

## Logs y Debugging

```bash
# Modo verbose
uvicorn main:app --reload --log-level debug

# Ver queries SQL
# En database.py, descomentar:
# echo=True en create_engine()
```

## Testing

```bash
# Instalar pytest
pip install pytest pytest-asyncio httpx

# Ejecutar tests
pytest tests/

# Con coverage
pytest --cov=.
```

## Próximas Mejoras

- [ ] Sistema de autenticación
- [ ] Rate limiting
- [ ] Webhooks para cambios
- [ ] WebSockets para datos en tiempo real
- [ ] GraphQL alternativo

---

**Última actualización**: 2024
