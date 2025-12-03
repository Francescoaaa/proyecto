const express = require('express');
const { createConnection } = require('../config/database');
const router = express.Router();

// Obtener todos los servicios activos
router.get('/', async (req, res) => {
    try {
        const connection = await createConnection();
        
        try {
            const [servicios] = await connection.execute(
                'SELECT id, nombre, descripcion, duracion_minutos, precio FROM servicios WHERE activo = 1 ORDER BY nombre'
            );
            
            res.json(servicios);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

module.exports = router;