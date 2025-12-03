@echo off
echo ========================================
echo   INSTALACIÓN DE DEPENDENCIAS
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado
    echo Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js detectado
    node --version
)

echo.
echo Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm no está disponible
    pause
    exit /b 1
) else (
    echo ✅ npm detectado
    npm --version
)

echo.
echo ========================================
echo   INSTALANDO DEPENDENCIAS DEL BACKEND
echo ========================================
echo.

cd backend
if errorlevel 1 (
    echo ❌ No se pudo acceder a la carpeta backend
    pause
    exit /b 1
)

echo Instalando dependencias del backend...
npm install
if errorlevel 1 (
    echo ❌ Error al instalar dependencias del backend
    pause
    exit /b 1
) else (
    echo ✅ Dependencias del backend instaladas correctamente
)

echo.
echo ========================================
echo   INSTALANDO DEPENDENCIAS DEL FRONTEND
echo ========================================
echo.

cd ..\frontend
if errorlevel 1 (
    echo ❌ No se pudo acceder a la carpeta frontend
    pause
    exit /b 1
)

echo Instalando dependencias del frontend...
npm install
if errorlevel 1 (
    echo ❌ Error al instalar dependencias del frontend
    pause
    exit /b 1
) else (
    echo ✅ Dependencias del frontend instaladas correctamente
)

cd ..

echo.
echo ========================================
echo   INSTALACIÓN COMPLETADA
echo ========================================
echo.
echo ✅ Todas las dependencias han sido instaladas correctamente
echo.
echo Próximos pasos:
echo 1. Configurar la base de datos (ejecutar SETUP_DATABASE.bat)
echo 2. Iniciar el backend (ejecutar START_BACKEND.bat)
echo 3. Iniciar el frontend (ejecutar START_FRONTEND.bat)
echo.
pause