@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo   QUITO - Guardianes de las Leyendas
echo ==========================================
echo.
echo Abriendo http://localhost:5500
where py >nul 2>&1
if %errorlevel%==0 (
  start "" "http://localhost:5500"
  py -m http.server 5500
) else (
  where python >nul 2>&1
  if %errorlevel%==0 (
    start "" "http://localhost:5500"
    python -m http.server 5500
  ) else (
    echo No se encontro Python. Abre index.html con Live Server en VS Code.
    pause
  )
)
