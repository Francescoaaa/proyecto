@echo off
echo ========================================
echo    VERIFICANDO ESTADO DEL BACKEND
echo ========================================
echo.

echo Probando conexión a http://localhost:3001...
curl -s http://localhost:3001 > nul 2>&1

if %errorlevel% == 0 (
    echo ✅ Backend está funcionando en puerto 3001
    echo.
    echo Probando endpoint de turnos...
    curl -s http://localhost:3001/turnos > nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ Endpoint /turnos responde correctamente
    ) else (
        echo ❌ Endpoint /turnos no responde
    )
) else (
    echo ❌ Backend NO está funcionando
    echo.
    echo Para iniciar el backend:
    echo 1. Ejecuta START_BACKEND.bat
    echo 2. O manualmente: cd backend && npm start
)

echo.
echo Presiona cualquier tecla para continuar...
pause > nul