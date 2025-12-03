-- Script para limpiar todos los datos de SonrisitApp
USE sonrisitapp;

-- Deshabilitar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar todas las tablas
DELETE FROM historial_medico;
DELETE FROM turnos;
DELETE FROM horarios_atencion;
DELETE FROM usuarios;
DELETE FROM odontologos;
DELETE FROM servicios;

-- Reiniciar los AUTO_INCREMENT
ALTER TABLE historial_medico AUTO_INCREMENT = 1;
ALTER TABLE turnos AUTO_INCREMENT = 1;
ALTER TABLE horarios_atencion AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;
ALTER TABLE odontologos AUTO_INCREMENT = 1;
ALTER TABLE servicios AUTO_INCREMENT = 1;

-- Rehabilitar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Base de datos limpiada exitosamente' as mensaje;