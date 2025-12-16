// Autor: Francesco - https://github.com/Francescoaaa
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sonrisitapp',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Configuración específica del pool
const poolConfig = {
    ...dbConfig,
    connectionLimit: 10,
    queueLimit: 0,
    idleTimeout: 60000,
    maxIdle: 10
};

// Pool de conexiones
const pool = mysql.createPool(poolConfig);

const createConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log('Conexión a MySQL establecida');
            return connection;
        } catch (error) {
            console.error(`Intento ${i + 1}/${retries} - Error conectando a la base de datos:`, error.message);
            
            if (i === retries - 1) {
                throw new Error('No se pudo conectar a la base de datos después de varios intentos');
            }
            
            // Esperar antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};

// Función para verificar si la BD está disponible
const isDatabaseAvailable = async () => {
    try {
        const connection = await createConnection(1);
        await connection.execute('SELECT 1');
        connection.release();
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = { createConnection, isDatabaseAvailable, pool };