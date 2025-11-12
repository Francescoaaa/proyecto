const express = require('express');
const { createConnection } = require('../config/database');
const router = express.Router();

// Test de conexión a MySQL
router.get('/mysql', async (req, res) => {
    try {
        console.log('TEST: Probando conexión a MySQL...');
        const connection = await createConnection();
        
        // Probar una consulta simple
        const [result] = await connection.execute('SELECT 1 as test, NOW() as timestamp');
        await connection.end();
        
        console.log('TEST: Conexión MySQL exitosa');
        res.json({
            status: 'success',
            message: 'Conexión a MySQL exitosa',
            data: result[0],
            config: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                database: process.env.DB_NAME
            }
        });
    } catch (error) {
        console.error('TEST: Error de conexión MySQL:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error de conexión a MySQL',
            error: error.message,
            config: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                database: process.env.DB_NAME
            }
        });
    }
});

// Test de tablas existentes
router.get('/tables', async (req, res) => {
    try {
        console.log('TEST: Verificando tablas...');
        const connection = await createConnection();
        
        const [tables] = await connection.execute('SHOW TABLES');
        await connection.end();
        
        console.log('TEST: Tablas encontradas:', tables.length);
        res.json({
            status: 'success',
            message: 'Tablas verificadas',
            tables: tables
        });
    } catch (error) {
        console.error('TEST: Error verificando tablas:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error verificando tablas',
            error: error.message
        });
    }
});

module.exports = router;