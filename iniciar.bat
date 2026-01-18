@echo off
REM Script rápido para iniciar ambos servidores
REM Abre 2 ventanas: Backend y Frontend

echo.
echo ====================================
echo   INICIANDO DASHBOARD CANCUN
echo   Creado por: Angel Alexander
echo ====================================
echo.

REM Iniciar Backend
echo Iniciando Backend (Terminal 1)...
start "Backend - FastAPI" cmd /k "cd dashboard\backend && python main.py"

REM Esperar 3 segundos antes de iniciar Frontend
timeout /t 3 /nobreak

REM Iniciar Frontend
echo Iniciando Frontend (Terminal 2)...
start "Frontend - React" cmd /k "cd dashboard\frontend && npm start"

echo.
echo ====================================
echo Ambos servidores se inician...
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Presiona Ctrl+C en cualquier terminal para detener
echo ====================================
echo.

pause
