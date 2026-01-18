import psycopg2
import json
import random
from datetime import datetime, timedelta
import numpy as np

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'user': 'postgres',
    'password': '25092002',
    'database': 'cancun_real_estate'
}

# Coordenadas GPS reales de cada zona en Cancún
ZONE_COORDINATES = {
    'Zona Hotelera': {'lat_min': 21.130, 'lat_max': 21.170, 'lon_min': -86.760, 'lon_max': -86.740},
    'Puerto Cancún': {'lat_min': 21.145, 'lat_max': 21.165, 'lon_min': -86.815, 'lon_max': -86.795},
    'Centro Cancún': {'lat_min': 21.150, 'lat_max': 21.175, 'lon_min': -86.825, 'lon_max': -86.805},
    'Región 15': {'lat_min': 21.140, 'lat_max': 21.160, 'lon_min': -86.850, 'lon_max': -86.830},
    'Playa del Carmen': {'lat_min': 20.620, 'lat_max': 20.640, 'lon_min': -87.080, 'lon_max': -87.060},
    'Tulum': {'lat_min': 20.210, 'lat_max': 20.230, 'lon_min': -87.460, 'lon_max': -87.440},
    'Puerto Morelos': {'lat_min': 20.845, 'lat_max': 20.865, 'lon_min': -86.880, 'lon_max': -86.860}
}

# Distribución de propiedades por zona (total 2000)
ZONE_DISTRIBUTION = {
    'Zona Hotelera': 250,
    'Puerto Cancún': 200,
    'Centro Cancún': 600,
    'Región 15': 350,
    'Playa del Carmen': 350,
    'Tulum': 150,
    'Puerto Morelos': 100
}

# Tipos de propiedad y sus probabilidades
PROPERTY_TYPES = {
    'Departamento': 0.60,
    'Casa': 0.25,
    'Villa': 0.10,
    'Penthouse': 0.05
}

def load_lamudi_data():
    """Carga los datos reales de Lamudi"""
    print("Cargando datos reales de Lamudi...")
    
    with open('data_real/lamudi_zonas_data.json', 'r', encoding='utf-8') as f:
        zonas_data = json.load(f)
    
    with open('data_real/market_trends.json', 'r', encoding='utf-8') as f:
        trends = json.load(f)
    
    return zonas_data, trends

def generate_property(zone, zone_data, property_type):
    """Genera una propiedad basada en datos reales de mercado"""
    
    # Precio base según zona y tipo (datos reales de Lamudi)
    precio_min = zone_data['precio_min']
    precio_max = zone_data['precio_max']
    precio_m2 = zone_data['precio_promedio_m2']
    
    # Ajustar precio según tipo
    if property_type == 'Departamento':
        precio_base = random.uniform(precio_min, precio_min + (precio_max - precio_min) * 0.4)
        bedrooms = random.choices([1, 2, 3], weights=[0.3, 0.5, 0.2])[0]
        bathrooms = random.choices([1, 1.5, 2, 2.5], weights=[0.2, 0.3, 0.4, 0.1])[0]
        total_sqm = random.uniform(60, 180)
        
    elif property_type == 'Casa':
        precio_base = random.uniform(precio_min + (precio_max - precio_min) * 0.3, 
                                     precio_min + (precio_max - precio_min) * 0.7)
        bedrooms = random.choices([2, 3, 4], weights=[0.2, 0.6, 0.2])[0]
        bathrooms = random.choices([2, 2.5, 3, 3.5], weights=[0.3, 0.4, 0.2, 0.1])[0]
        total_sqm = random.uniform(150, 400)
        
    elif property_type == 'Villa':
        precio_base = random.uniform(precio_min + (precio_max - precio_min) * 0.6, precio_max)
        bedrooms = random.choices([3, 4, 5, 6], weights=[0.2, 0.4, 0.3, 0.1])[0]
        bathrooms = random.choices([3, 3.5, 4, 4.5, 5], weights=[0.2, 0.3, 0.2, 0.2, 0.1])[0]
        total_sqm = random.uniform(300, 800)
        
    else:  # Penthouse
        precio_base = random.uniform(precio_min + (precio_max - precio_min) * 0.7, precio_max * 1.2)
        bedrooms = random.choices([2, 3, 4], weights=[0.3, 0.5, 0.2])[0]
        bathrooms = random.choices([2, 2.5, 3, 3.5], weights=[0.2, 0.3, 0.3, 0.2])[0]
        total_sqm = random.uniform(150, 350)
    
    # Metros construidos (90-95% del total)
    built_sqm = total_sqm * random.uniform(0.90, 0.95)
    
    # Características adicionales
    has_pool = random.random() < 0.4
    has_ocean_view = random.random() < 0.3 if zone in ['Zona Hotelera', 'Playa del Carmen', 'Tulum'] else random.random() < 0.1
    gated_community = random.random() < 0.7
    furnished = random.random() < 0.5
    
    # Ajustar precio según características (datos reales de plusvalía)
    precio_final = precio_base
    
    if has_ocean_view:
        precio_final *= 1.30
    if has_pool:
        precio_final *= 1.15
    if furnished:
        precio_final *= 1.20
    if gated_community:
        precio_final *= 1.10
    
    # Calcular precio por m2
    price_per_sqm = precio_final / total_sqm
    
    # Coordenadas GPS reales de la zona
    coords = ZONE_COORDINATES[zone]
    latitude = random.uniform(coords['lat_min'], coords['lat_max'])
    longitude = random.uniform(coords['lon_min'], coords['lon_max'])
    
    # Distancia a playa según zona
    if zone in ['Zona Hotelera', 'Playa del Carmen']:
        distance_to_beach = random.randint(50, 500)
    elif zone in ['Tulum', 'Puerto Morelos']:
        distance_to_beach = random.randint(200, 1500)
    else:
        distance_to_beach = random.randint(2000, 8000)
    
    # Año de construcción (mayoría recientes)
    year_weights = [0.05, 0.15, 0.80]
    year_ranges = [
        (2005, 2009),
        (2010, 2014),
        (2015, 2024)
    ]
    selected_range = random.choices(year_ranges, weights=year_weights)[0]
    year_built = random.randint(selected_range[0], selected_range[1])
    
    # Fecha de listado (últimos 12 meses)
    days_ago = random.randint(0, 365)
    listing_date = (datetime.now() - timedelta(days=days_ago)).date()
    
    # Vecindario según zona
    neighborhoods = {
        'Zona Hotelera': ['Kukulcan', 'Punta Cancún', 'Zona Hotelera Norte'],
        'Puerto Cancún': ['Marina Town Center', 'The Harbour', 'Puerto Cancún Residential'],
        'Centro Cancún': ['SM 23', 'SM 25', 'SM 26', 'SM 28'],
        'Región 15': ['SM 15', 'SM 17', 'Supermanzana 15'],
        'Playa del Carmen': ['Centro', 'Playacar', 'Quinta Avenida'],
        'Tulum': ['Aldea Zama', 'La Veleta', 'Zona Hotelera Tulum'],
        'Puerto Morelos': ['Centro', 'Zona Costera', 'Residencial']
    }
    neighborhood = random.choice(neighborhoods[zone])
    
    return {
        'property_type': property_type,
        'price': round(precio_final, 2),
        'bedrooms': bedrooms,
        'bathrooms': bathrooms,
        'total_sqm': round(total_sqm, 2),
        'built_sqm': round(built_sqm, 2),
        'zone': zone,
        'neighborhood': neighborhood,
        'latitude': round(latitude, 8),
        'longitude': round(longitude, 8),
        'distance_to_beach': distance_to_beach,
        'has_pool': has_pool,
        'has_ocean_view': has_ocean_view,
        'gated_community': gated_community,
        'furnished': furnished,
        'year_built': year_built,
        'listing_date': listing_date,
        'price_per_sqm': round(price_per_sqm, 2),
        'status': 'Disponible'
    }

def insert_property(cursor, property_data):
    """Inserta una propiedad en la base de datos"""
    cursor.execute("""
        INSERT INTO properties (
            property_type, price, bedrooms, bathrooms, total_sqm, built_sqm,
            zone, neighborhood, latitude, longitude, distance_to_beach,
            has_pool, has_ocean_view, gated_community, furnished,
            year_built, listing_date, price_per_sqm, status
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
    """, (
        property_data['property_type'],
        property_data['price'],
        property_data['bedrooms'],
        property_data['bathrooms'],
        property_data['total_sqm'],
        property_data['built_sqm'],
        property_data['zone'],
        property_data['neighborhood'],
        property_data['latitude'],
        property_data['longitude'],
        property_data['distance_to_beach'],
        property_data['has_pool'],
        property_data['has_ocean_view'],
        property_data['gated_community'],
        property_data['furnished'],
        property_data['year_built'],
        property_data['listing_date'],
        property_data['price_per_sqm'],
        property_data['status']
    ))

def generate_price_trends(cursor, zonas_data):
    """Genera tendencias de precios de los últimos 12 meses"""
    print("\nGenerando tendencias de precios...")
    
    # Últimos 12 meses
    months = []
    current_date = datetime.now().date()
    for i in range(12, 0, -1):
        month_date = current_date.replace(day=1) - timedelta(days=30*i)
        months.append(month_date)
    
    for zone, zone_data in zonas_data.items():
        precio_base = zone_data['precio_promedio_m2']
        plusvalia_mensual = zone_data['plusvalia_anual'] / 12 / 100
        
        for property_type in ['Departamento', 'Casa', 'Villa', 'Penthouse']:
            for month in months:
                # Calcular precio con crecimiento
                meses_atras = (current_date.year - month.year) * 12 + (current_date.month - month.month)
                factor_crecimiento = (1 + plusvalia_mensual) ** meses_atras
                
                avg_price = precio_base * factor_crecimiento * random.uniform(80, 120)
                median_price = avg_price * random.uniform(0.95, 1.05)
                total_listings = random.randint(10, 100)
                
                cursor.execute("""
                    INSERT INTO price_trends (zone, property_type, month, average_price, median_price, total_listings)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (zone, property_type, month, avg_price, median_price, total_listings))

def main():
    print("=" * 70)
    print("  GENERACION DE 2000 PROPIEDADES - BASADO EN DATOS REALES LAMUDI")
    print("=" * 70)
    
    # Cargar datos reales
    zonas_data, trends = load_lamudi_data()
    print("Datos reales cargados correctamente")
    
    # Conectar a base de datos
    print("\nConectando a PostgreSQL...")
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    print("Iniciando generación de propiedades...\n")
    
    total_generated = 0
    
    for zone, quantity in ZONE_DISTRIBUTION.items():
        print(f"Generando {quantity} propiedades en {zone}...")
        zone_data = zonas_data[zone]
        
        for i in range(quantity):
            # Elegir tipo de propiedad según probabilidades
            property_type = random.choices(
                list(PROPERTY_TYPES.keys()),
                weights=list(PROPERTY_TYPES.values())
            )[0]
            
            # Generar propiedad
            property_data = generate_property(zone, zone_data, property_type)
            
            # Insertar en base de datos
            insert_property(cursor, property_data)
            
            total_generated += 1
            
            if (i + 1) % 50 == 0:
                print(f"  {i + 1}/{quantity} completadas")
        
        print(f"  {zone} completado!\n")
    
    # Generar tendencias
    generate_price_trends(cursor, zonas_data)
    
    # Actualizar contadores en tabla zones
    print("Actualizando estadísticas de zonas...")
    for zone in ZONE_DISTRIBUTION.keys():
        cursor.execute("""
            UPDATE zones 
            SET property_count = (SELECT COUNT(*) FROM properties WHERE zone = %s)
            WHERE zone_name = %s
        """, (zone, zone))
    
    # Commit
    conn.commit()
    
    # Mostrar resumen
    print("\n" + "=" * 70)
    print("GENERACION COMPLETADA")
    print("=" * 70)
    
    cursor.execute("SELECT COUNT(*) FROM properties")
    total = cursor.fetchone()[0]
    print(f"\nTotal de propiedades generadas: {total}")
    
    cursor.execute("SELECT zone, COUNT(*) FROM properties GROUP BY zone ORDER BY COUNT(*) DESC")
    print("\nPropiedades por zona:")
    for zone, count in cursor.fetchall():
        print(f"  {zone}: {count}")
    
    cursor.execute("SELECT property_type, COUNT(*) FROM properties GROUP BY property_type")
    print("\nPropiedades por tipo:")
    for ptype, count in cursor.fetchall():
        print(f"  {ptype}: {count}")
    
    cursor.execute("SELECT AVG(price) FROM properties")
    avg_price = cursor.fetchone()[0]
    print(f"\nPrecio promedio: ${avg_price:,.2f} MXN")
    
    cursor.execute("SELECT COUNT(*) FROM price_trends")
    trends_count = cursor.fetchone()[0]
    print(f"Tendencias generadas: {trends_count} registros")
    
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 70)
    print("BASE DE DATOS LISTA PARA USAR")
    print("=" * 70)
    print("\nSiguiente paso: Crear el dashboard de visualización")

if __name__ == "__main__":
    main()