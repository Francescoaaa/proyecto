@echo off
echo ========================================
echo   CONFIGURACIÓN DE GITHUB Y DESPLIEGUE
echo ========================================
echo.

echo Este script te ayudará a configurar GitHub y desplegar en Render
echo.

echo PASOS A SEGUIR:
echo.

echo 1. CREAR REPOSITORIO EN GITHUB:
echo    - Ve a https://github.com/new
echo    - Nombre: sonrisitapp
echo    - Descripción: Sistema de Gestión de Turnos Odontológicos
echo    - Público o Privado (según prefieras)
echo    - NO inicializar con README (ya tienes archivos)
echo.

echo 2. CONFIGURAR GIT LOCAL:
echo    Ejecuta estos comandos en la terminal:
echo.
echo    git init
echo    git add .
echo    git commit -m "Initial commit - SonrisitApp"
echo    git branch -M main
echo    git remote add origin https://github.com/Francescoaaa/sonrisitapp.git
echo    git push -u origin main
echo.

echo 3. DESPLEGAR EN RENDER:
echo    - Ve a https://render.com
echo    - Crea cuenta gratuita
echo    - Conecta tu repositorio GitHub
echo    - Sigue la guía en DEPLOYMENT_GUIDE.md
echo.

echo 4. INFORMACIÓN PARA ENTREGAR:
echo.
echo    📂 Repositorio GitHub:
echo    https://github.com/Francescoaaa/sonrisitapp
echo.
echo    🌐 Proyecto Desplegado:
echo    Frontend: https://sonrisitapp-frontend.onrender.com
echo    Backend:  https://sonrisitapp-backend.onrender.com
echo.
echo    👥 Información del Grupo:
echo    Trabajo Individual - [TU NOMBRE COMPLETO]
echo.

echo ¿Quieres abrir GitHub para crear el repositorio? (S/N)
set /p choice=
if /i "%choice%"=="S" start https://github.com/new

echo.
echo ¿Quieres abrir Render para el despliegue? (S/N)
set /p choice2=
if /i "%choice2%"=="S" start https://render.com

echo.
echo Archivos creados para el despliegue:
echo ✅ .gitignore
echo ✅ package.json (principal)
echo ✅ render.yaml
echo ✅ DEPLOYMENT_GUIDE.md
echo.
echo Lee DEPLOYMENT_GUIDE.md para instrucciones detalladas
echo.
pause