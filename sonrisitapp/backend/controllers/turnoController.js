const { createConnection } = require('../config/database');

const listarTurnos = async (req, res) => {
    try {
        const connection = await createConnection();
        const [turnos] = await connection.execute(`
            SELECT t.*, u.nombre as usuario_nombre, s.nombre as servicio_nombre, o.nombre as odontologo_nombre
            FROM turnos t 
            LEFT JOIN usuarios u ON t.usuario_id = u.id 
            LEFT JOIN servicios s ON t.servicio_id = s.id
            LEFT JOIN odontologos o ON t.odontologo_id = o.id
            ORDER BY t.fecha, t.hora
        `);
        await connection.end();
        res.json(turnos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const crearTurno = async (req, res) => {
    try {
        const { usuario_id, fecha, hora, servicio, observaciones } = req.body;
        
        if (!usuario_id || !fecha || !hora || !servicio) {
            return res.status(400).json({ error: 'Usuario, fecha, hora y servicio son obligatorios' });
        }

        const connection = await createConnection();
        
        // Buscar el servicio por nombre para obtener el ID
        const [servicioData] = await connection.execute(
            'SELECT id FROM servicios WHERE nombre = ? AND activo = TRUE',
            [servicio]
        );
        
        if (servicioData.length === 0) {
            await connection.end();
            return res.status(400).json({ error: 'Servicio no encontrado' });
        }
        
        const servicio_id = servicioData[0].id;
        
        // Verificar si ya existe un turno en esa fecha y hora
        const [existing] = await connection.execute(
            'SELECT id FROM turnos WHERE fecha = ? AND hora = ? AND estado IN (?, ?)',
            [fecha, hora, 'reservado', 'confirmado']
        );
        
        if (existing.length > 0) {
            await connection.end();
            return res.status(400).json({ error: 'Ya existe un turno reservado en esa fecha y hora' });
        }

        const [result] = await connection.execute(
            'INSERT INTO turnos (usuario_id, odontologo_id, servicio_id, fecha, hora, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, 1, servicio_id, fecha, hora, observaciones]
        );
        
        await connection.end();
        res.status(201).json({ message: 'Turno creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const modificarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, hora, servicio, observaciones, estado } = req.body;
        
        const connection = await createConnection();
        
        let servicio_id = null;
        if (servicio) {
            const [servicioData] = await connection.execute(
                'SELECT id FROM servicios WHERE nombre = ? AND activo = TRUE',
                [servicio]
            );
            if (servicioData.length > 0) {
                servicio_id = servicioData[0].id;
            }
        }
        
        const [result] = await connection.execute(
            'UPDATE turnos SET fecha = ?, hora = ?, servicio_id = ?, observaciones = ?, estado = ? WHERE id = ?',
            [fecha, hora, servicio_id, observaciones, estado, id]
        );
        
        await connection.end();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        
        res.json({ message: 'Turno modificado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const cancelarTurno = async (req, res) => {
    try {
        const { id } = req.params;
        
        const connection = await createConnection();
        const [result] = await connection.execute(
            'UPDATE turnos SET estado = "cancelado" WHERE id = ?',
            [id]
        );
        
        await connection.end();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }
        
        res.json({ message: 'Turno cancelado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const misTurnos = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        
        const connection = await createConnection();
        const [turnos] = await connection.execute(`
            SELECT t.*, s.nombre as servicio, o.nombre as odontologo_nombre
            FROM turnos t 
            LEFT JOIN servicios s ON t.servicio_id = s.id
            LEFT JOIN odontologos o ON t.odontologo_id = o.id
            WHERE t.usuario_id = ? 
            ORDER BY t.fecha, t.hora
        `, [usuario_id]);
        
        await connection.end();
        res.json(turnos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { listarTurnos, crearTurno, modificarTurno, cancelarTurno, misTurnos };