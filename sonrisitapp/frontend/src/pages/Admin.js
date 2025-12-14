import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import NotificationBell from '../components/NotificationBell';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';

const Admin = ({ user, setUser }) => {
    const [turnos, setTurnos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloading, setReloading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');

    const [turnoFilter, setTurnoFilter] = useState('todos');
    const [sortBy, setSortBy] = useState('fecha');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filtroUsuario, setFiltroUsuario] = useState(null);
    const [modalTurno, setModalTurno] = useState(null);
    const [accionTurno, setAccionTurno] = useState('');
    const [justificacion, setJustificacion] = useState('');
    const [nuevaFecha, setNuevaFecha] = useState('');
    const [nuevaHora, setNuevaHora] = useState('');
    const [modalUsuario, setModalUsuario] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [modalEditarUsuario, setModalEditarUsuario] = useState(null);
    const [datosEdicion, setDatosEdicion] = useState({ nombre: '', email: '', telefono: '', rol: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.rol === 'admin') {
            cargarDatos();
        }
    }, [user]);

    const cargarDatos = async (esRecarga = false) => {
        try {
            setError('');
            
            if (esRecarga) {
                setReloading(true);
            }
            
            const [turnosData, usuariosData] = await Promise.all([
                api.listarTurnos(),
                api.obtenerUsuarios()
            ]);
            
            // Asegurar que los datos sean arrays válidos
            const turnosValidos = Array.isArray(turnosData) ? turnosData : [];
            const usuariosValidos = Array.isArray(usuariosData) ? usuariosData : [];
            
            setTurnos(turnosValidos);
            setUsuarios(usuariosValidos);

            
        } catch (error) {
            setError('Error al cargar datos: ' + error.message);
            
            // En caso de error, mantener datos existentes si los hay
            if (turnos.length === 0 && usuarios.length === 0) {
                setTurnos([]);
                setUsuarios([]);

            }
        } finally {
            setLoading(false);
            setReloading(false);
        }
    };

    const cambiarEstadoTurno = async (id, nuevoEstado) => {
        try {
            await api.modificarTurno(id, { estado: nuevoEstado });
            
            // Mostrar mensaje de éxito
            setSuccessMessage(`Turno ${nuevoEstado === 'completado' ? 'completado' : 'reactivado'} exitosamente`);
            setTimeout(() => setSuccessMessage(''), 3000);
            
            await cargarDatos(true); // Recarga automática con indicador
        } catch (error) {
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
            switch (accionTurno) {
                case 'eliminar':
                    await api.eliminarTurno(modalTurno.id, justificacion);
                    break;
                case 'cancelar':
                    await api.modificarTurno(modalTurno.id, { 
                        estado: 'cancelado', 
                        observaciones: `Cancelado por admin: ${justificacion}` 
                    });
                    break;
                case 'posponer':
                    await api.modificarTurno(modalTurno.id, { 
                        fecha: nuevaFecha,
                        hora: nuevaHora,
                        observaciones: `Pospuesto por admin: ${justificacion}` 
                    });
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
            
            await cargarDatos(true);
            
        } catch (error) {
            setError(`Error al ${accionTurno} turno: ${error.message}`);
        }
    };

    const abrirModalEliminarUsuario = (usuario) => {
        console.log('Abriendo modal para usuario:', usuario);
        console.log('Estado modalUsuario antes:', modalUsuario);
        setModalUsuario(usuario);
        setConfirmEmail('');
        console.log('Modal debería abrirse ahora');
    };

    const cerrarModalUsuario = () => {
        setModalUsuario(null);
        setConfirmEmail('');
    };

    const abrirModalEditarUsuario = (usuario) => {
        setModalEditarUsuario(usuario);
        setDatosEdicion({
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono || '',
            rol: usuario.rol
        });
    };

    const cerrarModalEditarUsuario = () => {
        setModalEditarUsuario(null);
        setDatosEdicion({ nombre: '', email: '', telefono: '', rol: '' });
    };

    const guardarCambiosUsuario = async () => {
        if (!modalEditarUsuario) return;
        
        try {
            await api.actualizarUsuario(modalEditarUsuario.id, datosEdicion);
            cerrarModalEditarUsuario();
            setSuccessMessage('Usuario actualizado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
            await cargarDatos(true);
        } catch (error) {
            setError('Error al actualizar usuario: ' + error.message);
        }
    };

    const eliminarUsuario = async () => {
        console.log('Intentando eliminar usuario:', modalUsuario);
        console.log('Email confirmación:', confirmEmail);
        console.log('Email usuario:', modalUsuario?.email);
        
        if (!modalUsuario || confirmEmail !== modalUsuario.email) {
            console.log('Email no coincide');
            setError('El email de confirmación no coincide');
            return;
        }
        
        try {
            console.log('Enviando request DELETE usando API...');
            await api.eliminarCuenta(modalUsuario.id, confirmEmail);
            
            console.log('Usuario eliminado exitosamente');
            cerrarModalUsuario();
            setSuccessMessage('Usuario eliminado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
            await cargarDatos(true);
        } catch (error) {
            console.error('Error completo:', error);
            setError('Error al eliminar usuario: ' + error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Optimizar estadísticas con useMemo
    const estadisticas = useMemo(() => {
        const hoy = new Date().toISOString().split('T')[0];
        const semanaAtras = new Date();
        semanaAtras.setDate(semanaAtras.getDate() - 7);
        const mesAtras = new Date();
        mesAtras.setMonth(mesAtras.getMonth() - 1);
        
        let turnosHoy = 0, turnosPendientes = 0, turnosCompletados = 0, turnosCancelados = 0, turnosSemana = 0;
        const serviciosCount = {};
        
        // Una sola iteración para todas las estadísticas de turnos
        turnos.forEach(t => {
            if (t.fecha === hoy) turnosHoy++;
            if (t.estado === 'reservado') turnosPendientes++;
            if (t.estado === 'completado') turnosCompletados++;
            if (t.estado === 'cancelado') turnosCancelados++;
            
            const fechaTurno = new Date(t.fecha);
            if (fechaTurno >= semanaAtras) turnosSemana++;
            
            if (t.servicio) {
                serviciosCount[t.servicio] = (serviciosCount[t.servicio] || 0) + 1;
            }
        });
        
        const totalUsuarios = usuarios.length;
        const usuariosNuevosMes = usuarios.filter(u => {
            if (!u.created_at) return false;
            const fechaCreacion = new Date(u.created_at);
            return fechaCreacion >= mesAtras;
        }).length;
        
        const usuariosActivos = usuarios.filter(u => {
            return turnos.some(t => t.usuario_id === u.id && t.estado === 'reservado');
        }).length;
        
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
    }, [turnos, usuarios]);

    // Optimizar filtrado y ordenamiento con useMemo
    const turnosFiltrados = useMemo(() => {
        let filtered = [...turnos];
        
        if (turnoFilter !== 'todos') {
            filtered = filtered.filter(t => t.estado === turnoFilter);
        }
        
        if (filtroUsuario) {
            filtered = filtered.filter(t => t.usuario_id === filtroUsuario.id);
        }
        
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'fecha':
                    comparison = new Date(a.fecha + ' ' + a.hora) - new Date(b.fecha + ' ' + b.hora);
                    break;
                case 'usuario':
                    comparison = (a.usuario_nombre || '').localeCompare(b.usuario_nombre || '');
                    break;
                case 'servicio':
                    comparison = (a.servicio || '').localeCompare(b.servicio || '');
                    break;
                case 'estado':
                    comparison = (a.estado || '').localeCompare(b.estado || '');
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        
        return filtered;
    }, [turnos, turnoFilter, sortBy, sortOrder, filtroUsuario]);

    // Optimizar filtrado de usuarios con useMemo
    const filteredUsuarios = useMemo(() => {
        if (!searchTerm.trim()) {
            return usuarios;
        }
        const term = searchTerm.toLowerCase();
        return usuarios.filter(usuario => 
            usuario.nombre.toLowerCase().includes(term) ||
            usuario.email.toLowerCase().includes(term)
        );
    }, [usuarios, searchTerm]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Optimizar búsqueda de usuarios con useMemo
    const usuariosMap = useMemo(() => {
        return usuarios.reduce((map, usuario) => {
            map[usuario.id] = usuario.nombre;
            return map;
        }, {});
    }, [usuarios]);

    const getNombreUsuario = (usuarioId) => {
        return usuariosMap[usuarioId] || `Usuario ${usuarioId}`;
    };



    const formatDate = (fecha) => {
        if (!fecha) return 'N/A';
        try {
            const date = new Date(fecha);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('es-ES', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return 'N/A';
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

    const stats = estadisticas;

    return (
        <div className="flex h-screen">
            <AdminSidebar 
                user={user} 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                handleLogout={handleLogout} 
            />
            
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
                            <AdminDashboard stats={stats} user={user} />
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
                                                                        <button 
                                                                            onClick={() => abrirModalEditarUsuario(usuario)}
                                                                            className="p-2 text-gray-500 hover:text-primary dark:hover:text-primary transition-all duration-200 transform hover:scale-110 hover:bg-primary/10 rounded-lg" 
                                                                            title="Editar usuario"
                                                                        >
                                                                            <span className="material-symbols-outlined text-sm">edit</span>
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => {
                                                                                console.log('Clic en eliminar usuario:', usuario);
                                                                                abrirModalEliminarUsuario(usuario);
                                                                            }}
                                                                            className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-all duration-200 transform hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg" 
                                                                            title="Eliminar usuario"
                                                                        >
                                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => {
                                                                                setFiltroUsuario(usuario);
                                                                                setActiveSection('turnos');
                                                                            }}
                                                                            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-200 transform hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg" 
                                                                            title="Ver turnos"
                                                                        >
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
                                    <div>
                                        <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white">
                                            {filtroUsuario ? `Turnos de ${filtroUsuario.nombre}` : 'Gestión de Turnos'}
                                        </h2>
                                        {filtroUsuario && (
                                            <button 
                                                onClick={() => setFiltroUsuario(null)}
                                                className="mt-1 text-sm text-primary hover:text-primary/80 font-medium"
                                            >
                                                ← Volver a todos los turnos
                                            </button>
                                        )}
                                    </div>
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
                                                {turnosFiltrados.length} turnos
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 dark:bg-gray-900">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paciente</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha y Hora</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Servicio</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                                {turnosFiltrados.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
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
                                                    turnosFiltrados.map((turno, index) => {
                                                        const turnoId = turno.id && !isNaN(turno.id) ? turno.id : (index + 1);
                                                        const nombreUsuario = turno.usuario_nombre || usuariosMap[turno.usuario_id] || `Usuario ${turno.usuario_id}`;
                                                        

                                                        
                                                        return (
                                                            <tr key={turno.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">#{turnoId}</span>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="bg-primary/20 rounded-full size-8 flex items-center justify-center text-primary font-bold text-xs">
                                                                            {nombreUsuario.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                            {nombreUsuario}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                                        <div className="font-medium">{formatDate(turno.fecha)}</div>
                                                                        <div className="text-gray-500 font-mono text-xs">{formatTime(turno.hora)}</div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
                                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                                                                        {turno.servicio || 'No especificado'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 whitespace-nowrap">
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
            
            {/* Modal para editar usuario */}
            {modalEditarUsuario && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Editar Usuario
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nombre
                                </label>
                                <input 
                                    type="text"
                                    value={datosEdicion.nombre}
                                    onChange={(e) => setDatosEdicion({...datosEdicion, nombre: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input 
                                    type="email"
                                    value={datosEdicion.email}
                                    onChange={(e) => setDatosEdicion({...datosEdicion, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Teléfono
                                </label>
                                <input 
                                    type="tel"
                                    value={datosEdicion.telefono}
                                    onChange={(e) => setDatosEdicion({...datosEdicion, telefono: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Rol
                                </label>
                                <select 
                                    value={datosEdicion.rol}
                                    onChange={(e) => setDatosEdicion({...datosEdicion, rol: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="usuario">Paciente</option>
                                    <option value="admin">Administrador</option>
                                    <option value="odontologo">Odontólogo</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 justify-end mt-6">
                            <button 
                                onClick={cerrarModalEditarUsuario}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={guardarCambiosUsuario}
                                disabled={!datosEdicion.nombre || !datosEdicion.email}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal para eliminar usuario - FUERA de las secciones */}
            {modalUsuario && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">
                            Eliminar Usuario
                        </h3>
                        
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                <strong>¡Atención!</strong> Esta acción eliminará permanentemente:
                            </p>
                            <ul className="text-sm text-red-600 dark:text-red-400 mt-2 ml-4 list-disc">
                                <li>El usuario y todos sus datos</li>
                                <li>Todos sus turnos (pasados y futuros)</li>
                                <li>Su historial médico</li>
                                <li>Sus notificaciones</li>
                            </ul>
                        </div>
                        
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Usuario:</strong> {modalUsuario.nombre}<br/>
                                <strong>Email:</strong> {modalUsuario.email}<br/>
                                <strong>Rol:</strong> {modalUsuario.rol === 'admin' ? 'Administrador' : 'Paciente'}
                            </p>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Para confirmar, escriba el email del usuario:
                            </label>
                            <input 
                                type="email"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                placeholder={modalUsuario.email}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={cerrarModalUsuario}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={eliminarUsuario}
                                disabled={confirmEmail !== modalUsuario.email}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Eliminar Usuario
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;