@echo off
title Verificar MySQL - SonrisitApp
color 0E

echo ========================================
echo    VERIFICANDO MYSQL - SONRISITAPP
echo ========================================
echo.

echo 1. Verificando si MySQL está ejecutándose...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL está ejecutándose
) else (
    echo ❌ MySQL NO está ejecutándose
    echo.
    echo SOLUCIÓN:
    echo 1. Abre XAMPP Control Panel
    echo 2. Haz clic en "Start" junto a MySQL
    echo 3. Espera a que aparezca en verde
    echo.
    pause
    exit /b 1
)

echo.
echo 2. Verificando puerto 3306...
netstat -an | find "3306" >NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Puerto 3306 está en uso (MySQL escuchando)
) else (
    echo ❌ Puerto 3306 no está en uso
    echo    MySQL puede no estar iniciado correctamente
)

echo.
echo 3. Probando conexión a la base de datos...
cd /d "c:\xampp\htdocs\proyecto fede\sonrisitapp\backend"

node -e "
const mysql = require('mysql2/promise');
async function testConnection() {
  try {
    console.log('Intentando conectar a MySQL...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      port: 3306
    });
    console.log('✅ Conexión a MySQL exitosa');
    
    console.log('Verificando base de datos sonrisitapp...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS sonrisitapp');
    await connection.execute('USE sonrisitapp');
    console.log('✅ Base de datos sonrisitapp OK');
    
    console.log('Verificando tablas...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tablas encontradas:', tables.length);
    tables.forEach(table => console.log('  -', Object.values(table)[0]));
    
    await connection.end();
    console.log('✅ Verificación completa exitosa');
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Solución: Inicia MySQL en XAMPP');
    }
  }
}
testConnection();
"

echo.
echo ========================================
echo Presiona cualquier tecla para continuar...
pause > nul