@echo off
echo ========================================
echo   LIMPIAR SESIÓN DE USUARIO
echo ========================================
echo.

echo Este script te ayudará a limpiar la sesión actual
echo para poder registrar un nuevo usuario.
echo.

echo Pasos para limpiar la sesión:
echo.
echo 1. Abre el navegador en: http://localhost:3000
echo 2. Presiona F12 para abrir herramientas de desarrollador
echo 3. Ve a la pestaña "Application" o "Aplicación"
echo 4. En el panel izquierdo, busca "Local Storage"
echo 5. Haz clic en "http://localhost:3000"
echo 6. Elimina las entradas "token" y "user"
echo 7. Recarga la página (F5)
echo.

echo Alternativamente:
echo - Haz clic en tu nombre en la esquina superior derecha
echo - Selecciona "Cerrar Sesión"
echo.

echo ¿Quieres abrir la aplicación ahora? (S/N)
set /p choice=
if /i "%choice%"=="S" start http://localhost:3000

pause