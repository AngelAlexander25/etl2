@echo off
REM Script de Verificación del Dashboard Cancún
REM Verifica que todo esté listo para ejecutar

echo.
echo ====================================
echo   DASHBOARD CANCUN - VERIFICACION
echo ====================================
echo.

REM Verificar Python
echo [1/5] Verificando Python...
python --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✓ Python instalado
) else (
    echo ✗ ERROR: Python no encontrado
    echo   Descarga desde https://www.python.org/downloads/
    exit /b 1
)

REM Verificar Node.js
echo [2/5] Verificando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✓ Node.js instalado
) else (
    echo ✗ ERROR: Node.js no encontrado
    echo   Descarga desde https://nodejs.org/
    exit /b 1
)

REM Verificar npm
echo [3/5] Verificando npm...
npm --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✓ npm instalado
) else (
    echo ✗ ERROR: npm no encontrado
    exit /b 1
)

REM Verificar carpetas
echo [4/5] Verificando estructura de carpetas...
if exist "dashboard\backend\main.py" (
    echo ✓ Backend encontrado
) else (
    echo ✗ ERROR: Backend main.py no encontrado
    exit /b 1
)

if exist "dashboard\frontend\src\App.js" (
    echo ✓ Frontend encontrado
) else (
    echo ✗ ERROR: Frontend App.js no encontrado
    exit /b 1
)

REM Verificar node_modules
echo [5/5] Verificando dependencias...
if exist "dashboard\frontend\node_modules" (
    echo ✓ Dependencias de Frontend instaladas
) else (
    echo ⚠ Dependencias no instaladas. Ejecutando npm install...
    cd dashboard\frontend
    call npm install
    cd ..\..
    echo ✓ npm install completado
)

echo.
echo ====================================
echo   VERIFICACION COMPLETADA
echo ====================================
echo.
echo PROXIMOS PASOS:
echo.
echo 1. Terminal 1 - Iniciar Backend:
echo    cd dashboard\backend
echo    python main.py
echo.
echo 2. Terminal 2 - Iniciar Frontend:
echo    cd dashboard\frontend
echo    npm start
echo.
echo 3. Abre en navegador:
echo    http://localhost:3000
echo.
echo ====================================
pause
