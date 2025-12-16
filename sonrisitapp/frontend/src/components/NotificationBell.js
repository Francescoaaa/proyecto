// Autor: Francesco - https://github.com/Francescoaaa
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const NotificationBell = ({ user }) => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [noLeidas, setNoLeidas] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            cargarNotificaciones();
            cargarContador();
            
            // Actualizar cada 30 segundos
            const interval = setInterval(() => {
                cargarContador();
            }, 30000);
            
            return () => clearInterval(interval);
        }
    }, [user]);

    const cargarNotificaciones = async () => {
        try {
            setLoading(true);
            const data = await api.obtenerNotificaciones(user.id);
            setNotificaciones(data);
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarContador = async () => {
        try {
            const data = await api.contarNotificacionesNoLeidas(user.id);
            setNoLeidas(data.count);
        } catch (error) {
            console.error('Error al contar notificaciones:', error);
        }
    };

    const marcarComoLeida = async (id) => {
        try {
            await api.marcarNotificacionLeida(id);
            setNotificaciones(prev => 
                prev.map(n => n.id === id ? { ...n, leida: true } : n)
            );
            setNoLeidas(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error al marcar notificación:', error);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            cargarNotificaciones();
        }
    };

    const formatearFecha = (fecha) => {
        const ahora = new Date();
        const fechaNotif = new Date(fecha);
        const diffMs = ahora - fechaNotif;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHoras = Math.floor(diffMins / 60);
        const diffDias = Math.floor(diffHoras / 24);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHoras < 24) return `${diffHoras}h`;
        if (diffDias < 7) return `${diffDias}d`;
        return fechaNotif.toLocaleDateString('es-ES');
    };

    const getIconoTipo = (tipo) => {
        const iconos = {
            'nuevo_turno': 'event_available',
            'turno_cancelado': 'event_busy',
            'turno_pospuesto': 'schedule',
            'turno_eliminado': 'delete'
        };
        return iconos[tipo] || 'notifications';
    };

    const getColorTipo = (tipo) => {
        const colores = {
            'nuevo_turno': 'text-green-600',
            'turno_cancelado': 'text-red-600',
            'turno_pospuesto': 'text-blue-600',
            'turno_eliminado': 'text-gray-600'
        };
        return colores[tipo] || 'text-gray-600';
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {noLeidas > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {noLeidas > 99 ? '99+' : noLeidas}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                        {noLeidas > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{noLeidas} sin leer</p>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                            </div>
                        ) : notificaciones.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                                <p>No hay notificaciones</p>
                            </div>
                        ) : (
                            notificaciones.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                                        !notif.leida ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                    onClick={() => !notif.leida && marcarComoLeida(notif.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={`material-symbols-outlined text-lg ${getColorTipo(notif.tipo)}`}>
                                            {getIconoTipo(notif.tipo)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${!notif.leida ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {notif.titulo}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {notif.mensaje}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                                {formatearFecha(notif.created_at)}
                                            </p>
                                        </div>
                                        {!notif.leida && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notificaciones.length > 0 && (
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium"
                            >
                                Ver todas las notificaciones
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </div>
    );
};

export default NotificationBell;