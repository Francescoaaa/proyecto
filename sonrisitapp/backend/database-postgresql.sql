-- Autor: Francesco - https://github.com/Francescoaaa
-- =====================================================
-- BASE DE DATOS POSTGRESQL - SONRISITAPP
-- =====================================================

-- Eliminar tablas existentes en orden correcto (por dependencias)
DROP TABLE IF EXISTS notificaciones CASCADE;
DROP TABLE IF EXISTS historial_medico CASCADE;
DROP TABLE IF EXISTS turnos CASCADE;
DROP TABLE IF EXISTS horarios_atencion CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS odontologos CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;

-- =====================================================
-- CREACIÓN DE TABLAS
-- =====================================================

-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    direccion VARCHAR(200),
    rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('usuario', 'admin', 'odontologo')),
    email_notifications BOOLEAN DEFAULT TRUE,
    promo_notifications BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de odontólogos
CREATE TABLE odontologos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    matricula VARCHAR(50) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de servicios
CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_minutos INTEGER DEFAULT 30,
    precio DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de turnos
CREATE TABLE turnos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    odontologo_id INTEGER,
    servicio_id INTEGER NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'reservado' CHECK (estado IN ('reservado', 'confirmado', 'en_curso', 'completado', 'cancelado', 'no_asistio')),
    observaciones TEXT,
    observaciones_medicas TEXT,
    precio DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (odontologo_id) REFERENCES odontologos(id) ON DELETE SET NULL,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE RESTRICT,
    UNIQUE (fecha, hora, odontologo_id)
);

-- Tabla de historial médico
CREATE TABLE historial_medico (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    turno_id INTEGER,
    diagnostico TEXT,
    tratamiento TEXT,
    medicamentos TEXT,
    proxima_cita DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE SET NULL
);

-- Tabla de horarios de atención
CREATE TABLE horarios_atencion (
    id SERIAL PRIMARY KEY,
    odontologo_id INTEGER NOT NULL,
    dia_semana VARCHAR(10) CHECK (dia_semana IN ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')),
    hora_inicio TIME,
    hora_fin TIME,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (odontologo_id) REFERENCES odontologos(id) ON DELETE CASCADE
);

-- Tabla de notificaciones
CREATE TABLE notificaciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    tipo VARCHAR(20) DEFAULT 'sistema' CHECK (tipo IN ('nuevo_turno', 'turno_confirmado', 'turno_cancelado', 'turno_pospuesto', 'recordatorio', 'promocion', 'sistema')),
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    turno_id INTEGER NULL,
    leida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE SET NULL
);

-- =====================================================
-- INSERCIÓN DE DATOS INICIALES
-- =====================================================

-- Insertar odontólogos
INSERT INTO odontologos (nombre, especialidad, matricula, telefono, email) VALUES 
('Dr. Juan Pérez', 'Odontología General', 'MP001', '123-456-7890', 'juan.perez@sonrisitapp.com'),
('Dra. María González', 'Ortodoncia', 'MP002', '123-456-7891', 'maria.gonzalez@sonrisitapp.com'),
('Dr. Carlos Rodríguez', 'Endodoncia', 'MP003', '123-456-7892', 'carlos.rodriguez@sonrisitapp.com');

-- Insertar servicios
INSERT INTO servicios (nombre, descripcion, duracion_minutos, precio) VALUES 
('Limpieza dental', 'Limpieza profunda y pulido dental', 45, 2500.00),
('Control general', 'Revisión completa y diagnóstico', 30, 1500.00),
('Ortodoncia', 'Consulta y seguimiento ortodóntico', 60, 3500.00),
('Endodoncia', 'Tratamiento de conducto', 90, 8000.00),
('Emergencia', 'Atención de urgencias dentales', 30, 2000.00),
('Extracción', 'Extracción dental simple', 45, 3000.00),
('Blanqueamiento', 'Blanqueamiento dental profesional', 60, 5000.00);

-- Insertar horarios de atención
INSERT INTO horarios_atencion (odontologo_id, dia_semana, hora_inicio, hora_fin) VALUES 
(1, 'lunes', '09:00:00', '17:00:00'),
(1, 'martes', '09:00:00', '17:00:00'),
(1, 'miercoles', '09:00:00', '17:00:00'),
(1, 'jueves', '09:00:00', '17:00:00'),
(1, 'viernes', '09:00:00', '15:00:00'),
(2, 'lunes', '14:00:00', '20:00:00'),
(2, 'martes', '14:00:00', '20:00:00'),
(2, 'miercoles', '14:00:00', '20:00:00'),
(2, 'jueves', '14:00:00', '20:00:00'),
(2, 'viernes', '14:00:00', '18:00:00'),
(3, 'martes', '08:00:00', '16:00:00'),
(3, 'jueves', '08:00:00', '16:00:00'),
(3, 'sabado', '09:00:00', '13:00:00');

-- Insertar usuario administrador (password: 'password')
INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES 
('Administrador', 'admin@sonrisitapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '123-456-7890');

-- Insertar usuario Francesco (admin adicional)
INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES 
('Francesco', 'francesco@sonrisitapp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '123-456-7899');

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (nombre, email, password, telefono, fecha_nacimiento, direccion) VALUES 
('Ana García', 'ana.garcia@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123-456-7891', '1990-05-15', 'Av. Principal 123'),
('Luis Martínez', 'luis.martinez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123-456-7892', '1985-08-22', 'Calle Secundaria 456'),
('Carmen López', 'carmen.lopez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123-456-7893', '1992-12-03', 'Plaza Central 789'),
('Roberto Silva', 'roberto.silva@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123-456-7894', '1988-03-18', 'Barrio Norte 321');

-- Insertar turnos de ejemplo
INSERT INTO turnos (usuario_id, odontologo_id, servicio_id, fecha, hora, estado, observaciones) VALUES 
(2, 1, 1, CURRENT_DATE, '09:00:00', 'reservado', 'Limpieza de rutina'),
(3, 1, 2, CURRENT_DATE, '10:00:00', 'confirmado', 'Control general'),
(4, 2, 3, CURRENT_DATE + INTERVAL '1 day', '14:00:00', 'reservado', 'Primera consulta ortodóntica'),
(5, 1, 1, CURRENT_DATE + INTERVAL '1 day', '09:30:00', 'reservado', 'Limpieza de rutina'),
(2, 3, 4, CURRENT_DATE + INTERVAL '2 days', '08:00:00', 'confirmado', 'Endodoncia molar superior'),
(3, 1, 5, CURRENT_DATE + INTERVAL '2 days', '11:00:00', 'reservado', 'Dolor en muela del juicio'),
(4, 2, 3, CURRENT_DATE + INTERVAL '3 days', '15:00:00', 'completado', 'Seguimiento ortodóntico'),
(5, 1, 6, CURRENT_DATE + INTERVAL '3 days', '10:00:00', 'completado', 'Extracción realizada');

-- Insertar notificaciones de ejemplo
INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, turno_id) VALUES 
(2, 'recordatorio', 'Recordatorio de Turno', 'Tienes un turno mañana a las 09:00 para Limpieza dental', 1),
(3, 'turno_confirmado', 'Turno Confirmado', 'Tu turno ha sido confirmado para hoy a las 10:00', 2),
(4, 'nuevo_turno', 'Nuevo Turno Reservado', 'Has reservado un turno para Ortodoncia', 3),
(5, 'promocion', 'Promoción Especial', 'Descuento del 20% en blanqueamientos dentales este mes', NULL);