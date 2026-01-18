# 🚀 PRIMER INICIO - PASO A PASO

**Autor**: Angel Alexander

---

## Antes de Empezar

Verifica que tengas:
- ✅ Python 3.10+ instalado
- ✅ Node.js + npm instalados
- ✅ PostgreSQL corriendo
- ✅2000 propiedades en base de datos

---

## OPCION 1: El Camino Fácil (RECOMENDADO)

### Paso 1: Ejecuta Verificación

```bash
# Windows - En PowerShell o CMD
cd c:\Users\test\Desktop\etl
verificar.bat
```

Debería mostrar:
```
✓ Python instalado
✓ Node.js instalado
✓ npm instalado
✓ Backend encontrado
✓ Frontend encontrado
✓ Dependencias de Frontend instaladas
```

### Paso 2: Inicia Todo

```bash
# Desde c:\Users\test\Desktop\etl
iniciar.bat
```

Se abrirán 2 ventanas:
- Terminal 1: Backend (FastAPI)
- Terminal 2: Frontend (React)

Espera a ver:

**Terminal 1 (Backend):**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

**Terminal 2 (Frontend):**
```
webpack compiled
Compiled successfully!
You can now view [app] in the browser...
```

### Paso 3: Abre en Navegador

Automáticamente se abrirá http://localhost:3000

Si no, abre manualmente:
- http://localhost:3000 ← Frontend
- http://localhost:8000/docs ← API Documentation

---

## OPCION 2: Manual (Si los scripts no funcionan)

### Paso 1: Inicia Backend

```bash
cd c:\Users\test\Desktop\etl\dashboard\backend
python main.py
```

Espera a ver:
```
INFO:     Started server process [1234]
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Verifica:** http://localhost:8000/docs

### Paso 2: Inicia Frontend (Nueva Terminal)

```bash
cd c:\Users\test\Desktop\etl\dashboard\frontend
npm start
```

Espera a ver:
```
Compiled successfully!
You can now view etl in the browser.
```

**Verifica:** http://localhost:3000

---

## Lo Que Debería Ver

### En http://localhost:3000

```
┌─────────────────────────────────────────────┐
│  [Logo] Dashboard Cancún          [Menu]    │  ← Header azul
├─────────────────────────────────────────────┤
│                                             │
│  Total Props  │ Precio Prom  │ Disponib   │  ← 4 KPIs
│                                             │
├─────────┬─────────────────────────────────┤
│         │                                 │
│ Filtros │     [Mapa Interactivo]         │  ← Tab Resumen
│         │                                 │
│ [Apply] │     (Markers de colores)       │
│[Reset]  │                                 │
│         │─────────────────────────────────│
│         │  Grid de Tarjetas de Propiedades
│         │  [Prop1] [Prop2] [Prop3]        │
└─────────┴─────────────────────────────────┘
     Tabs: Resumen | Análisis | ROI
```

---

## Checklist Inicial

- [ ] Backend dice "Uvicorn running"
- [ ] Frontend dice "Compiled successfully"
- [ ] http://localhost:3000 abre
- [ ] Ves el header azul
- [ ] Ves 4 tarjetas de KPI (4 números)
- [ ] Ves un mapa en el medio
- [ ] Ves tarjetas de propiedades abajo
- [ ] Ves "Resumen | Análisis | ROI" tabs en fondo

---

## Primeras Pruebas

### Test 1: Filtros
1. Cambia "Zona" a "Centro Cancún"
2. Haz clic en botón azul **"Aplicar"**
3. Debería filtrar propiedades
4. Las tarjetas se actualizan

### Test 2: Mapa
1. Zoom in/out con rueda ratón
2. Arrastra mapa
3. Click en markers (puntos de colores)
4. Debería mostrar popup con info

### Test 3: Tabs
1. Click en "Análisis"
2. Deberías ver gráficos
3. Click en "ROI"
4. Deberías ver calculadora
5. Vuelve a "Resumen"

### Test 4: Responsividad
1. F12 (DevTools)
2. Ctrl+Shift+M (Responsive mode)
3. Prueba diferentes tamaños:
   - 375px (móvil)
   - 768px (tablet)
   - 1920px (desktop)

---

## Datos Iniciales Esperados

- **2000 propiedades** en total
- **7 zonas** en Cancún
- **Precios**: 1M a 50M MXN
- **Promedio**: ~15M MXN
- **Sin filtros**: Muestra todas las propiedades

---

## Si Algo Falla

### Error 1: "Cannot connect to localhost:8000"
```bash
# Backend no está corriendo
# Verifica Terminal 1
# Si cerró, ejecuta nuevamente:
cd c:\Users\test\Desktop\etl\dashboard\backend
python main.py
```

### Error 2: "npm not found"
```bash
# Node.js no está instalado
# Descarga desde https://nodejs.org/
# Instala, reinicia terminal
node --version  # Debe mostrar versión
```

### Error 3: "Propiedades = 0"
```
1. Haz clic en "Aplicar" (botón azul)
   - Los filtros requieren acción explícita
2. Si sigue siendo 0:
   - Presiona "Limpiar"
   - Luego "Aplicar" sin filtros
```

### Error 4: "Mapa en blanco"
```bash
# Recarga la página
F5 (o Ctrl+R)

# Si sigue en blanco:
# Reinicia frontend
# Terminal con npm: Ctrl+C
# npm start
```

### Más problemas:
Ver archivo: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Próximos Pasos Después del Primer Inicio

1. **Explorar datos**
   - Navega entre tabs
   - Prueba diferentes filtros
   - Revisa gráficos de análisis

2. **Verificar responsividad**
   - Abre DevTools (F12)
   - Modo responsivo (Ctrl+Shift+M)
   - Verifica en móvil si es posible

3. **Probar funcionalidades**
   - Exporta CSV (botón en grid)
   - Calcula ROI
   - Interactúa con mapa

4. **Revisar datos**
   - Verifica que números sean realistas
   - Comprueba zonas y tipos
   - Valida que todo tenga sentido

---

## Configuración Adicional (Opcional)

### Cambiar Puerto del Backend

Si puerto 8000 está en uso:

1. Abre `dashboard/backend/main.py`
2. Busca línea: `if __name__ == "__main__":`
3. Cambia: `uvicorn.run(app, host="0.0.0.0", port=8000)`
   Por: `uvicorn.run(app, host="0.0.0.0", port=8001)`
4. Abre `dashboard/frontend/src/services/apiService.js`
5. Cambia: `const API_BASE_URL = 'http://localhost:8000';`
   Por: `const API_BASE_URL = 'http://localhost:8001';`
6. Restart ambos servidores

### Cambiar Puerto del Frontend

Si puerto 3000 está en uso:

```bash
cd dashboard\frontend
PORT=3001 npm start
# Luego abre http://localhost:3001
```

### Desactivar Auto-open del Navegador

```bash
cd dashboard\frontend
BROWSER=none npm start
```

---

## Documentación Disponible

Después del primer inicio, puedes consultar:

- **[GUIA_COMPLETA.md](./GUIA_COMPLETA.md)** - Guía de uso del dashboard
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solución de problemas
- **[CHECKLIST_VERIFICACION.md](./CHECKLIST_VERIFICACION.md)** - Checklist completo
- **[RESUMEN_FINAL.md](./RESUMEN_FINAL.md)** - Resumen técnico
- **[dashboard/frontend/README.md](./dashboard/frontend/README.md)** - Docs frontend
- **[dashboard/backend/README.md](./dashboard/backend/README.md)** - Docs backend

---

## Información de Contacto

**Creado por**: Angel Alexander  
**Proyecto**: Dashboard Real Estate Cancún  
**Versión**: 2.0 (Redesign Completo)  
**Año**: 2024

---

## ¡Éxito!

Si llegaste hasta aquí y ambos servidores están corriendo, ¡felicidades! 🎉

El dashboard está completamente funcional y listo para explorar.

**Próximo**: Abre http://localhost:3000 y comienza a navegar.

---

**Última actualización**: 2024
