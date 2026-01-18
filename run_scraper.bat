@echo off
REM Script para ejecutar scraper automáticamente

cd C:\Users\test\Desktop\etl
C:\Users\test\Desktop\etl\.venv\Scripts\python.exe scraper_selenium.py

REM Log de ejecución
echo Scraper ejecutado: %date% %time% >> scraper_log.txt
