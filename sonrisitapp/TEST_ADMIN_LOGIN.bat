@echo off
echo ========================================
echo   PRUEBA DE LOGIN ADMINISTRADOR
echo ========================================
echo.

echo Credenciales del administrador:
echo Email: admin@sonrisitapp.com
echo Contraseña: password
echo.

echo Pasos para probar:
echo 1. Asegúrate de que el backend esté ejecutándose (puerto 3001)
echo 2. Asegúrate de que el frontend esté ejecutándose (puerto 3000)
echo 3. Ve a http://localhost:3000/login
echo 4. Ingresa las credenciales de arriba
echo 5. Deberías ser redirigido al panel de administración
echo.

echo Verificando servicios...
echo.

REM Verificar backend
echo Verificando backend (puerto 3001)...
netstat -an | findstr ":3001" >nul
if errorlevel 1 (
    echo ❌ Backend NO está ejecutándose
    echo    Ejecuta: START_BACKEND.bat
) else (
    echo ✅ Backend ejecutándose
)

REM Verificar frontend
echo Verificando frontend (puerto 3000)...
netstat -an | findstr ":3000" >nul
if errorlevel 1 (
    echo ❌ Frontend NO está ejecutándose
    echo    Ejecuta: START_FRONTEND.bat
) else (
    echo ✅ Frontend ejecutándose
)

REM Verificar MySQL
echo Verificando MySQL (puerto 3306)...
netstat -an | findstr ":3306" >nul
if errorlevel 1 (
    echo ❌ MySQL NO está ejecutándose
    echo    Inicia XAMPP y activa MySQL
) else (
    echo ✅ MySQL ejecutándose
)

echo.
echo ¿Quieres abrir la página de login ahora? (S/N)
set /p choice=
if /i "%choice%"=="S" start http://localhost:3000/login

echo.
echo Si el login sigue fallando, revisa:
echo 1. Consola del navegador (F12) para errores
echo 2. Consola del backend para logs
echo 3. Que la base de datos tenga el usuario admin
echo.
pause