# Guía de Uso - Dashboard Cancún Real Estate
## Creado por: Angel Alexander

---

## Inicio Rápido

### 1. Iniciar el Backend (Terminal 1)
```bash
cd C:\Users\test\Desktop\etl\dashboard\backend
python main.py
```

Deberías ver:
```
Iniciando servidor FastAPI...
API disponible en: http://localhost:8000
Documentación en: http://localhost:8000/docs
```

### 2. Iniciar el Frontend (Terminal 2)
```bash
cd C:\Users\test\Desktop\etl\dashboard\frontend
npm start
```

Se abrirá automáticamente en `http://localhost:3000`

---

## Características del Dashboard

### Tab "Resumen General"
- **KPIs Principales**: Total de propiedades, precio promedio, disponibilidad
- **Mapa Interactivo**: Visualiza todas las propiedades en Cancún
  - Markers de colores según rango de precio
  - Click en los markers para ver detalles
  - Zoom y navegación intuitiva
- **Tarjetas de Propiedades**: Grid de propiedades filtradas
  - Información clara de cada propiedad
  - Características destacadas
  - Exportación a CSV

### Filtros
- **Zona**: Filtra por ubicación en Cancún
- **Tipo**: Departamento, Casa, Villa, Penthouse
- **Rango de Precio**: Desde económicas hasta lujo
- **Recámaras**: 1 a 6 recámaras
- **Características**: Alberca, Vista al Mar

**Importante**: Haz clic en "Aplicar" para ver los cambios

### Tab "Análisis Avanzado"
- **Gráficos de Propiedades por Zona**
- **Distribución por Tipo de Propiedad**
- **Análisis de Precios y Precio por m²**
- **Tarjetas de Resumen con KPIs**
- **Tendencias de Precios (últimos 12 meses)**

### Tab "Calculadora ROI"
- Calcula retorno de inversión
- Simula diferentes escenarios
- Analiza rentabilidad por renta
- Proyecta periodo de recuperación

---

## Diseño Responsivo

El dashboard se adapta a:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Móvil (menos de 768px)

En móvil:
- El menú de tabs se minimiza
- Los gráficos se escalan automáticamente
- Los filtros se mantienen accesibles

---

## Datos Disponibles

- **2000 propiedades** en base de datos
- **7 zonas** principales de Cancún
- **4 tipos** de propiedad
- **Tendencias** de los últimos 12 meses
- **Análisis detallados** de mercado

---

## Tecnología

**Frontend:**
- React 18
- Tailwind CSS
- Recharts (gráficos)
- React Leaflet (mapas)
- Axios (API)

**Backend:**
- FastAPI
- PostgreSQL
- Python 3.10+

---

## Solución de Problemas

### "Cannot connect to localhost:8000"
- Verifica que FastAPI esté corriendo
- Comprueba que PostgreSQL está activo
- Reinicia ambos servidores

### Tabla de propiedades muestra 0
- Asegúrate de hacer clic en "Aplicar" filtros
- Revisa que haya propiedades con esos filtros
- Intenta "Limpiar" los filtros

### Mapa no carga
- Recarga la página (F5)
- Verifica conexión a internet
- Comprueba que la API responde en http://localhost:8000/api/map-data

---

## Optimizaciones Realizadas

- Header fijo sin conflictos con contenido
- Tabla convertida a grid de tarjetas elegantes
- Markers mejorados en el mapa
- Filtros con botones Aplicar/Limpiar
- Diseño 100% responsivo
- Análisis avanzados adicionales
- Sin emojis, solo iconos profesionales
- Nombre del creador incluido

---

## Acceso a Documentación API

Visita: http://localhost:8000/docs

Aquí puedes:
- Explorar todos los endpoints
- Probar las APIs en tiempo real
- Ver documentación automática

---

## Próximas Mejoras Sugeridas

- Dark mode
- Historial de búsquedas
- Comparador de propiedades
- Notificaciones en tiempo real
- Sistema de favoritos

---

**Creado por Angel Alexander | 2024**
