const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Conectado a la base de datos');

        // Verificar tablas existentes
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('\n📋 Tablas existentes:');
        tables.forEach(table => {
            console.log(`  - ${Object.values(table)[0]}`);
        });

        // Verificar estructura de tabla turnos
        try {
            const [columns] = await connection.execute('DESCRIBE turnos');
            console.log('\n🏗️  Estructura de tabla turnos:');
            columns.forEach(col => {
                console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''}`);
            });
        } catch (error) {
            console.log('\n❌ Tabla turnos no existe');
        }

        // Verificar usuarios
        try {
            const [users] = await connection.execute('SELECT id, nombre, email FROM usuarios LIMIT 5');
            console.log('\n👥 Usuarios en la base de datos:');
            users.forEach(user => {
                console.log(`  - ID: ${user.id}, Nombre: ${user.nombre}, Email: ${user.email}`);
            });
        } catch (error) {
            console.log('\n❌ Error al obtener usuarios:', error.message);
        }

        await connection.end();
        console.log('\n✅ Verificación completada');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkDatabase();