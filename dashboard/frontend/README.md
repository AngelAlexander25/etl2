# Dashboard Real Estate Cancún - Frontend

Dashboard profesional para análisis del mercado inmobiliario en Cancún. Diseñado como proyecto portfolio con React moderno, visualizaciones avanzadas y interfaz responsiva.

**Creado por:** Angel Alexander

## Características Principales

**Interfaz Profesional**
- Diseño limpio y moderno sin emojis
- Header azul minimalista
- Fondo blanco para mejor legibilidad
- Iconos de Lucide React

**KPIs en Tiempo Real**
- Total de propiedades disponibles
- Precio promedio de mercado
- Propiedades por zona
- Análisis de disponibilidad

**Mapa Interactivo Avanzado**
- Markers personalizados (no puntos básicos)
- Colores según rango de precio:
  - Verde: <2M
  - Azul: 2M-5M
  - Ámbar: 5M-10M
  - Rojo: >10M
- Popups con información detallada
- Zoom e interactividad completa

**Sistema de Filtros Profesional**
- Zona, tipo, rango de precio
- Número de recámaras
- Características (alberca, vista al mar)
- Botones "Aplicar" y "Limpiar" explícitos
- Feedback visual de cambios

**Grid de Propiedades**
- Tarjetas atractivas (estilo Hofin.com)
- Información clara por propiedad
- Color-coding por rango de precio
- Exportación a CSV
- Responsive (1-3 columnas)

**Análisis Avanzados**
- Gráficos por zona y tipo
- Tendencias de precios (12 meses)
- Comparativas de precios
- Estadísticas detalladas

**Calculadora ROI**
- Simulación de inversión
- Proyecciones financieras
- Análisis de rentabilidad
- Periodo de recuperación

## Requisitos

- Node.js 16+ 
- npm o yarn
- La API FastAPI ejecutándose en http://localhost:8000

## Instalación

```bash
# Navegar a la carpeta frontend
cd dashboard/frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Tecnologías Utilizadas

- **React 18** - Framework UI
- **Tailwind CSS** - Estilos
- **Recharts** - Gráficos
- **React Leaflet** - Mapas
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## Estructura del Proyecto

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── KPICard.js          # Tarjetas KPI
│   │   ├── FilterPanel.js      # Panel de filtros
│   │   ├── MapView.js          # Mapa interactivo
│   │   ├── AnalyticsCharts.js  # Gráficos
│   │   ├── PropertiesTable.js  # Tabla de propiedades
│   │   └── ROICalculator.js    # Calculadora ROI
│   ├── services/
│   │   └── apiService.js       # Servicios de API
│   ├── App.js                  # Componente principal
│   ├── index.js                # Punto de entrada
│   └── index.css               # Estilos globales
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Conexión con la API

La aplicación se conecta automáticamente a la API en `http://localhost:8000`.

Asegúrate de que:
1. La API FastAPI esté ejecutándose
2. La base de datos PostgreSQL esté disponible
3. El CORS esté configurado correctamente en la API

## Uso

1. **Resumen**: Visualiza KPIs, mapa interactivo y tabla de propiedades
2. **Análisis**: Gráficos de tendencias y comparativas
3. **ROI**: Calculadora de retorno de inversión

## Desarrollo

Para desarrollar nuevas características:

```bash
# Instalar nuevas dependencias
npm install [package-name]

# Build para producción
npm run build

# Ejecutar tests
npm test
```

## Variables de Entorno

Si necesitas cambiar la URL de la API, crea un archivo `.env`:

```
REACT_APP_API_URL=http://localhost:8000/api
```

## Licencia

MIT
