@echo off
echo ========================================
echo    INICIANDO SERVIDOR BACKEND
echo ========================================
echo.

cd /d "c:\xampp\htdocs\proyecto fede\sonrisitapp\backend"

echo Verificando directorio...
echo Directorio actual: %CD%
echo.

echo Verificando package.json...
if exist package.json (
    echo ✅ package.json encontrado
) else (
    echo ❌ package.json NO encontrado
    echo Verifica que estés en el directorio correcto
    pause
    exit /b 1
)
echo.

echo Instalando dependencias...
npm install
echo.

echo Iniciando servidor en puerto 3001...
echo Presiona Ctrl+C para detener el servidor
echo.
npm start

pause