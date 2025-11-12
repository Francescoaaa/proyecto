import React, { useState } from 'react';
import api from '../services/api';

const NotificationTest = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const testNotifications = async () => {
        if (!user?.id) {
            setMessage('❌ Usuario no autenticado');
            return;
        }

        setLoading(true);
        setMessage('🔄 Probando sistema de notificaciones...');

        try {
            // Test 1: Obtener notificaciones
            console.log('TEST: Obteniendo notificaciones...');
            const notificaciones = await api.obtenerNotificaciones(user.id);
            console.log('TEST: Notificaciones obtenidas:', notificaciones);

            // Test 2: Contar no leídas
            console.log('TEST: Contando notificaciones no leídas...');
            const contador = await api.contarNotificacionesNoLeidas(user.id);
            console.log('TEST: Contador obtenido:', contador);

            // Test 3: Crear turno de prueba (genera notificación)
            if (user.rol !== 'admin') {
                console.log('TEST: Creando turno de prueba...');
                const turnoTest = {
                    usuario_id: user.id,
                    fecha: '2025-01-25',
                    hora: '10:00:00',
                    servicio: 'Test de notificaciones',
                    observaciones: 'Turno creado para probar notificaciones'
                };
                
                const resultado = await api.crearTurno(turnoTest);
                console.log('TEST: Turno creado:', resultado);
            }

            setMessage(`✅ Sistema funcionando correctamente
📧 Notificaciones: ${notificaciones.length}
🔔 No leídas: ${contador.count}
${user.rol !== 'admin' ? '📝 Turno de prueba creado' : '👨‍⚕️ Modo admin detectado'}`);

        } catch (error) {
            console.error('TEST: Error en pruebas:', error);
            setMessage(`❌ Error en las pruebas: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🧪 Test de Notificaciones
            </h3>
            
            <div className="space-y-4">
                <button
                    onClick={testNotifications}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? '🔄 Ejecutando pruebas...' : '▶️ Ejecutar Test Completo'}
                </button>

                {message && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap text-gray-900 dark:text-white">
                            {message}
                        </pre>
                    </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p><strong>Pruebas incluidas:</strong></p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Obtener notificaciones del usuario</li>
                        <li>Contar notificaciones no leídas</li>
                        <li>Crear turno de prueba (genera notificación)</li>
                        <li>Verificar conexión con backend</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NotificationTest;