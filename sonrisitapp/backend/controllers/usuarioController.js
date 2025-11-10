const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createConnection } = require('../config/database');

const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;
        
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Nombre, email y password son obligatorios' });
        }

        const connection = await createConnection();
        
        // Verificar si el email ya existe
        const [existing] = await connection.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            await connection.end();
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await connection.execute(
            'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, telefono]
        );
        
        await connection.end();
        res.status(201).json({ message: 'Usuario creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password son obligatorios' });
        }

        const connection = await createConnection();
        const [users] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (users.length === 0) {
            await connection.end();
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            await connection.end();
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        await connection.end();
        res.json({
            message: 'Login exitoso',
            token,
            user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono, currentPassword, newPassword } = req.body;
        
        const connection = await createConnection();
        
        // Verificar que el usuario existe
        const [users] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (users.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const user = users[0];
        
        // Si se quiere cambiar la contraseña, verificar la actual
        if (newPassword) {
            if (!currentPassword) {
                await connection.end();
                return res.status(400).json({ error: 'Contraseña actual requerida' });
            }
            
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                await connection.end();
                return res.status(400).json({ error: 'Contraseña actual incorrecta' });
            }
            
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await connection.execute(
                'UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, password = ? WHERE id = ?',
                [nombre, email, telefono, hashedNewPassword, id]
            );
        } else {
            // Solo actualizar datos básicos
            await connection.execute(
                'UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
                [nombre, email, telefono, id]
            );
        }
        
        await connection.end();
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const recuperarPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email es obligatorio' });
        }

        const connection = await createConnection();
        const [users] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (users.length === 0) {
            await connection.end();
            return res.status(404).json({ error: 'Email no encontrado' });
        }

        // Generar contraseña temporal
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedTempPassword = await bcrypt.hash(tempPassword, 10);
        
        // Actualizar contraseña en la base de datos
        await connection.execute(
            'UPDATE usuarios SET password = ? WHERE email = ?',
            [hashedTempPassword, email]
        );
        
        await connection.end();
        
        // En un entorno real, aquí enviarías un email
        // Por ahora, devolvemos la contraseña temporal en la respuesta
        res.json({ 
            message: 'Contraseña temporal generada',
            tempPassword: tempPassword // Solo para desarrollo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const obtenerEstadisticas = async (req, res) => {
    try {
        const connection = await createConnection();
        
        const [usuarios] = await connection.execute('SELECT COUNT(*) as total FROM usuarios WHERE rol != "admin"');
        const [turnos] = await connection.execute('SELECT COUNT(*) as total FROM turnos WHERE estado IN ("reservado", "confirmado", "completado")');
        const [turnosHoy] = await connection.execute('SELECT COUNT(*) as total FROM turnos WHERE fecha = CURDATE() AND estado IN ("reservado", "confirmado")');
        const [odontologos] = await connection.execute('SELECT COUNT(*) as total FROM odontologos WHERE activo = TRUE');
        const [servicios] = await connection.execute('SELECT COUNT(*) as total FROM servicios WHERE activo = TRUE');
        const [turnosCompletados] = await connection.execute('SELECT COUNT(*) as total FROM turnos WHERE estado = "completado"');
        
        await connection.end();
        
        res.json({
            usuariosRegistrados: usuarios[0].total,
            turnosReservados: turnos[0].total,
            turnosHoy: turnosHoy[0].total,
            odontologosActivos: odontologos[0].total,
            serviciosDisponibles: servicios[0].total,
            turnosCompletados: turnosCompletados[0].total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { crearUsuario, login, actualizarUsuario, recuperarPassword, obtenerEstadisticas };