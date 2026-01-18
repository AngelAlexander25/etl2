# 🚀 GUÍA DE INICIO - DASHBOARD CANCÚN REAL ESTATE

## Estado Actual

✅ **Backend**: FastAPI con 2000 propiedades generadas  
✅ **Frontend**: React completamente construido  
✅ **Base de Datos**: PostgreSQL con datos reales  

---

## Paso 1: Iniciar el Backend (Terminal 1)

```powershell
cd C:\Users\test\Desktop\etl\dashboard\backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Deberías ver:**
```
Iniciando servidor FastAPI...
API disponible en: http://localhost:8000
Documentación en: http://localhost:8000/docs
```

✅ Abre http://localhost:8000/docs para probar los endpoints

---

## Paso 2: Iniciar el Frontend (Terminal 2)

```powershell
cd C:\Users\test\Desktop\etl\dashboard\frontend
npm start
```

**La aplicación se abrirá automáticamente en:**
```
http://localhost:3000
```

---

## 🎯 Lo que puedes hacer ahora

### 📊 Tab "Resumen"
- Ver 4 KPIs principales
- Explorar mapa interactivo de Cancún
- Filtrar propiedades por zona, tipo, precio, etc.
- Descargar tabla como CSV

### 📈 Tab "Análisis"
- Gráfico de tendencias de precios (últimos 12 meses)
- Comparación de precios por zona
- Distribución de propiedades

### 💰 Tab "ROI"
- Calcular retorno de inversión
- Simular diferentes escenarios de renta
- Ver período de recuperación

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to localhost:8000"
- Asegúrate de que FastAPI esté corriendo
- Verifica que PostgreSQL esté activo
- Revisa que las credenciales de BD sean correctas

### Error: CORS
- El backend ya tiene CORS configurado para localhost:3000
- Si cambias el puerto, actualiza CORS en `backend/main.py`

### Error: "Cannot find module"
- Ejecuta `npm install` en la carpeta frontend

---

## 📁 Estructura del Proyecto

```
etl/
├── dashboard/
│   ├── backend/
│   │   ├── main.py          ← API FastAPI
│   │   └── ...
│   ├── frontend/            ← React App
│   │   ├── src/
│   │   │   ├── components/  ← Todos los componentes
│   │   │   ├── services/    ← Conexión API
│   │   │   └── App.js       ← App principal
│   │   ├── package.json
│   │   └── ...
├── database.py
├── generate_real_data.py    ← Script para generar datos
└── ...
```

---

## 📚 Componentes React

| Componente | Función |
|-----------|---------|
| **KPICard** | Tarjetas de estadísticas |
| **MapView** | Mapa interactivo de Cancún |
| **FilterPanel** | Panel de filtros lateral |
| **AnalyticsCharts** | Gráficos y tendencias |
| **PropertiesTable** | Tabla de propiedades |
| **ROICalculator** | Calculadora de inversión |

---

## 📞 API Endpoints Disponibles

- `GET /api/stats` - Estadísticas generales
- `GET /api/properties` - Lista de propiedades (con filtros)
- `GET /api/properties/{id}` - Detalle de propiedad
- `GET /api/map-data` - Datos para el mapa
- `GET /api/zones` - Información de zonas
- `GET /api/trends` - Tendencias de precios
- `GET /api/price-comparison` - Comparación de precios
- `GET /api/roi-calculator` - Cálculo ROI
- `GET /api/filters/options` - Opciones de filtros

---

## 🎨 Colores y Estilos

- **Gradiente Principal**: Púrpura a Índigo
- **Secundarios**: Rosa, Azul, Verde, Naranja
- **Sombras**: Modernas y suaves
- **Tipografía**: Limpia y legible

---

## 🚀 Próximos Pasos (Opcional)

1. **Mejorar Mapa**: Agregar clustering de marcadores
2. **Exportar**: Agregar exportación a PDF
3. **Notificaciones**: Sistema de alertas de nuevas propiedades
4. **Mobile**: Optimizar más para móvil
5. **Autenticación**: Agregar login de usuarios

---

## ✨ Características Implementadas

✅ Dashboard responsivo  
✅ KPIs en tiempo real  
✅ Mapa interactivo  
✅ Filtros avanzados  
✅ Gráficos animados  
✅ Tabla ordenable  
✅ Exportación CSV  
✅ Calculadora ROI  
✅ Dark mode ready  
✅ Conexión API lista  

---

**¡Dashboard completamente listo para usar!** 🎉
