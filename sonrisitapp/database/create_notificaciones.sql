-- Crear tabla de notificaciones para SonrisitApp
-- Ejecutar este archivo en phpMyAdmin o línea de comandos

USE sonrisitapp;

CREATE TABLE IF NOT EXISTS notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('turno_cancelado', 'turno_pospuesto', 'turno_eliminado', 'nuevo_turno') NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    turno_id INT NULL,
    leida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE SET NULL
);

-- Verificar que la tabla se creó correctamente
DESCRIBE notificaciones;