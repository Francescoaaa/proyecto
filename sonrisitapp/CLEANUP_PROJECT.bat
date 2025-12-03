@echo off
echo ========================================
echo    LIMPIEZA DEL PROYECTO SONRISITAPP
echo ========================================
echo.

echo Eliminando archivos duplicados y temporales...

REM Eliminar archivos de base de datos duplicados si existen
if exist "backend\database_alternativa.sql" del "backend\database_alternativa.sql"
if exist "backend\database_moderna.sql" del "backend\database_moderna.sql"
if exist "backend\database_normalizada.sql" del "backend\database_normalizada.sql"

REM Eliminar archivos temporales
if exist "backend\*.tmp" del "backend\*.tmp"
if exist "frontend\*.tmp" del "frontend\*.tmp"

REM Limpiar node_modules si es necesario (descomentado si quieres reinstalar)
REM rmdir /s /q "backend\node_modules"
REM rmdir /s /q "frontend\node_modules"

echo.
echo ✅ Limpieza completada
echo.
echo Archivos eliminados:
echo - Bases de datos duplicadas
echo - Archivos temporales
echo.
echo Para reinstalar dependencias ejecuta:
echo   cd backend && npm install
echo   cd frontend && npm install
echo.
pause