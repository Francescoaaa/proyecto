const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTurnosTable() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Conectado a la base de datos');

        // Eliminar tabla existente si existe
        await connection.execute('DROP TABLE IF EXISTS turnos');
        console.log('🗑️  Tabla turnos eliminada (si existía)');

        // Crear tabla turnos simplificada
        await connection.execute(`
            CREATE TABLE turnos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                fecha DATE NOT NULL,
                hora TIME NOT NULL,
                servicio VARCHAR(100) NOT NULL,
                observaciones TEXT,
                estado ENUM('reservado', 'confirmado', 'completado', 'cancelado') DEFAULT 'reservado',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Tabla turnos creada exitosamente');

        // Insertar algunos turnos de ejemplo
        await connection.execute(`
            INSERT INTO turnos (usuario_id, fecha, hora, servicio, estado, observaciones) VALUES
            (999, '2025-01-20', '09:00:00', 'Limpieza dental', 'reservado', 'Turno de ejemplo'),
            (999, '2025-01-20', '10:30:00', 'Control general', 'confirmado', 'Turno de ejemplo'),
            (999, '2025-01-21', '14:00:00', 'Ortodoncia', 'reservado', 'Turno de ejemplo')
        `);
        console.log('✅ Turnos de ejemplo insertados');

        // Verificar que se creó correctamente
        const [turnos] = await connection.execute('SELECT * FROM turnos');
        console.log('📋 Turnos en la tabla:', turnos.length);

        await connection.end();
        console.log('✅ Tabla de turnos configurada correctamente');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createTurnosTable();