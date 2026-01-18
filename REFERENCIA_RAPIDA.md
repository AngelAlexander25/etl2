# ⚡ REFERENCIA RÁPIDA

**Dashboard Real Estate Cancún**  
**Creado por**: Angel Alexander

---

## 🚀 Inicio Rápido (30 segundos)

```bash
# Ejecuta en PowerShell desde c:\Users\test\Desktop\etl
.\iniciar.bat
```

Luego abre: http://localhost:3000

---

## 📍 URLs Importantes

| Servicio | URL | Notas |
|----------|-----|-------|
| Frontend | http://localhost:3000 | Dashboard principal |
| Backend | http://localhost:8000 | API |
| API Docs | http://localhost:8000/docs | Documentación interactiva |
| API Docs Alt | http://localhost:8000/redoc | Formato alternativo |

---

## 📁 Carpetas Clave

```
c:\Users\test\Desktop\etl\
├── dashboard\backend\      ← Código FastAPI
├── dashboard\frontend\     ← Código React
├── data_real\             ← Datos JSON/CSV
└── [archivos de configuración]
```

---

## 🔧 Comandos Principales

### Backend
```bash
cd dashboard\backend
python main.py              # Inicia servidor
python main.py --port 8001 # Puerto diferente
```

### Frontend
```bash
cd dashboard\frontend
npm start                   # Inicia desarrollo
npm run build              # Build producción
npm install                # Instala dependencias
```

### Database
```bash
# Conectar a PostgreSQL
psql -U postgres -d cancun_properties

# Ver propiedades
SELECT COUNT(*) FROM properties;
SELECT * FROM properties LIMIT 5;
```

---

## 🎯 Funcionalidades por Tab

### Resumen General
- KPIs en tiempo real
- Mapa interactivo
- Grid de propiedades
- Filtros (requieren "Aplicar")

### Análisis Avanzado
- 4+ gráficos de análisis
- Tendencias de 12 meses
- Comparativas por zona
- Estadísticas detalladas

### Calculadora ROI
- Simula inversión
- Proyecciones financieras
- Análisis de rentabilidad

---

## 🎨 Colores del Sistema

| Color | Uso | Hex |
|-------|-----|-----|
| Azul | Header, Botones principales | #3B82F6 |
| Blanco | Fondo | #FFFFFF |
| Verde | Precios bajos (<2M) | #10B981 |
| Azul | Precios medianos (2-5M) | #3B82F6 |
| Ámbar | Precios altos (5-10M) | #F59E0B |
| Rojo | Precios premium (>10M) | #EF4444 |

---

## 🔗 API Endpoints Quick Reference

```
GET  /api/stats                  → Estadísticas
GET  /api/properties?limit=50    → Propiedades
GET  /api/map-data               → Coordenadas mapa
GET  /api/trends                 → Tendencias
GET  /api/filters/options        → Opciones filtros
GET  /api/price-comparison       → Análisis precios
POST /api/roi-calculator         → Calcular ROI
```

---

## 📊 Datos Disponibles

- **Total Propiedades**: 2,000
- **Zonas**: 7 (Centro, Playa, Región 15, Hotelera, Puerto, Tulum, Morelos)
- **Tipos**: 4 (Departamento, Casa, Villa, Penthouse)
- **Precio Mín**: 1,000,000 MXN
- **Precio Máx**: 50,000,000 MXN
- **Precio Promedio**: ~15,000,000 MXN

---

## 🛠️ Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Backend no conecta | Verifica `python main.py` en Terminal 1 |
| Frontend no carga | Verifica `npm start` en Terminal 2 |
| Puerto en uso | `netstat -ano \| findstr :3000` → `taskkill /PID [ID] /F` |
| Propiedades = 0 | Click en "Aplicar" (requiere acción explícita) |
| Mapa en blanco | Recarga (F5) y reinicia `npm start` |

---

## 📂 Archivos Documentación

| Archivo | Contenido |
|---------|-----------|
| PRIMER_INICIO.md | Guía paso a paso (LEER PRIMERO) |
| GUIA_COMPLETA.md | Guía completa de uso |
| CHECKLIST_VERIFICACION.md | Lista de verificación |
| TROUBLESHOOTING.md | Problemas y soluciones |
| RESUMEN_FINAL.md | Resumen técnico |
| README.md (Frontend) | Documentación técnica React |
| README.md (Backend) | Documentación técnica FastAPI |

---

## 🧩 Componentes React

```
App (Principal)
├── KPICard (4 métricas)
├── FilterPanel (Filtros + Apply/Clean)
├── PropertiesGrid (Tarjetas propiedades)
├── MapViewAdvanced (Mapa + markers)
├── AdvancedStats (Gráficos análisis)
├── AdvancedAnalytics (Tendencias)
└── ROICalculator (Calculadora inversión)
```

---

## 💾 Stack Tecnológico

**Backend**: FastAPI + PostgreSQL + SQLAlchemy + Pydantic + Python 3.10+

**Frontend**: React 18 + Tailwind CSS 3 + Recharts + React-Leaflet + Lucide Icons

---

## 🎯 Verificación Inicial

```
[ ] Backend corre (http://localhost:8000/docs)
[ ] Frontend corre (http://localhost:3000)
[ ] Ves 4 KPI cards
[ ] Ves mapa con markers
[ ] Ves grid de propiedades
[ ] Filtros responden
[ ] Tabs navegables
```

---

## 📝 Notas Importantes

- ⚠️ Filtros requieren click en "Aplicar" (no son automáticos)
- ⚠️ Mapa con markers personalizados (colores por precio)
- ⚠️ Sin emojis (solo iconos Lucide React)
- ⚠️ Responsive design móvil-first
- ⚠️ 2000 propiedades en base de datos

---

## 👤 Autor

**Angel Alexander**  
Proyecto: Dashboard Real Estate Cancún  
Versión: 2.0 (Redesign Completo)  
Año: 2024

---

## ⏰ Último Update

2024

---

## 🚀 Comenzar

```bash
cd c:\Users\test\Desktop\etl
.\iniciar.bat
# Abre http://localhost:3000
```

¡Listo!

