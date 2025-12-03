@echo off
echo ========================================
echo   CONFIGURACIÓN DE BASE DE DATOS
echo ========================================
echo.

echo Este script te ayudará a configurar la base de datos MySQL
echo.

echo 1. Asegúrate de que XAMPP esté ejecutándose
echo 2. MySQL debe estar activo en el puerto 3306
echo 3. Ve a http://localhost/phpmyadmin/
echo.

echo Pasos a seguir:
echo.
echo 1. Crear nueva base de datos:
echo    - Nombre: sonrisitapp
echo    - Cotejamiento: utf8_general_ci
echo.
echo 2. Importar estructura:
echo    - Seleccionar la base de datos 'sonrisitapp'
echo    - Ir a pestaña 'SQL'
echo    - Copiar contenido de: backend\database.sql
echo    - Ejecutar el script
echo.
echo 3. Verificar que se crearon las tablas:
echo    - usuarios
echo    - odontologos  
echo    - servicios
echo    - turnos
echo    - notificaciones
echo    - historial_medico
echo    - horarios_atencion
echo.

echo ¿Quieres abrir phpMyAdmin ahora? (S/N)
set /p choice=
if /i "%choice%"=="S" start http://localhost/phpmyadmin/

echo.
echo Credenciales por defecto:
echo Usuario admin: admin@sonrisitapp.com
echo Contraseña: password
echo.
pause