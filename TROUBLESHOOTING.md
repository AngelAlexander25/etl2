# Guía de Troubleshooting - Dashboard Cancún

**Autor**: Angel Alexander  
**Última actualización**: 2024

---

## Problemas Comunes y Soluciones

### 1. "Cannot connect to localhost:8000" (Frontend)

**Síntoma**: Error rojo en consola del navegador

**Causas posibles**:
- Backend FastAPI no está corriendo
- Puerto 8000 en uso
- Firewall bloqueando conexión

**Soluciones**:

```bash
# 1. Verificar que backend esté corriendo
# Debería ver: "Uvicorn running on http://127.0.0.1:8000"

# 2. Si no aparece, inicia desde carpeta backend:
cd dashboard\backend
python main.py

# 3. Si puerto está en uso, mata el proceso:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# 4. Intenta otro puerto:
python main.py --port 8001
# Luego cambia en frontend/src/services/apiService.js
# baseURL: 'http://localhost:8001'
```

---

### 2. "npm ERR! command not found: npm"

**Síntoma**: Error al ejecutar `npm start`

**Causas**:
- Node.js no instalado
- npm no en PATH

**Soluciones**:

```bash
# 1. Verifica Node.js instalación
node --version  # Debe mostrar versión

# 2. Verifica npm
npm --version   # Debe mostrar versión

# 3. Reinstala Node.js desde https://nodejs.org/
# Descarga LTS, desinstala versión anterior, reinstala

# 4. Reinicia la terminal después de instalar
```

---

### 3. Propiedades muestran "0" en grid

**Síntoma**: Grid vacío aunque base de datos tiene 2000 propiedades

**Causas**:
- Filtros no aplicados
- API retorna error
- Problema con componente

**Soluciones**:

```bash
# 1. Haz clic en botón "Aplicar" de los filtros
#    (Los filtros en v2 requieren acción explícita)

# 2. Abre http://localhost:3000
#    F12 → Console → Busca errores rojo

# 3. Verifica API directamente:
#    http://localhost:8000/api/properties
#    Debería retornar lista de propiedades

# 4. Reinicia ambos servidores:
#    Backend: Ctrl+C en su terminal
#    Frontend: Ctrl+C en su terminal
#    Luego npm start y python main.py
```

---

### 4. "Module not found" en Frontend

**Síntoma**: Error como `Cannot find module 'lucide-react'`

**Causas**:
- Dependencias no instaladas
- Mal nombre de componente importado

**Soluciones**:

```bash
# 1. Reinstala dependencias
cd dashboard\frontend
rm -r node_modules package-lock.json
npm install

# 2. Verifica que import sea correcto en el archivo
# Debe ser: import { MapPin } from 'lucide-react'
# NO: import { mapPin } from 'lucide-react'

# 3. Reinicia npm start
npm start
```

---

### 5. PostgreSQL no conecta (Backend)

**Síntoma**: Error como `could not connect to database`

**Causas**:
- PostgreSQL no corriendo
- Credenciales incorrectas
- Database no existe

**Soluciones**:

```bash
# 1. Verifica si PostgreSQL está corriendo
# En Services (Windows): Busca "PostgreSQL"

# 2. O via terminal:
psql -U postgres

# 3. Si no funciona, instala PostgreSQL:
# https://www.postgresql.org/download/windows/

# 4. Crea database:
createdb -U postgres cancun_properties

# 5. Verifica conexión:
psql -U postgres -d cancun_properties -c "SELECT COUNT(*) FROM properties;"
```

---

### 6. Mapa no carga

**Síntoma**: Área blanca donde debería estar mapa

**Causas**:
- Leaflet CSS no cargó
- OpenStreetMap no accesible
- Problema con React Leaflet

**Soluciones**:

```bash
# 1. Verifica en F12 → Network
#    Busca request a "tile.openstreetmap.org"
#    Si falla, es problema de internet

# 2. Verifica que MapViewAdvanced.js importa CSS:
#    import 'leaflet/dist/leaflet.css'

# 3. Reinstala react-leaflet:
npm uninstall react-leaflet leaflet
npm install react-leaflet leaflet

# 4. Reinicia npm start
npm start
```

---

### 7. Filtros no funcionan

**Síntoma**: Cambios en filtros no reflejan en propiedades

**Causas**:
- No has hecho clic en "Aplicar"
- API retorna error
- Filtro sin opciones

**Soluciones**:

```
IMPORTANTE: En esta versión debes:
1. Cambiar los valores en el filtro
2. Hacer clic en botón AZUL "Aplicar"
3. Esperar carga (verás loading spinner)
4. Propiedades se actualizan
```

---

### 8. "CORS error" en consola

**Síntoma**: `Access to XMLHttpRequest blocked by CORS`

**Causas**:
- Frontend en puerto diferente al permitido
- Backend CORS config incorrecta

**Soluciones**:

```python
# En dashboard/backend/main.py, verifica:
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 9. Slow Performance

**Síntoma**: Página carga lenta, freezes, lag

**Causas**:
- 2000 propiedades todas a la vez
- Muchos re-renders de React
- API lenta

**Soluciones**:

```bash
# 1. Verifica límite en API
#    GET /api/properties?limit=50
#    NO: GET /api/properties?limit=9999

# 2. Verifica en DevTools (F12)
#    Performance → Busca bottlenecks

# 3. Limpia cache:
#    Chrome: Ctrl+Shift+Delete

# 4. Actualiza dependencias:
npm update
```

---

### 10. "Port 3000 already in use"

**Síntoma**: Error al iniciar npm start

**Causas**:
- Proceso npm anterior aún corriendo
- Otro programa usa puerto 3000

**Soluciones**:

```bash
# 1. Mata proceso en puerto 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# 2. O usa otro puerto:
PORT=3001 npm start
# Luego abre http://localhost:3001

# 3. O reinicia la computadora (nuclear option)
```

---

### 11. "SyntaxError: Unexpected token"

**Síntoma**: Error de JavaScript en consola

**Causas**:
- Error tipográfico en JSX
- Caracteres especiales mal formateados

**Soluciones**:

```bash
# 1. Revisa la línea indicada en el error
# 2. Busca caracteres especiales raros (copypaste de Word)
# 3. Verifica paréntesis y corchetes equilibrados

# Ejemplo error común:
{value} = 5;  // ✗ Error: { son para destructuring
let value = 5; // ✓ Correcto
```

---

### 12. CSV Export no funciona

**Síntoma**: Botón "Descargar CSV" no hace nada

**Causas**:
- Propiedades vacías
- Problema con blob
- Browser bloquea descarga

**Soluciones**:

```bash
# 1. Asegúrate que hay propiedades (>0)
# 2. Revisa DevTools → Console (F12)
#    Debería haber logs de descarga

# 3. Verifica que browser permite descargas:
#    Chrome: Settings → Privacy → Downloads

# 4. Reinicia y prueba de nuevo
```

---

### 13. Responsive Design roto

**Síntoma**: Layout extraño en móvil

**Causas**:
- Viewport meta tag faltante
- Tailwind classes incorrectas
- Overflow horizontal

**Soluciones**:

```html
<!-- En public/index.html, verifica -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Abre DevTools (F12) -->
<!-- Usa responsive mode: Ctrl+Shift+M -->
<!-- Prueba diferentes tamaños -->
```

---

### 14. Backend crash al iniciar

**Síntoma**: Terminal cierra inmediatamente

**Causas**:
- Módulos faltantes
- Python version incorrecta
- Sintaxis error en main.py

**Soluciones**:

```bash
# 1. Verifica Python version (debe ser 3.8+)
python --version

# 2. Reinstala dependencias backend
pip install -r requirements.txt

# 3. Ejecuta con errores visibles:
python -u main.py

# 4. Revisa main.py por errores
python -m py_compile main.py
```

---

### 15. "Tabla/Grid muestra undefined"

**Síntoma**: Celdas muestran "undefined" en lugar de datos

**Causas**:
- API responde con estructura diferente
- Campo no existe en base de datos
- Typo en nombre de propiedad

**Soluciones**:

```bash
# 1. Verifica respuesta API:
curl http://localhost:8000/api/properties?limit=1

# 2. Compara estructura esperada con real
# Esperado: { price: 5000000 }
# Real: { property_price: 5000000 }

# 3. Actualiza componente con nombres correctos:
# Cambiar: property.price
# Por: property.property_price (si está así en API)
```

---

## Quick Checklist

```
ANTES DE REPORTAR ERROR:

[ ] ¿Backend está corriendo? (http://localhost:8000/docs accesible)
[ ] ¿Frontend está corriendo? (http://localhost:3000 abre)
[ ] ¿PostgreSQL está corriendo? (base datos existe)
[ ] ¿Reiniciaste ambos servidores?
[ ] ¿Limpiaste cache del browser? (Ctrl+Shift+Delete)
[ ] ¿Abriste DevTools? (F12 → Console)
[ ] ¿Verificaste archivos .log para errores?
```

---

## Contacto / Soporte

**Autor**: Angel Alexander

Para más información o preguntas, revisa:
- [Documentación completa](./GUIA_COMPLETA.md)
- [README Frontend](./dashboard/frontend/README.md)
- [README Backend](./dashboard/backend/README.md)

---

**Última actualización**: 2024
