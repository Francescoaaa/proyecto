const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    try {
        // Conectar sin especificar base de datos
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Conectado a MySQL');

        // Crear base de datos si no existe
        await connection.execute('CREATE DATABASE IF NOT EXISTS sonrisitapp');
        console.log('Base de datos sonrisitapp creada/verificada');

        // Usar la base de datos
        await connection.execute('USE sonrisitapp');

        // Verificar si existen las tablas
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('Tablas existentes:', tables.map(t => Object.values(t)[0]));

        // Si no hay tablas, ejecutar el script SQL
        if (tables.length === 0) {
            console.log('No se encontraron tablas. Ejecutando script de creación...');
            
            const fs = require('fs');
            const sqlScript = fs.readFileSync('./database/database.sql', 'utf8');
            
            // Dividir el script en statements individuales
            const statements = sqlScript.split(';').filter(stmt => stmt.trim().length > 0);
            
            for (const statement of statements) {
                if (statement.trim()) {
                    try {
                        await connection.execute(statement);
                    } catch (error) {
                        console.log('Error en statement (puede ser normal):', error.message);
                    }
                }
            }
            
            console.log('Script SQL ejecutado');
        }

        // Verificar usuario francesco albini
        const [users] = await connection.execute('SELECT * FROM usuarios WHERE email LIKE "%francesco%" OR nombre LIKE "%francesco%"');
        
        if (users.length === 0) {
            console.log('Usuario Francesco Albini no encontrado. Creándolo...');
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('password', 10);
            
            await connection.execute(
                'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
                ['Francesco Albini', 'francesco.albini@email.com', hashedPassword, '123-456-7895']
            );
            
            console.log('Usuario Francesco Albini creado exitosamente');
        } else {
            console.log('Usuario Francesco encontrado:', users[0].nombre, users[0].email);
        }

        await connection.end();
        console.log('Setup completado exitosamente');

    } catch (error) {
        console.error('Error en setup:', error);
    }
}

setupDatabase();