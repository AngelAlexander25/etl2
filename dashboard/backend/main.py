from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Optional, List
from datetime import datetime
import json
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Crear aplicación FastAPI
app = FastAPI(
    title="Cancún Real Estate API",
    description="API para análisis del mercado inmobiliario en Cancún",
    version="1.0.0"
)

# Configurar CORS - permitir Netlify y localhost
allowed_origins = [
    "http://localhost:3000",  # Desarrollo local
    "https://*.netlify.app",  # Cualquier sitio de Netlify
    os.getenv("FRONTEND_URL", "http://localhost:3000"),  # URL del frontend desde env
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de la base de datos desde variables de entorno
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 5432)),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', '25092002'),
    'database': os.getenv('DB_NAME', 'cancun_real_estate')
}

def get_db_connection():
    """Crea una conexión a PostgreSQL"""
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)

# ==================== ENDPOINTS ====================

@app.get("/")
def read_root():
    """Endpoint raíz - verifica que la API está funcionando"""
    return {
        "message": "Cancún Real Estate API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/api/stats")
def get_stats(
    zone: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    has_pool: Optional[bool] = Query(None),
    has_ocean_view: Optional[bool] = Query(None)
):
    """
    Obtiene estadísticas generales (KPIs)
    Retorna: total propiedades, precio promedio, etc.
    Aplica filtros si se proporcionan
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Construir consulta WHERE dinámicamente
    where_conditions = []
    params = []
    
    if zone:
        where_conditions.append("zone = %s")
        params.append(zone)
    
    if property_type:
        where_conditions.append("property_type = %s")
        params.append(property_type)
    
    if min_price is not None:
        where_conditions.append("price >= %s")
        params.append(min_price)
    
    if max_price is not None:
        where_conditions.append("price <= %s")
        params.append(max_price)
    
    if bedrooms is not None:
        where_conditions.append("bedrooms = %s")
        params.append(bedrooms)
    
    if has_pool is not None:
        where_conditions.append("has_pool = %s")
        params.append(has_pool)
    
    if has_ocean_view is not None:
        where_conditions.append("has_ocean_view = %s")
        params.append(has_ocean_view)
    
    where_clause = "WHERE " + " AND ".join(where_conditions) if where_conditions else ""
    
    # Total de propiedades
    query = f"SELECT COUNT(*) as total FROM properties {where_clause}"
    cursor.execute(query, params)
    total_properties = cursor.fetchone()['total']
    
    # Precio promedio
    query = f"SELECT AVG(price) as avg_price FROM properties {where_clause}"
    cursor.execute(query, params)
    avg_price = cursor.fetchone()['avg_price']
    
    # Precio mínimo y máximo
    query = f"SELECT MIN(price) as min_price, MAX(price) as max_price FROM properties {where_clause}"
    cursor.execute(query, params)
    price_range = cursor.fetchone()
    
    # Propiedades por zona
    query = f"""
        SELECT zone, COUNT(*) as count 
        FROM properties 
        {where_clause}
        GROUP BY zone 
        ORDER BY count DESC
    """
    cursor.execute(query, params)
    properties_by_zone = cursor.fetchall()
    
    # Propiedades disponibles
    if where_conditions:
        where_conditions_available = where_conditions.copy()
        params_available = params.copy()
    else:
        where_conditions_available = []
        params_available = []
    
    where_conditions_available.append("status = %s")
    params_available.append('Disponible')
    where_clause_available = "WHERE " + " AND ".join(where_conditions_available)
    
    query = f"SELECT COUNT(*) as available FROM properties {where_clause_available}"
    cursor.execute(query, params_available)
    available = cursor.fetchone()['available']
    
    cursor.close()
    conn.close()
    
    return {
        "total_properties": int(total_properties) if total_properties else 0,
        "average_price": float(avg_price) if avg_price else 0.0,
        "min_price": float(price_range['min_price']) if price_range and price_range['min_price'] else 0.0,
        "max_price": float(price_range['max_price']) if price_range and price_range['max_price'] else 0.0,
        "available_properties": int(available) if available else 0,
        "properties_by_zone": properties_by_zone if properties_by_zone else []
    }

@app.get("/api/properties")
def get_properties(
    zone: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    has_pool: Optional[bool] = Query(None),
    has_ocean_view: Optional[bool] = Query(None),
    limit: int = Query(100)
):
    """
    Obtiene lista de propiedades con filtros opcionales
    
    Parámetros:
    - zone: Filtrar por zona (ej: "Zona Hotelera")
    - property_type: Filtrar por tipo (ej: "Departamento")
    - min_price: Precio mínimo
    - max_price: Precio máximo
    - bedrooms: Número de recámaras
    - has_pool: Tiene alberca (true/false)
    - has_ocean_view: Tiene vista al mar (true/false)
    - limit: Cuántas propiedades retornar (máximo)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Construir query dinámicamente según los filtros
    query = "SELECT * FROM properties WHERE 1=1"
    params = []
    
    if zone:
        query += " AND zone = %s"
        params.append(zone)
    
    if property_type:
        query += " AND property_type = %s"
        params.append(property_type)
    
    if min_price:
        query += " AND price >= %s"
        params.append(min_price)
    
    if max_price:
        query += " AND price <= %s"
        params.append(max_price)
    
    if bedrooms:
        query += " AND bedrooms = %s"
        params.append(bedrooms)
    
    if has_pool is not None:
        query += " AND has_pool = %s"
        params.append(has_pool)
    
    if has_ocean_view is not None:
        query += " AND has_ocean_view = %s"
        params.append(has_ocean_view)
    
    query += f" ORDER BY listing_date DESC LIMIT {limit}"
    
    cursor.execute(query, params)
    properties = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return {"properties": properties, "count": len(properties)}

@app.get("/api/properties/{property_id}")
def get_property_detail(property_id: int):
    """
    Obtiene detalles de una propiedad específica
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM properties WHERE id = %s", (property_id,))
    property_data = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if property_data:
        return property_data
    else:
        return {"error": "Propiedad no encontrada"}

@app.get("/api/map-data")
def get_map_data(
    zone: Optional[str] = Query(None),
    property_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    has_pool: Optional[bool] = Query(None),
    has_ocean_view: Optional[bool] = Query(None)
):
    """
    Obtiene datos para el mapa (lat, lon, precio)
    Optimizado para no enviar todos los campos
    Aplica todos los filtros disponibles
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        SELECT id, zone, property_type, price, latitude, longitude, 
               bedrooms, has_ocean_view, neighborhood, has_pool
        FROM properties 
        WHERE 1=1
    """
    
    params = []
    
    if zone:
        query += " AND zone = %s"
        params.append(zone)
    
    if property_type:
        query += " AND property_type = %s"
        params.append(property_type)
    
    if min_price is not None:
        query += " AND price >= %s"
        params.append(min_price)
    
    if max_price is not None:
        query += " AND price <= %s"
        params.append(max_price)
    
    if bedrooms is not None:
        query += " AND bedrooms = %s"
        params.append(bedrooms)
    
    if has_pool is not None:
        query += " AND has_pool = %s"
        params.append(has_pool)
    
    if has_ocean_view is not None:
        query += " AND has_ocean_view = %s"
        params.append(has_ocean_view)
    
    query += " LIMIT 500"  # Limitar para no sobrecargar el mapa
    
    cursor.execute(query, params)
    map_data = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    # Retornar como array directamente para que sea compatible con el frontend
    return map_data

@app.get("/api/zones")
def get_zones():
    """
    Obtiene información de todas las zonas
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM zones ORDER BY property_count DESC")
    zones = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return {"zones": zones}

@app.get("/api/trends")
def get_trends(zone: Optional[str] = None, property_type: Optional[str] = None):
    """
    Obtiene tendencias de precios (últimos 12 meses)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        SELECT zone, property_type, month, average_price, median_price, total_listings
        FROM price_trends
        WHERE 1=1
    """
    
    params = []
    if zone:
        query += " AND zone = %s"
        params.append(zone)
    
    if property_type:
        query += " AND property_type = %s"
        params.append(property_type)
    
    query += " ORDER BY month ASC"
    
    cursor.execute(query, params)
    trends = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return {"trends": trends, "count": len(trends)}

@app.get("/api/price-comparison")
def get_price_comparison():
    """
    Compara precios promedio entre zonas
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            zone,
            AVG(price) as avg_price,
            AVG(price_per_sqm) as avg_price_per_sqm,
            COUNT(*) as property_count
        FROM properties
        GROUP BY zone
        ORDER BY avg_price DESC
    """)
    
    comparison = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return {"zones": comparison}

@app.get("/api/roi-calculator")
def calculate_roi(
    property_price: float,
    monthly_rent: float = Query(..., description="Renta mensual estimada"),
    annual_appreciation: float = Query(10.0, description="Plusvalía anual (%)")
):
    """
    Calcula el ROI (Return on Investment)
    
    Parámetros:
    - property_price: Precio de la propiedad
    - monthly_rent: Renta mensual estimada
    - annual_appreciation: Plusvalía anual en porcentaje
    """
    
    # Cálculos
    annual_rent = monthly_rent * 12
    rental_yield = (annual_rent / property_price) * 100
    
    # Gastos estimados (30% de la renta)
    annual_expenses = annual_rent * 0.30
    net_annual_income = annual_rent - annual_expenses
    
    # ROI total (renta + plusvalía)
    total_roi = rental_yield + annual_appreciation
    
    # Años para recuperar inversión
    payback_years = property_price / net_annual_income if net_annual_income > 0 else 0
    
    return {
        "property_price": property_price,
        "annual_rent": annual_rent,
        "rental_yield": round(rental_yield, 2),
        "annual_appreciation": annual_appreciation,
        "total_roi": round(total_roi, 2),
        "net_annual_income": round(net_annual_income, 2),
        "payback_years": round(payback_years, 1)
    }

@app.get("/api/filters/options")
def get_filter_options():
    """
    Obtiene las opciones disponibles para los filtros
    (zonas, tipos de propiedad, rangos, etc.)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Zonas únicas
    cursor.execute("SELECT DISTINCT zone FROM properties ORDER BY zone")
    zones = [row['zone'] for row in cursor.fetchall()]
    
    # Tipos de propiedad únicos
    cursor.execute("SELECT DISTINCT property_type FROM properties ORDER BY property_type")
    property_types = [row['property_type'] for row in cursor.fetchall()]
    
    # Rango de precios
    cursor.execute("SELECT MIN(price) as min, MAX(price) as max FROM properties")
    price_range = cursor.fetchone()
    
    # Rango de recámaras
    cursor.execute("SELECT MIN(bedrooms) as min, MAX(bedrooms) as max FROM properties")
    bedroom_range = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    return {
        "zones": zones,
        "property_types": property_types,
        "price_range": {
            "min": float(price_range['min']) if price_range['min'] else 0,
            "max": float(price_range['max']) if price_range['max'] else 0
        },
        "bedroom_range": {
            "min": int(bedroom_range['min']) if bedroom_range['min'] else 0,
            "max": int(bedroom_range['max']) if bedroom_range['max'] else 0
        }
    }

# ==================== MAIN ====================

if __name__ == "__main__":
    import uvicorn
    print("Iniciando servidor FastAPI...")
    print("API disponible en: http://localhost:8000")
    print("Documentación en: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)