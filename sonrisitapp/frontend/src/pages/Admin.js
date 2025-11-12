import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DatabaseTest from '../components/DatabaseTest';
import NotificationBell from '../components/NotificationBell';
import NotificationTest from '../components/NotificationTest';

const Admin = ({ user, setUser }) => {
    const [turnos, setTurnos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloading, setReloading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [turnoFilter, setTurnoFilter] = useState('todos');
    const [sortBy, setSortBy] = useState('fecha');
    const [sortOrder, setSortOrder] = useState('asc');
    const [modalTurno, setModalTurno] = useState(null);
    const [accionTurno, setAccionTurno] = useState('');
    const [justificacion, setJustificacion] = useState('');
    const [nuevaFecha, setNuevaFecha] = useState('');
    const [nuevaHora, setNuevaHora] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.rol === 'admin') {
            cargarDatos();
        }
    }, [user]);

    const cargarDatos = async (esRecarga = false) => {
        try {
            console.log('ADMIN: Cargando datos...');
            setError(''); // Limpiar errores previos
            
            if (esRecarga) {
                setReloading(true);
            }
            
            const [turnosData, usuariosData] = await Promise.all([
                api.listarTurnos(),
                api.obtenerUsuarios()
            ]);
            
            console.log('ADMIN: Turnos cargados:', turnosData.length);
            console.log('ADMIN: Usuarios cargados:', usuariosData.length);
            console.log('ADMIN: Primer turno:', turnosData[0]);
            console.log('ADMIN: Primer usuario:', usuariosData[0]);
            
            // Verificar origen de los datos
            const origenTurnos = turnosData._source || 'desconocido';
            const origenUsuarios = usuariosData._source || 'desconocido';
            console.log('ADMIN: Origen turnos:', origenTurnos);
            console.log('ADMIN: Origen usuarios:', origenUsuarios);
            
            // Asegurar que los datos sean arrays válidos
            const turnosValidos = Array.isArray(turnosData) ? turnosData : [];
            const usuariosValidos = Array.isArray(usuariosData) ? usuariosData : [];
            
            setTurnos(turnosValidos);
            setUsuarios(usuariosValidos);
            setFilteredUsuarios(usuariosValidos);
            
            console.log('ADMIN: Turnos en estado:', turnosValidos);
            console.log('ADMIN: Usuarios en estado:', usuariosValidos);
            
            console.log('ADMIN: Datos cargados exitosamente');
            
        } catch (error) {
            console.error('ADMIN: Error al cargar datos:', error);
            setError('Error al cargar datos: ' + error.message);
            
            // En caso de error, mantener datos existentes si los hay
            if (turnos.length === 0 && usuarios.length === 0) {
                setTurnos([]);
                setUsuarios([]);
                setFilteredUsuarios([]);
            }
        } finally {
            setLoading(false);
            setReloading(false);
        }
    };

    const cambiarEstadoTurno = async (id, nuevoEstado) => {
        try {
            console.log(`ADMIN: Cambiando estado del turno ${id} a ${nuevoEstado}`);
            await api.modificarTurno(id, { estado: nuevoEstado });
            console.log('ADMIN: Estado cambiado exitosamente, recargando datos...');
            
            // Mostrar mensaje de éxito
            setSuccessMessage(`Turno ${nuevoEstado === 'completado' ? 'completado' : 'reactivado'} exitosamente`);
            setTimeout(() => setSuccessMessage(''), 3000);
            
            await cargarDatos(true); // Recarga automática con indicador
        } catch (error) {
            console.error('ADMIN: Error al modificar turno:', error);
            setError('Error al modificar turno: ' + error.message);
        }
    };

    const abrirModalTurno = (turno, accion) => {
        setModalTurno(turno);
        setAccionTurno(accion);
        setJustificacion('');
        setNuevaFecha(turno.fecha);
        setNuevaHora(turno.hora);
    };

    const cerrarModal = () => {
        setModalTurno(null);
        setAccionTurno('');
        setJustificacion('');
        setNuevaFecha('');
        setNuevaHora('');
    };

    const ejecutarAccionTurno = async () => {
        if (!modalTurno) return;
        
        try {
            console.log(`ADMIN: Ejecutando acción '${accionTurno}' en turno ${modalTurno.id}`);
            
            switch (accionTurno) {
                case 'eliminar':
                    await api.eliminarTurno(modalTurno.id, justificacion);
                    console.log('ADMIN: Turno eliminado exitosamente');
                    break;
                case 'cancelar':
                    await api.modificarTurno(modalTurno.id, { 
                        estado: 'cancelado', 
                        observaciones: `Cancelado por admin: ${justificacion}` 
                    });
                    console.log('ADMIN: Turno cancelado exitosamente');
                    break;
                case 'posponer':
                    await api.modificarTurno(modalTurno.id, { 
                        fecha: nuevaFecha,
                        hora: nuevaHora,
                        observaciones: `Pospuesto por admin: ${justificacion}` 
                    });
                    console.log('ADMIN: Turno pospuesto exitosamente');
                    break;
            }
            
            cerrarModal();
            
            // Mostrar mensaje de éxito
            const mensajes = {
                'eliminar': 'Turno eliminado exitosamente',
                'cancelar': 'Turno cancelado exitosamente', 
                'posponer': 'Turno pospuesto exitosamente'
            };
            setSuccessMessage(mensajes[accionTurno]);
            setTimeout(() => setSuccessMessage(''), 3000);
            
            console.log('ADMIN: Recargando datos después de la acción...');
            await cargarDatos(true); // Recarga automática con indicador
            
        } catch (error) {
            console.error(`ADMIN: Error al ${accionTurno} turno:`, error);
            setError(`Error al ${accionTurno} turno: ${error.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const getEstadisticas = () => {
        const hoy = new Date().toISOString().split('T')[0];
        const semanaAtras = new Date();
        semanaAtras.setDate(semanaAtras.getDate() - 7);
        const mesAtras = new Date();
        mesAtras.setMonth(mesAtras.getMonth() - 1);
        
        // Estadísticas de turnos
        const turnosHoy = turnos.filter(t => t.fecha === hoy).length;
        const turnosPendientes = turnos.filter(t => t.estado === 'reservado').length;
        const turnosCompletados = turnos.filter(t => t.estado === 'completado').length;
        const turnosCancelados = turnos.filter(t => t.estado === 'cancelado').length;
        const turnosSemana = turnos.filter(t => {
            const fechaTurno = new Date(t.fecha);
            return fechaTurno >= semanaAtras;
        }).length;
        
        // Estadísticas de usuarios
        const totalUsuarios = usuarios.length;
        const usuariosNuevosMes = usuarios.filter(u => {
            if (!u.created_at) return false;
            const fechaCreacion = new Date(u.created_at);
            return fechaCreacion >= mesAtras;
        }).length;
        const usuariosActivos = usuarios.filter(u => {
            return turnos.some(t => t.usuario_id === u.id && t.estado === 'reservado');
        }).length;
        
        // Servicios más solicitados
        const serviciosCount = {};
        turnos.forEach(t => {
            if (t.servicio) {
                serviciosCount[t.servicio] = (serviciosCount[t.servicio] || 0) + 1;
            }
        });
        const servicioMasPopular = Object.keys(serviciosCount).reduce((a, b) => 
            serviciosCount[a] > serviciosCount[b] ? a : b, 'N/A'
        );
        
        return { 
            turnosHoy, 
            turnosPendientes, 
            turnosCompletados,
            turnosCancelados,
            turnosSemana,
            usuariosNuevosMes, 
            totalUsuarios,
            usuariosActivos,
            servicioMasPopular
        };
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term.trim()) {
            setFilteredUsuarios(usuarios);
        } else {
            const filtered = usuarios.filter(usuario => 
                usuario.nombre.toLowerCase().includes(term.toLowerCase()) ||
                usuario.email.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredUsuarios(filtered);
        }
    };

    const getNombreUsuario = (usuarioId) => {
        const usuario = usuarios.find(u => u.id === usuarioId);
        return usuario ? usuario.nombre : `Usuario ${usuarioId}`;
    };

    const getFilteredAndSortedTurnos = () => {
        let filtered = turnos.filter(turno => {
            if (turnoFilter === 'todos') return true;
            return turno.estado === turnoFilter;
        });

        return filtered.sort((a, b) => {
            let aVal, bVal;
            
            switch (sortBy) {
                case 'fecha':
                    aVal = new Date(a.fecha + ' ' + a.hora);
                    bVal = new Date(b.fecha + ' ' + b.hora);
                    break;
                case 'usuario':
                    aVal = getNombreUsuario(a.usuario_id).toLowerCase();
                    bVal = getNombreUsuario(b.usuario_id).toLowerCase();
                    break;
                case 'estado':
                    aVal = a.estado || '';
                    bVal = b.estado || '';
                    break;
                default:
                    aVal = a[sortBy] || '';
                    bVal = b[sortBy] || '';
            }
            
            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const formatDate = (fecha) => {
        if (!fecha) return 'N/A';
        try {
            return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return fecha;
        }
    };

    const formatTime = (hora) => {
        if (!hora) return 'N/A';
        return hora.substring(0, 5);
    };

    const getEstadoColor = (estado) => {
        const colors = {
            'reservado': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            'confirmado': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
            'completado': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
            'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        };
        return colors[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300';
    };

    const getEstadoIcon = (estado) => {
        const icons = {
            'reservado': 'schedule',
            'confirmado': 'check_circle',
            'completado': 'task_alt',
            'cancelado': 'cancel'
        };
        return icons[estado] || 'help';
    };

    if (user?.rol !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">block</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Acceso Denegado</h2>
                    <p className="text-gray-600 dark:text-gray-400">No tienes permisos para acceder a esta página.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando panel de administración...</p>
                </div>
            </div>
        );
    }

    const stats = getEstadisticas();

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 h-16">
                    <div className="text-primary size-7">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold tracking-[-0.015em] text-gray-900 dark:text-white">Sonrisitapp</h2>
                </div>
                
                <div className="flex-grow p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-3 items-center">
                            <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center text-primary font-bold">
                                {user?.nombre?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-base font-medium text-gray-900 dark:text-white">{user?.nombre}</h1>
                                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Administrador</p>
                            </div>
                        </div>
                        
                        <nav className="flex flex-col gap-2 mt-4">
                            <button 
                                onClick={() => setActiveSection('dashboard')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                                    activeSection === 'dashboard' 
                                        ? 'bg-primary/20 text-primary' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <span className={`material-symbols-outlined ${activeSection === 'dashboard' ? 'fill' : ''}`}>dashboard</span>
                                <p className="text-sm font-medium">Dashboard</p>
                            </button>
                            
                            <button 
                                onClick={() => setActiveSection('turnos')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                                    activeSection === 'turnos' 
                                        ? 'bg-primary/20 text-primary' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <span className="material-symbols-outlined">calendar_month</span>
                                <p className="text-sm font-medium">Turnos</p>
                            </button>
                            
                            <button 
                                onClick={() => setActiveSection('usuarios')}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                                    activeSection === 'usuarios' 
                                        ? 'bg-primary/20 text-primary' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                <span className="material-symbols-outlined">group</span>
                                <p className="text-sm font-medium">Usuarios</p>
                            </button>
                        </nav>
                    </div>
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <p className="text-sm font-medium">Cerrar Sesión</p>
                    </button>
                </div>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="flex items-center justify-end whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-6 h-16 bg-white dark:bg-gray-900/50">
                    <div className="flex items-center gap-4">
                        <NotificationBell user={user} />
                        <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center text-primary font-bold">
                            {user?.nombre?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>
                </header>
                
                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Indicador de origen de datos */}
                        {(turnos._source === 'ejemplo' || usuarios._source === 'ejemplo') && (
                            <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-600">warning</span>
                                    <div>
                                        <strong>Usando datos de ejemplo</strong> - MySQL no está conectado.
                                        <button 
                                            onClick={() => cargarDatos(true)}
                                            className="ml-2 text-yellow-700 hover:text-yellow-900 underline text-sm"
                                        >
                                            Reintentar conexión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {(turnos._source === 'mysql' && usuarios._source === 'mysql') && (
                            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                                    <strong>Conectado a MySQL</strong> - Mostrando datos reales de la base de datos.
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-500">error</span>
                                    {error}
                                </div>
                            </div>
                        )}
                        
                        {successMessage && (
                            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                    {successMessage}
                                </div>
                            </div>
                        )}
                        
                        {reloading && (
                            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-500 animate-spin">sync</span>
                                    Actualizando datos...
                                </div>
                            </div>
                        )}
                        
                        {activeSection === 'dashboard' && (
                            <>
                                {/* Page Heading */}
                                <div className="flex flex-wrap justify-between gap-3 mb-6">
                                    <div className="flex min-w-72 flex-col gap-1">
                                        <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">Dashboard</p>
                                        <p className="text-base font-normal text-gray-500 dark:text-gray-400">Resumen general del estado de la clínica.</p>
                                    </div>
                                </div>
                                
                                {/* Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-medium text-gray-600 dark:text-gray-300">Turnos Hoy</p>
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">today</span>
                                        </div>
                                        <p className="tracking-tight text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{stats.turnosHoy}</p>
                                        <p className="text-sm font-medium text-green-600 dark:text-green-500">Programados hoy</p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-medium text-gray-600 dark:text-gray-300">Pendientes</p>
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">pending</span>
                                        </div>
                                        <p className="tracking-tight text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{stats.turnosPendientes}</p>
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-500">Por confirmar</p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-medium text-gray-600 dark:text-gray-300">Completados</p>
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">check_circle</span>
                                        </div>
                                        <p className="tracking-tight text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{stats.turnosCompletados}</p>
                                        <p className="text-sm font-medium text-green-600 dark:text-green-500">Finalizados</p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-medium text-gray-600 dark:text-gray-300">Total Usuarios</p>
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">group</span>
                                        </div>
                                        <p className="tracking-tight text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{stats.totalUsuarios}</p>
                                        <p className="text-sm font-medium text-purple-600 dark:text-purple-500">Registrados</p>
                                    </div>
                                </div>
                                
                                {/* Estadísticas adicionales */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen Semanal</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Turnos esta semana:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{stats.turnosSemana}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Usuarios activos:</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{stats.usuariosActivos}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Nuevos usuarios (mes):</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{stats.usuariosNuevosMes}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estado de Turnos</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Reservados:</span>
                                                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">{stats.turnosPendientes}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Completados:</span>
                                                <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded-full">{stats.turnosCompletados}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Cancelados:</span>
                                                <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 rounded-full">{stats.turnosCancelados}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <span className="text-gray-600 dark:text-gray-400">Servicio más popular:</span>
                                                <span className="font-semibold text-primary">{stats.servicioMasPopular}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Test de conexión MySQL */}
                                <div className="mb-8">
                                    <DatabaseTest />
                                </div>
                                
                                {/* Test de notificaciones */}
                                <div className="mb-8">
                                    <NotificationTest user={user} />
                                </div>
                            </>
                        )}
                        
                        {activeSection === 'usuarios' && (
                            <>
                                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">Gestión de Usuarios</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Total: {usuarios.length} usuarios registrados
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                                            <span className="material-symbols-outlined text-sm mr-1">group</span>
                                            {filteredUsuarios.length} {searchTerm ? 'encontrados' : 'usuarios'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                    <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b border-gray-200 dark:border-gray-800">
                                        <div className="relative w-full md:w-auto md:flex-1">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                            <input 
                                                className="w-full md:max-w-xs pl-10 pr-4 py-2 text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary/50 transition-all duration-200" 
                                                placeholder="Buscar por nombre, email..." 
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => handleSearch(e.target.value)}
                                            />
                                        </div>
                                        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark">
                                            <span className="material-symbols-outlined text-base">add</span>
                                            Agregar Usuario
                                        </button>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-900">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">#</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">ID</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Usuario</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Email</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Rol</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Registro</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right" scope="col">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                                {filteredUsuarios.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <span className="material-symbols-outlined text-4xl">person_off</span>
                                                                <p>{searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}</p>
                                                                {searchTerm && (
                                                                    <button 
                                                                        onClick={() => handleSearch('')}
                                                                        className="mt-2 text-primary hover:text-primary/80 text-sm font-medium"
                                                                    >
                                                                        Limpiar búsqueda
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredUsuarios.map((usuario, index) => {
                                                        const numeroFila = usuarios.findIndex(u => u.id === usuario.id) + 1;
                                                        return (
                                                            <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200" style={{animationDelay: `${index * 50}ms`}}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                    #{numeroFila}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600 dark:text-gray-300">
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                                                                        <span className="material-symbols-outlined text-xs text-gray-400">tag</span>
                                                                        {usuario.id}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="bg-primary/20 rounded-full size-8 flex items-center justify-center text-primary font-bold text-xs">
                                                                            {usuario.nombre.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <span className="font-medium text-gray-900 dark:text-white">{usuario.nombre}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="material-symbols-outlined text-xs text-gray-400">email</span>
                                                                        {usuario.email}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                                                                        usuario.rol === 'admin' 
                                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                                                    }`}>
                                                                        <span className="material-symbols-outlined text-xs">
                                                                            {usuario.rol === 'admin' ? 'admin_panel_settings' : 'person'}
                                                                        </span>
                                                                        {usuario.rol === 'admin' ? 'Administrador' : 'Paciente'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="material-symbols-outlined text-xs text-gray-400">calendar_today</span>
                                                                        {usuario.created_at ? new Date(usuario.created_at).toLocaleDateString('es-ES') : 'N/A'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    <div className="flex justify-end gap-1">
                                                                        <button className="p-2 text-gray-500 hover:text-primary dark:hover:text-primary transition-all duration-200 transform hover:scale-110 hover:bg-primary/10 rounded-lg" title="Editar usuario">
                                                                            <span className="material-symbols-outlined text-sm">edit</span>
                                                                        </button>
                                                                        <button className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-all duration-200 transform hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg" title="Eliminar usuario">
                                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                                        </button>
                                                                        <button className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-200 transform hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg" title="Ver turnos">
                                                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {activeSection === 'turnos' && (
                            <>
                                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                                    <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">Gestión de Turnos</h2>
                                    <button 
                                        onClick={() => cargarDatos(true)}
                                        disabled={reloading}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        title="Recargar lista de turnos"
                                    >
                                        <span className={`material-symbols-outlined text-base ${reloading ? 'animate-spin' : ''}`}>
                                            {reloading ? 'sync' : 'refresh'}
                                        </span>
                                        {reloading ? 'Recargando...' : 'Recargar'}
                                    </button>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                    {/* Filtros y controles */}
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                        <div className="flex flex-wrap gap-4 items-center justify-between">
                                            <div className="flex flex-wrap gap-3 items-center">
                                                <select 
                                                    value={turnoFilter}
                                                    onChange={(e) => setTurnoFilter(e.target.value)}
                                                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="todos">Todos los estados</option>
                                                    <option value="reservado">Reservados</option>
                                                    <option value="confirmado">Confirmados</option>
                                                    <option value="completado">Completados</option>
                                                    <option value="cancelado">Cancelados</option>
                                                </select>
                                                
                                                <select 
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value)}
                                                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="fecha">Ordenar por fecha</option>
                                                    <option value="usuario">Ordenar por usuario</option>
                                                    <option value="estado">Ordenar por estado</option>
                                                </select>
                                                
                                                <button
                                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                                    className="p-2 text-gray-500 hover:text-primary border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    title={`Orden ${sortOrder === 'asc' ? 'ascendente' : 'descendente'}`}
                                                >
                                                    <span className="material-symbols-outlined text-sm">
                                                        {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                                                    </span>
                                                </button>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {getFilteredAndSortedTurnos().length} turnos
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-900">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usuario</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hora</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Servicio</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                                {getFilteredAndSortedTurnos().length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <span className="material-symbols-outlined text-4xl">event_busy</span>
                                                                <p>{turnoFilter === 'todos' ? 'No hay turnos registrados' : `No hay turnos ${turnoFilter}`}</p>
                                                                <button 
                                                                    onClick={() => cargarDatos(true)}
                                                                    className="mt-2 text-primary hover:text-primary/80 text-sm font-medium"
                                                                >
                                                                    Recargar datos
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    getFilteredAndSortedTurnos().map((turno, index) => {
                                                        const turnoId = turno.id && !isNaN(turno.id) ? turno.id : (index + 1);
                                                        const nombreUsuario = getNombreUsuario(turno.usuario_id);
                                                        
                                                        return (
                                                            <tr key={turno.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    <span className="inline-flex items-center gap-1">
                                                                        <span className="material-symbols-outlined text-xs text-gray-400">tag</span>
                                                                        #{turnoId}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="bg-primary/20 rounded-full size-8 flex items-center justify-center text-primary font-bold text-xs">
                                                                            {nombreUsuario.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-gray-900 dark:text-white font-medium">
                                                                                {nombreUsuario}
                                                                            </span>
                                                                            {turno.usuario_id && (
                                                                                <span className="text-xs text-gray-500">ID: {turno.usuario_id}</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="material-symbols-outlined text-xs text-gray-400">calendar_today</span>
                                                                        {formatDate(turno.fecha)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                                                    <div className="flex items-center gap-1 font-mono">
                                                                        <span className="material-symbols-outlined text-xs text-gray-400">schedule</span>
                                                                        {formatTime(turno.hora)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                                                                        <span className="material-symbols-outlined text-xs">medical_services</span>
                                                                        {turno.servicio || 'No especificado'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(turno.estado)}`}>
                                                                        <span className="material-symbols-outlined text-xs">
                                                                            {getEstadoIcon(turno.estado)}
                                                                        </span>
                                                                        {turno.estado || 'Desconocido'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    <div className="flex justify-end gap-1">
                                                                        {(turno.estado === 'reservado' || turno.estado === 'confirmado') && (
                                                                            <>
                                                                                <button 
                                                                                    onClick={() => cambiarEstadoTurno(turnoId, 'completado')}
                                                                                    className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    title="Completar turno"
                                                                                    disabled={reloading}
                                                                                >
                                                                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => abrirModalTurno(turno, 'posponer')}
                                                                                    className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    title="Posponer turno"
                                                                                    disabled={reloading}
                                                                                >
                                                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => abrirModalTurno(turno, 'cancelar')}
                                                                                    className="p-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    title="Cancelar con justificación"
                                                                                    disabled={reloading}
                                                                                >
                                                                                    <span className="material-symbols-outlined text-sm">cancel</span>
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => abrirModalTurno(turno, 'eliminar')}
                                                                                    className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    title="Eliminar turno"
                                                                                    disabled={reloading}
                                                                                >
                                                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                        {turno.estado === 'cancelado' && (
                                                                            <>
                                                                                <button 
                                                                                    onClick={() => cambiarEstadoTurno(turnoId, 'reservado')}
                                                                                    className="p-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    title="Reactivar turno"
                                                                                    disabled={reloading}
                                                                                >
                                                                                    <span className="material-symbols-outlined text-sm">refresh</span>
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => abrirModalTurno(turno, 'eliminar')}
                                                                                    className="p-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    title="Eliminar turno"
                                                                                    disabled={reloading}
                                                                                >
                                                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                        {turno.estado === 'completado' && (
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                                                                                    Finalizado
                                                                                </span>
                                                                                <button 
                                                                                    onClick={() => abrirModalTurno(turno, 'eliminar')}
                                                                                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all duration-200"
                                                                                    title="Eliminar turno"
                                                                                    disabled={reloading}
                                                                                >
                                                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                {/* Modal para acciones de turno */}
                                {modalTurno && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                                {accionTurno === 'eliminar' && 'Eliminar Turno'}
                                                {accionTurno === 'cancelar' && 'Cancelar Turno'}
                                                {accionTurno === 'posponer' && 'Posponer Turno'}
                                            </h3>
                                            
                                            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <strong>Turno:</strong> {getNombreUsuario(modalTurno.usuario_id)}<br/>
                                                    <strong>Fecha:</strong> {new Date(modalTurno.fecha).toLocaleDateString('es-ES')}<br/>
                                                    <strong>Hora:</strong> {modalTurno.hora}<br/>
                                                    <strong>Servicio:</strong> {modalTurno.servicio}
                                                </p>
                                            </div>
                                            
                                            {accionTurno === 'posponer' && (
                                                <div className="mb-4 space-y-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Nueva Fecha
                                                        </label>
                                                        <input 
                                                            type="date" 
                                                            value={nuevaFecha}
                                                            onChange={(e) => setNuevaFecha(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Nueva Hora
                                                        </label>
                                                        <input 
                                                            type="time" 
                                                            value={nuevaHora}
                                                            onChange={(e) => setNuevaHora(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {accionTurno === 'eliminar' ? 'Motivo de eliminación' : 
                                                     accionTurno === 'cancelar' ? 'Motivo de cancelación' : 
                                                     'Motivo de postergación'} *
                                                </label>
                                                <textarea 
                                                    value={justificacion}
                                                    onChange={(e) => setJustificacion(e.target.value)}
                                                    placeholder="Ingrese el motivo..."
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                                    rows="3"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="flex gap-3 justify-end">
                                                <button 
                                                    onClick={cerrarModal}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    onClick={ejecutarAccionTurno}
                                                    disabled={!justificacion.trim() || (accionTurno === 'posponer' && (!nuevaFecha || !nuevaHora))}
                                                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                                        accionTurno === 'eliminar' ? 'bg-red-600 hover:bg-red-700' :
                                                        accionTurno === 'cancelar' ? 'bg-yellow-600 hover:bg-yellow-700' :
                                                        'bg-blue-600 hover:bg-blue-700'
                                                    }`}
                                                >
                                                    {accionTurno === 'eliminar' && 'Eliminar'}
                                                    {accionTurno === 'cancelar' && 'Cancelar'}
                                                    {accionTurno === 'posponer' && 'Posponer'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Admin;