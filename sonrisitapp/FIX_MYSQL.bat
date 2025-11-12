@echo off
title Reparar MySQL - SonrisitApp
color 0C

echo ========================================
echo    REPARANDO MYSQL - SONRISITAPP
echo ========================================
echo.

echo Este script intentará solucionar problemas comunes de MySQL
echo.
pause

echo 1. Deteniendo MySQL si está ejecutándose...
taskkill /F /IM mysqld.exe 2>NUL
timeout /t 2 >NUL

echo.
echo 2. Iniciando XAMPP Control Panel...
start "" "C:\xampp\xampp-control.exe"

echo.
echo 3. INSTRUCCIONES MANUALES:
echo ========================================
echo 1. En XAMPP Control Panel:
echo    - Si MySQL está en rojo, haz clic en "Start"
echo    - Si está en verde, haz clic en "Stop" y luego "Start"
echo    - Espera a que aparezca "Running" en verde
echo.
echo 2. Si hay errores:
echo    - Haz clic en "Config" → "my.ini"
echo    - Verifica que el puerto sea 3306
echo    - Guarda y reinicia MySQL
echo.
echo 3. Si sigue fallando:
echo    - Haz clic en "Logs" para ver errores
echo    - Puede ser conflicto de puertos
echo ========================================
echo.

echo 4. Creando/verificando base de datos...
cd /d "c:\xampp\htdocs\proyecto fede\sonrisitapp\backend"

timeout /t 5 >NUL

node -e "
const mysql = require('mysql2/promise');
async function setupDatabase() {
  try {
    console.log('Esperando a que MySQL esté listo...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });
    
    console.log('✅ Conectado a MySQL');
    
    // Crear base de datos
    await connection.execute('CREATE DATABASE IF NOT EXISTS sonrisitapp');
    console.log('✅ Base de datos sonrisitapp creada/verificada');
    
    await connection.execute('USE sonrisitapp');
    
    // Crear tabla usuarios
    await connection.execute(\`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('usuario', 'admin') DEFAULT 'usuario',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);
    console.log('✅ Tabla usuarios OK');
    
    // Crear tabla turnos
    await connection.execute(\`
      CREATE TABLE IF NOT EXISTS turnos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        servicio VARCHAR(100) NOT NULL,
        estado ENUM('reservado', 'confirmado', 'completado', 'cancelado') DEFAULT 'reservado',
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    \`);
    console.log('✅ Tabla turnos OK');
    
    // Crear tabla notificaciones
    await connection.execute(\`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        mensaje TEXT,
        turno_id INT,
        leida BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    \`);
    console.log('✅ Tabla notificaciones OK');
    
    await connection.end();
    console.log('🎉 Base de datos completamente configurada');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('💡 Asegúrate de que MySQL esté iniciado en XAMPP');
  }
}
setupDatabase();
"

echo.
echo ========================================
echo Configuración completada
echo Presiona cualquier tecla para continuar...
pause > nul