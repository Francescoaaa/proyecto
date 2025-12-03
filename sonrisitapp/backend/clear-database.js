const mysql = require('mysql2/promise');
require('dotenv').config();

async function clearDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'sonrisitapp'
        });

        console.log('Conectado a la base de datos');

        // Deshabilitar verificación de claves foráneas
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

        // Limpiar todas las tablas
        await connection.execute('DELETE FROM historial_medico');
        await connection.execute('DELETE FROM turnos');
        await connection.execute('DELETE FROM horarios_atencion');
        await connection.execute('DELETE FROM usuarios');
        await connection.execute('DELETE FROM odontologos');
        await connection.execute('DELETE FROM servicios');

        // Reiniciar AUTO_INCREMENT
        await connection.execute('ALTER TABLE historial_medico AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE turnos AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE horarios_atencion AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE usuarios AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE odontologos AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE servicios AUTO_INCREMENT = 1');

        // Rehabilitar verificación de claves foráneas
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✅ Base de datos limpiada exitosamente');
        
        await connection.end();
    } catch (error) {
        console.error('❌ Error al limpiar la base de datos:', error);
    }
}

clearDatabase();