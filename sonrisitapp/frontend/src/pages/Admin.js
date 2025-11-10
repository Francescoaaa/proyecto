import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Admin = ({ user, setUser }) => {
    const [turnos, setTurnos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.rol === 'admin') {
            cargarDatos();
        }
    }, [user]);

    const cargarDatos = async () => {
        try {
            const [turnosData, usuariosData] = await Promise.all([
                api.listarTurnos(),
                // Simular datos de usuarios ya que no tenemos endpoint
                Promise.resolve([
                    { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@email.com', rol: 'usuario', created_at: '2023-10-26' },
                    { id: 2, nombre: 'María González', email: 'maria.gonzalez@email.com', rol: 'admin', created_at: '2023-09-15' },
                    { id: 3, nombre: 'Carlos Rodriguez', email: 'carlos.r@email.com', rol: 'usuario', created_at: '2023-08-01' }
                ])
            ]);
            setTurnos(turnosData);
            setUsuarios(usuariosData);
            setFilteredUsuarios(usuariosData);
        } catch (error) {
            setError('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstadoTurno = async (id, nuevoEstado) => {
        try {
            await api.modificarTurno(id, { estado: nuevoEstado });
            cargarDatos();
        } catch (error) {
            setError('Error al modificar turno');
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
        const turnosHoy = turnos.filter(t => t.fecha === hoy).length;
        const turnosPendientes = turnos.filter(t => t.estado === 'reservado').length;
        const usuariosNuevosMes = usuarios.filter(u => {
            const fechaCreacion = new Date(u.created_at);
            const mesActual = new Date();
            return fechaCreacion.getMonth() === mesActual.getMonth() && fechaCreacion.getFullYear() === mesActual.getFullYear();
        }).length;
        
        return { turnosHoy, turnosPendientes, usuariosNuevosMes };
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
                        <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <span className="material-symbols-outlined text-xl">notifications</span>
                        </button>
                        <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center text-primary font-bold">
                            {user?.nombre?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>
                </header>
                
                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                                {error}
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-medium text-gray-600 dark:text-gray-300">Turnos del Día</p>
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">today</span>
                                        </div>
                                        <p className="tracking-tight text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{stats.turnosHoy}</p>
                                        <p className="text-sm font-medium text-green-600 dark:text-green-500">Turnos programados hoy</p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-medium text-gray-600 dark:text-gray-300">Usuarios Nuevos (Mes)</p>
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">person_add</span>
                                        </div>
                                        <p className="tracking-tight text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{stats.usuariosNuevosMes}</p>
                                        <p className="text-sm font-medium text-green-600 dark:text-green-500">Registros este mes</p>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-base font-medium text-gray-600 dark:text-gray-300">Turnos Pendientes</p>
                                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">pending</span>
                                        </div>
                                        <p className="tracking-tight text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{stats.turnosPendientes}</p>
                                        <p className="text-sm font-medium text-blue-600 dark:text-blue-500">Por confirmar</p>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {activeSection === 'usuarios' && (
                            <>
                                <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white mb-4">Gestión de Usuarios</h2>
                                
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
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Nombre</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Email</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Rol</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Registro</th>
                                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right" scope="col">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                                {filteredUsuarios.map((usuario, index) => (
                                                    <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200" style={{animationDelay: `${index * 50}ms`}}>
                                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{usuario.nombre}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{usuario.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                usuario.rol === 'admin' 
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                                            }`}>
                                                                {usuario.rol === 'admin' ? 'Administrador' : 'Paciente'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{usuario.created_at}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <button className="p-1 text-gray-500 hover:text-primary dark:hover:text-primary transition-all duration-200 transform hover:scale-110 hover:bg-primary/10 rounded">
                                                                <span className="material-symbols-outlined text-xl">edit</span>
                                                            </button>
                                                            <button className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-all duration-200 transform hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                                                                <span className="material-symbols-outlined text-xl">delete</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {activeSection === 'turnos' && (
                            <>
                                <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-white mb-4">Gestión de Turnos</h2>
                                
                                <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
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
                                                {turnos.map(turno => (
                                                    <tr key={turno.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{turno.id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{turno.usuario_nombre || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(turno.fecha).toLocaleDateString('es-ES')}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{turno.hora}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{turno.servicio}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                turno.estado === 'reservado' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                                                                turno.estado === 'cancelado' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 
                                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                                            }`}>
                                                                {turno.estado}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <div className="flex justify-end gap-2">
                                                                {turno.estado === 'reservado' && (
                                                                    <>
                                                                        <button 
                                                                            onClick={() => cambiarEstadoTurno(turno.id, 'completado')}
                                                                            className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                                                                        >
                                                                            <span className="material-symbols-outlined text-xs mr-1">check_circle</span>
                                                                            Completar
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => cambiarEstadoTurno(turno.id, 'cancelado')}
                                                                            className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                                                                        >
                                                                            <span className="material-symbols-outlined text-xs mr-1">cancel</span>
                                                                            Cancelar
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {turno.estado === 'cancelado' && (
                                                                    <button 
                                                                        onClick={() => cambiarEstadoTurno(turno.id, 'reservado')}
                                                                        className="px-3 py-1 text-xs font-medium text-white bg-yellow-600 rounded hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                                                                    >
                                                                        <span className="material-symbols-outlined text-xs mr-1">refresh</span>
                                                                        Reactivar
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Admin;