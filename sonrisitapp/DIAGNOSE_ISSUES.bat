@echo off
echo ========================================
echo   DIAGNÓSTICO DEL PROYECTO SONRISITAPP
echo ========================================
echo.

echo Verificando estructura del proyecto...
echo.

REM Verificar archivos principales
echo 📁 Estructura de archivos:
if exist "backend\server.js" (echo ✅ backend\server.js) else (echo ❌ backend\server.js FALTANTE)
if exist "backend\package.json" (echo ✅ backend\package.json) else (echo ❌ backend\package.json FALTANTE)
if exist "backend\.env" (echo ✅ backend\.env) else (echo ❌ backend\.env FALTANTE)
if exist "backend\database.sql" (echo ✅ backend\database.sql) else (echo ❌ backend\database.sql FALTANTE)

if exist "frontend\src\App.js" (echo ✅ frontend\src\App.js) else (echo ❌ frontend\src\App.js FALTANTE)
if exist "frontend\package.json" (echo ✅ frontend\package.json) else (echo ❌ frontend\package.json FALTANTE)

echo.
echo 🔍 Verificando dependencias:
if exist "backend\node_modules" (echo ✅ Backend node_modules instalado) else (echo ❌ Backend node_modules NO INSTALADO)
if exist "frontend\node_modules" (echo ✅ Frontend node_modules instalado) else (echo ❌ Frontend node_modules NO INSTALADO)

echo.
echo 🔍 Verificando archivos duplicados:
if exist "backend\database_alternativa.sql" (echo ⚠️  Archivo duplicado: database_alternativa.sql) else (echo ✅ Sin database_alternativa.sql)
if exist "backend\database_moderna.sql" (echo ⚠️  Archivo duplicado: database_moderna.sql) else (echo ✅ Sin database_moderna.sql)
if exist "backend\database_normalizada.sql" (echo ⚠️  Archivo duplicado: database_normalizada.sql) else (echo ✅ Sin database_normalizada.sql)

echo.
echo 🔍 Verificando configuración:
if exist "backend\.env" (
    echo Contenido de .env:
    type "backend\.env"
) else (
    echo ❌ Archivo .env no encontrado
)

echo.
echo 🔍 Verificando puertos:
netstat -an | findstr ":3001" >nul
if errorlevel 1 (echo ❌ Puerto 3001 libre) else (echo ⚠️  Puerto 3001 ocupado)

netstat -an | findstr ":3000" >nul
if errorlevel 1 (echo ❌ Puerto 3000 libre) else (echo ⚠️  Puerto 3000 ocupado)

netstat -an | findstr ":3306" >nul
if errorlevel 1 (echo ❌ Puerto 3306 libre - MySQL no ejecutándose) else (echo ✅ Puerto 3306 ocupado - MySQL ejecutándose)

echo.
echo 🔍 Verificando servicios XAMPP:
tasklist | findstr "httpd.exe" >nul
if errorlevel 1 (echo ❌ Apache no ejecutándose) else (echo ✅ Apache ejecutándose)

tasklist | findstr "mysqld.exe" >nul
if errorlevel 1 (echo ❌ MySQL no ejecutándose) else (echo ✅ MySQL ejecutándose)

echo.
echo ========================================
echo   RECOMENDACIONES
echo ========================================
echo.

if not exist "backend\node_modules" (
    echo 🔧 Ejecutar: INSTALL_DEPENDENCIES.bat
)

if exist "backend\database_alternativa.sql" (
    echo 🔧 Ejecutar: CLEANUP_PROJECT.bat
)

if not exist "backend\.env" (
    echo 🔧 Crear archivo .env en backend con:
    echo    DB_HOST=localhost
    echo    DB_USER=root
    echo    DB_PASSWORD=
    echo    DB_NAME=sonrisitapp
    echo    JWT_SECRET=sonrisitapp_secret_key_2025
    echo    PORT=3001
)

echo.
pause