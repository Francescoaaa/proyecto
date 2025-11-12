@echo off
title SonrisitApp - Inicio Rapido
color 0A

echo ========================================
echo    SONRISITAPP - INICIO RAPIDO
echo ========================================
echo.

echo 1. Verificando XAMPP...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL está ejecutándose
) else (
    echo ❌ MySQL NO está ejecutándose
    echo    Por favor inicia XAMPP y activa MySQL
    pause
    exit /b 1
)

echo.
echo 2. Iniciando Backend...
cd /d "c:\xampp\htdocs\proyecto fede\sonrisitapp\backend"

echo Instalando dependencias...
npm install --silent

echo.
echo 3. Iniciando servidor en puerto 3001...
echo ✅ CORS configurado para localhost:3000
echo ✅ Servidor listo para recibir conexiones
echo.
echo Para detener: Presiona Ctrl+C
echo.

npm start