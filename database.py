import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Configuración de conexión
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'user': 'postgres',
    'password': '25092002'
}

def create_database():
    """Crea la base de datos cancun_real_estate si no existe"""
    print("🔄 Conectando a PostgreSQL...")
    
    try:
        # Conectar a la base de datos por defecto (postgres)
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database='postgres'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Verificar si la base de datos existe
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = 'cancun_real_estate'"
        )
        exists = cursor.fetchone()
        
        if exists:
            print("✅ La base de datos 'cancun_real_estate' ya existe")
        else:
            print("🔨 Creando base de datos 'cancun_real_estate'...")
            cursor.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier('cancun_real_estate')
                )
            )
            print("✅ Base de datos creada exitosamente")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error al crear la base de datos: {e}")
        return False
    
    return True

def create_tables():
    """Crea las tablas en la base de datos"""
    print("\n🔄 Conectando a la base de datos cancun_real_estate...")
    
    try:
        # Conectar a la nueva base de datos
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database='cancun_real_estate'
        )
        cursor = conn.cursor()
        
        # TABLA 1: properties (Propiedades)
        print("🔨 Creando tabla 'properties'...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS properties (
                id SERIAL PRIMARY KEY,
                property_type VARCHAR(50) NOT NULL,
                price DECIMAL(12, 2) NOT NULL,
                bedrooms INTEGER NOT NULL,
                bathrooms DECIMAL(3, 1) NOT NULL,
                total_sqm DECIMAL(8, 2) NOT NULL,
                built_sqm DECIMAL(8, 2) NOT NULL,
                zone VARCHAR(100) NOT NULL,
                neighborhood VARCHAR(100),
                latitude DECIMAL(10, 8) NOT NULL,
                longitude DECIMAL(11, 8) NOT NULL,
                distance_to_beach INTEGER NOT NULL,
                has_pool BOOLEAN DEFAULT FALSE,
                has_ocean_view BOOLEAN DEFAULT FALSE,
                gated_community BOOLEAN DEFAULT FALSE,
                furnished BOOLEAN DEFAULT FALSE,
                year_built INTEGER NOT NULL,
                listing_date DATE DEFAULT CURRENT_DATE,
                price_per_sqm DECIMAL(10, 2) NOT NULL,
                status VARCHAR(20) DEFAULT 'Disponible'
            )
        """)
        print("✅ Tabla 'properties' creada")
        
        # TABLA 2: zones (Zonas)
        print("🔨 Creando tabla 'zones'...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS zones (
                id SERIAL PRIMARY KEY,
                zone_name VARCHAR(100) UNIQUE NOT NULL,
                average_price DECIMAL(12, 2),
                property_count INTEGER DEFAULT 0,
                description TEXT,
                tourism_level VARCHAR(20)
            )
        """)
        print("✅ Tabla 'zones' creada")
        
        # TABLA 3: price_trends (Tendencias de precios)
        print("🔨 Creando tabla 'price_trends'...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS price_trends (
                id SERIAL PRIMARY KEY,
                zone VARCHAR(100) NOT NULL,
                property_type VARCHAR(50) NOT NULL,
                month DATE NOT NULL,
                average_price DECIMAL(12, 2) NOT NULL,
                median_price DECIMAL(12, 2) NOT NULL,
                total_listings INTEGER NOT NULL
            )
        """)
        print("✅ Tabla 'price_trends' creada")
        
        # Crear índices para búsquedas rápidas
        print("\n🔨 Creando índices...")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_zone ON properties(zone)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_property_type ON properties(property_type)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_price ON properties(price)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_location ON properties(latitude, longitude)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_status ON properties(status)")
        print("✅ Índices creados")
        
        # Insertar zonas iniciales
        print("\n🔨 Insertando zonas de Cancún...")
        zones_data = [
            ('Zona Hotelera', 6500000.00, 0, 'Frente al mar, zona turística premium', 'Alto'),
            ('Puerto Cancún', 9000000.00, 0, 'Marina exclusiva, zona de lujo', 'Alto'),
            ('Centro Cancún', 1800000.00, 0, 'Zona residencial local, más accesible', 'Medio'),
            ('Región 15', 2500000.00, 0, 'Zona residencial en desarrollo', 'Bajo'),
            ('Playa del Carmen', 4800000.00, 0, 'Zona turística, ambiente cosmopolita', 'Alto'),
            ('Tulum', 6500000.00, 0, 'Zona bohemia, cerca de ruinas mayas', 'Alto'),
            ('Puerto Morelos', 3500000.00, 0, 'Pueblo tranquilo, menos turístico', 'Medio')
        ]
        
        cursor.executemany("""
            INSERT INTO zones (zone_name, average_price, property_count, description, tourism_level)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (zone_name) DO NOTHING
        """, zones_data)
        print("✅ Zonas insertadas")
        
        # Confirmar cambios
        conn.commit()
        print("\n✅ ¡Todas las tablas fueron creadas exitosamente!")
        
        # Mostrar resumen
        cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
        table_count = cursor.fetchone()[0]
        print(f"\n📊 Resumen:")
        print(f"   - Tablas creadas: {table_count}")
        print(f"   - Base de datos: cancun_real_estate")
        print(f"   - Zonas precargadas: 7")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error al crear las tablas: {e}")
        return False
    
    return True

def verify_setup():
    """Verifica que todo se haya creado correctamente"""
    print("\n🔍 Verificando la configuración...")
    
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database='cancun_real_estate'
        )
        cursor = conn.cursor()
        
        # Listar todas las tablas
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        tables = cursor.fetchall()
        print("\n📋 Tablas en la base de datos:")
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
            count = cursor.fetchone()[0]
            print(f"   ✓ {table[0]}: {count} registros")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error en la verificación: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("  🏝️  CANCÚN REAL ESTATE - CONFIGURACIÓN DE BASE DE DATOS")
    print("=" * 60)
    
    # Paso 1: Crear base de datos
    if create_database():
        # Paso 2: Crear tablas
        if create_tables():
            # Paso 3: Verificar
            verify_setup()
            print("\n" + "=" * 60)
            print("✅ ¡Configuración completada exitosamente!")
            print("=" * 60)
            print("\n💡 Siguiente paso: Ejecutar 'generate_data.py' para generar las 2,000 propiedades")
        else:
            print("\n❌ Hubo un error al crear las tablas")
    else:
        print("\n❌ Hubo un error al crear la base de datos")