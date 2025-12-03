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
            connection.release();
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await connection.execute(
            'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, telefono]
        );
        
        connection.release();
        res.status(201).json({ message: 'Usuario creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('LOGIN_BACKEND: Intento de login con email:', email);
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password son obligatorios' });
        }

        const connection = await createConnection();
        
        try {
            const [users] = await connection.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
            console.log('LOGIN_BACKEND: Usuarios encontrados:', users.length);
            
            if (users.length === 0) {
                console.log('LOGIN_BACKEND: Usuario no encontrado');
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const user = users[0];
            console.log('LOGIN_BACKEND: Usuario encontrado:', user.nombre, user.email);
            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('LOGIN_BACKEND: Password válido:', isValidPassword);
            
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log('LOGIN_BACKEND: Login exitoso para:', user.nombre);
            res.json({
                message: 'Login exitoso',
                token,
                user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('LOGIN_BACKEND: Error:', error);
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
            connection.release();
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const user = users[0];
        
        // Si se quiere cambiar la contraseña, verificar la actual
        if (newPassword) {
            if (!currentPassword) {
                connection.release();
                return res.status(400).json({ error: 'Contraseña actual requerida' });
            }
            
            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                connection.release();
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
        
        connection.release();
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
            connection.release();
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
        
        connection.release();
        
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
        const [turnosCompletados] = await connection.execute('SELECT COUNT(*) as total FROM turnos WHERE estado = "completado"');
        const [odontologos] = await connection.execute('SELECT COUNT(*) as total FROM odontologos WHERE activo = 1');
        const [servicios] = await connection.execute('SELECT COUNT(*) as total FROM servicios WHERE activo = 1');
        
        connection.release();
        
        res.json({
            usuariosRegistrados: usuarios[0].total || 0,
            turnosReservados: turnos[0].total || 0,
            turnosHoy: turnosHoy[0].total || 0,
            odontologosActivos: odontologos[0].total || 0,
            serviciosDisponibles: servicios[0].total || 0,
            turnosCompletados: turnosCompletados[0].total || 0
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

const obtenerTodosUsuarios = async (req, res) => {
    try {
        console.log('USUARIOS_BACKEND: Obteniendo todos los usuarios');
        const connection = await createConnection();
        
        const [usuarios] = await connection.execute(`
            SELECT id, nombre, email, rol, created_at 
            FROM usuarios 
            ORDER BY created_at DESC
        `);
        
        connection.release();
        console.log('USUARIOS_BACKEND: Usuarios encontrados:', usuarios.length);
        res.json(usuarios || []);
    } catch (error) {
        console.error('USUARIOS_BACKEND: Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const actualizarPreferenciasNotificaciones = async (req, res) => {
    try {
        const { id } = req.params;
        const { email_notifications, promo_notifications } = req.body;
        
        const connection = await createConnection();
        
        await connection.execute(
            'UPDATE usuarios SET email_notifications = ?, promo_notifications = ? WHERE id = ?',
            [email_notifications, promo_notifications, id]
        );
        
        connection.release();
        res.json({ message: 'Preferencias actualizadas exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const eliminarCuenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { confirmEmail } = req.body;
        
        const connection = await createConnection();
        
        // Verificar que el usuario existe y el email coincide
        const [users] = await connection.execute('SELECT email FROM usuarios WHERE id = ?', [id]);
        if (users.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        if (users[0].email !== confirmEmail) {
            connection.release();
            return res.status(400).json({ error: 'Email de confirmación incorrecto' });
        }
        
        // Eliminar usuario (CASCADE eliminará turnos automáticamente)
        await connection.execute('DELETE FROM usuarios WHERE id = ?', [id]);
        
        connection.release();
        res.json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { 
    crearUsuario, 
    login, 
    actualizarUsuario, 
    recuperarPassword, 
    obtenerEstadisticas, 
    obtenerTodosUsuarios,
    actualizarPreferenciasNotificaciones,
    eliminarCuenta
};