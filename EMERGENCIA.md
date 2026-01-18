# 🆘 GUÍA DE EMERGENCIA

**Dashboard Real Estate Cancún**  
**Para problemas críticos**

---

## ⚡ Si Nada Funciona

### Paso 1: Mata todo y reinicia

```bash
# Windows PowerShell como Administrador

# Mata procesos en uso
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "python" -Force -ErrorAction SilentlyContinue

# Cierra browsers
Stop-Process -Name "chrome" -Force -ErrorAction SilentlyContinue

# Espera 5 segundos
Start-Sleep -Seconds 5

# Verifica que se hayan muerto
Get-Process -Name "node" -ErrorAction SilentlyContinue  # No debe salir nada
```

### Paso 2: Verifica puertos

```bash
# Verifica si 3000 y 8000 están libres
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Si alguno aparece, mata el proceso:
# taskkill /PID [NUMERO] /F
```

### Paso 3: Reinicia desde cero

```bash
# Terminal 1 - Backend
cd c:\Users\test\Desktop\etl\dashboard\backend
python main.py

# Terminal 2 - Frontend (ESPERA 5 SEG después que backend diga "running")
cd c:\Users\test\Desktop\etl\dashboard\frontend
npm start
```

---

## 🔴 Backend no inicia

### Síntoma
```
ModuleNotFoundError: No module named 'fastapi'
o
CRITICAL: Could not connect to database
```

### Solución Rápida

```bash
# 1. Verifica que estás en la carpeta correcta
cd c:\Users\test\Desktop\etl\dashboard\backend
pwd  # Deberías ver: /c/Users/test/Desktop/etl/dashboard/backend

# 2. Reinstala dependencias
pip install --upgrade pip
pip install -r requirements.txt

# 3. Verifica PostgreSQL está corriendo
psql -U postgres -c "SELECT 1"  # Si muestra "1", está bien

# 4. Reinicia
python main.py
```

---

## 🔴 Frontend no inicia

### Síntoma
```
npm ERR! command not found: npm
o
Port 3000 already in use
```

### Solución Rápida

```bash
# 1. Verifica Node.js
node --version  # Debe mostrar v18+
npm --version   # Debe mostrar 9+

# 2. Si falta, reinstala desde https://nodejs.org/

# 3. Si port está en uso
netstat -ano | findstr :3000
taskkill /PID [NUMERO] /F

# 4. Limpia npm cache
npm cache clean --force

# 5. Reinstala dependencias
cd c:\Users\test\Desktop\etl\dashboard\frontend
rm -r node_modules package-lock.json
npm install

# 6. Inicia
npm start
```

---

## 🔴 La página se ve vacía

### Síntoma
- Página blanca o sin contenido
- O solo muestra header

### Solución

```bash
# 1. Abre DevTools
F12

# 2. Ve a Console (pestaña)
# Busca errores rojo

# 3. Si ves error sobre API
# Significa backend no responde

# 4. Reinicia backend en otra terminal
python main.py

# 5. Recarga página en browser
F5

# 6. Si sigue vacío, reinstala frontend
npm install
npm start
```

---

## 🔴 "Cannot GET /api/properties"

### Significa
Backend no está corriendo

### Solución

```bash
# 1. Verifica si backend corre
curl http://localhost:8000/docs
# Si da error "cannot connect", backend está muerto

# 2. Inicia backend
cd c:\Users\test\Desktop\etl\dashboard\backend
python main.py

# 3. Espera a ver:
# INFO:     Uvicorn running on http://127.0.0.1:8000

# 4. Recarga frontend
F5 en navegador
```

---

## 🔴 "CORS error" en consola

### Significa
Backend y frontend en puertos incompatibles

### Solución

```python
# Edita: c:\Users\test\Desktop\etl\dashboard\backend\main.py

# Busca CORS section y asegúrate que tenga:
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Guarda y reinicia backend
```

---

## 🔴 Database connection failed

### Significa
PostgreSQL no está corriendo o credenciales incorrectas

### Solución

```bash
# 1. Verifica PostgreSQL
psql -U postgres -c "SELECT 1"

# 2. Si no funciona, PostgreSQL no está corriendo
# Abre Services (Windows):
# Presiona Win+R → services.msc
# Busca "PostgreSQL" → Click derecho → Start

# 3. Verifica credenciales en:
# c:\Users\test\Desktop\etl\dashboard\backend\database.py

# Debería tener:
# DATABASE_URL = 'postgresql://postgres:password@localhost/cancun_properties'

# 4. Si cambió la password, actualiza aquí también

# 5. Reinicia backend
python main.py
```

---

## 🔴 "npm ERR! code EACCES"

### Significa
Problema de permisos

### Solución

```bash
# 1. Abre PowerShell como ADMINISTRADOR
# Click derecho en PowerShell → "Run as Administrator"

# 2. Navega a proyecto
cd c:\Users\test\Desktop\etl\dashboard\frontend

# 3. Limpia y reinstala
npm cache clean --force
rm -r node_modules
npm install

# 4. Inicia
npm start
```

---

## 🔴 Propiedades siempre muestran 0

### Síntoma
Grid dice "No properties found"

### Solución

```
IMPORTANTE: Los filtros NO aplican automáticamente

Debes:
1. Ver el panel de filtros a la izquierda
2. Cambiar valores si quieres
3. HACER CLIC EN BOTÓN AZUL "APLICAR"
4. LUEGO aparecen propiedades

Si sigues sin ver:
1. Click en "Limpiar" (reset)
2. Click en "Aplicar"
3. Ahora deberían ver todas las 2000
```

---

## 🔴 "Cannot read property 'map' of undefined"

### Significa
Componente recibió datos vacíos

### Solución

```bash
# 1. Abre F12 → Console
# 2. Nota qué línea del error

# 3. Verifica API:
curl http://localhost:8000/api/stats

# 4. Si retorna error, base de datos no tiene datos
# Reinicia backend con:
python main.py

# 5. Si sigues con error, reinicia TODO:
# 5a. Mata procesos
Stop-Process -Name "node" -Force
Stop-Process -Name "python" -Force

# 5b. Espera 5 seg
Start-Sleep -Seconds 5

# 5c. Inicia backend
cd dashboard\backend
python main.py

# 5d. En nueva terminal, frontend
cd dashboard\frontend
npm start
```

---

## 🔴 Mapa muestra "No provider found for map"

### Significa
React Leaflet CSS no cargó

### Solución

```bash
# 1. Reinstala React Leaflet
npm uninstall react-leaflet leaflet
npm install react-leaflet leaflet

# 2. Verifica que index.css tenga:
# import 'leaflet/dist/leaflet.css'

# 3. Reinicia
npm start

# 4. Si sigue, recarga página
F5
```

---

## 🔴 Build falla con "out of memory"

### Significa
Node.js no tiene suficiente memoria

### Solución

```bash
# Aumenta memoria de Node
NODE_OPTIONS=--max_old_space_size=4096 npm start

# O permanentemente, edita package.json:
"scripts": {
  "start": "NODE_OPTIONS=--max_old_space_size=4096 react-scripts start"
}
```

---

## 🚨 PLAN DE EMERGENCIA - ÚLTIMA OPCIÓN

Si nada funciona, sigue esto exactamente:

### Paso 1: Limpia TODO

```bash
# Como Administrador:
cd c:\Users\test\Desktop\etl

# Mata procesos
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "python" -Force -ErrorAction SilentlyContinue

# Espera
Start-Sleep -Seconds 5

# Limpia dependencias frontend
cd dashboard\frontend
rm -r node_modules
rm package-lock.json

# Limpia npm cache
npm cache clean --force

# Limpia pip cache
pip cache purge
```

### Paso 2: Reinstala TODO

```bash
# Backend
cd c:\Users\test\Desktop\etl\dashboard\backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
cd c:\Users\test\Desktop\etl\dashboard\frontend
npm install
```

### Paso 3: Inicia desde cero

```bash
# Terminal 1 - Backend
cd c:\Users\test\Desktop\etl\dashboard\backend
python main.py

# Espera 10 segundos

# Terminal 2 - Frontend
cd c:\Users\test\Desktop\etl\dashboard\frontend
npm start

# Espera 15 segundos

# Browser
http://localhost:3000
```

---

## 📞 Si Aún No Funciona

1. Anota EXACTAMENTE qué error ves en:
   - PowerShell/CMD
   - F12 Console del navegador

2. Verifica:
   - Windows → Services → PostgreSQL (debe estar Running)
   - Puertos libres: `netstat -ano | findstr :3000` y `:8000`

3. Consulta:
   - TROUBLESHOOTING.md (busca tu error específico)
   - REFERENCIA_RAPIDA.md

4. Última opción:
   - Reinstala Node.js desde https://nodejs.org/
   - Reinstala PostgreSQL desde https://www.postgresql.org/
   - Vuelve a intentar

---

## ✅ Tests Rápidos

Después de cada paso, verifica:

```bash
# Backend está vivo?
curl http://localhost:8000/docs
# Debería abrir documentación API

# Frontend conecta a backend?
# Abre F12 → Network → Busca petición a localhost:8000
# Debería estar en verde (200 status)

# Database tiene datos?
psql -U postgres -d cancun_properties -c "SELECT COUNT(*) FROM properties;"
# Debería mostrar: 2000
```

---

## 📝 Checklist de Emergencia

```
Si nada funciona:

[ ] Ejecuta: Stop-Process -Name "node" -Force
[ ] Ejecuta: Stop-Process -Name "python" -Force
[ ] Espera 5 segundos
[ ] Verifica puertos: netstat -ano | findstr :3000
[ ] Si en uso: taskkill /PID [NUMERO] /F
[ ] Reinicia backend: python main.py
[ ] Reinicia frontend: npm start
[ ] Abre: http://localhost:3000
[ ] Verifica F12 Console (sin errores rojos)
```

---

## 🆘 Contacto de Soporte

Si aún tienes problemas:

1. Revisa TROUBLESHOOTING.md completo
2. Verifica REFERENCIA_RAPIDA.md
3. Abre terminal en la carpeta del proyecto
4. Ejecuta: `python --version` y `npm --version`

---

**Creado por**: Angel Alexander  
**Última actualización**: 2024

---

## ¡Espero no necesites esto! 🤞

Pero si lo necesitas, probablemente llegará al final.

