import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Modal from '../components/Modal';
import NotificationBell from '../components/NotificationBell';

const MisTurnos = ({ user, setUser }) => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('proximos');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [turnoToCancel, setTurnoToCancel] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTurno, setSelectedTurno] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        cargarMisTurnos();
    }, [user]);

    const cargarMisTurnos = async () => {
        try {
            const data = await api.misTurnos(user.id);
            setTurnos(data);
        } catch (error) {
            setError('Error al cargar turnos');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (turno) => {
        setTurnoToCancel(turno);
        setShowCancelModal(true);
    };

    const confirmCancelTurno = async () => {
        if (turnoToCancel) {
            try {
                await api.cancelarTurno(turnoToCancel.id);
                cargarMisTurnos();
                setShowCancelModal(false);
                setTurnoToCancel(null);
            } catch (error) {
                setError('Error al cancelar turno');
            }
        }
    };

    const handleViewDetails = (turno) => {
        setSelectedTurno(turno);
        setShowDetailsModal(true);
    };

    const handleEditClick = (turno) => {
        setSelectedTurno(turno);
        setEditFormData({
            fecha: turno.fecha,
            hora: turno.hora,
            servicio: turno.servicio,
            observaciones: turno.observaciones || ''
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const confirmEditTurno = async () => {
        try {
            await api.modificarTurno(selectedTurno.id, editFormData);
            cargarMisTurnos();
            setShowEditModal(false);
            setSelectedTurno(null);
        } catch (error) {
            setError('Error al modificar turno');
        }
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            'reservado': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
            'cancelado': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
            'completado': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
        };
        return badges[estado] || 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300';
    };

    const getEstadoTexto = (estado) => {
        const textos = {
            'reservado': 'Confirmado',
            'cancelado': 'Cancelado',
            'completado': 'Completado'
        };
        return textos[estado] || estado;
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearHora = (hora) => {
        return new Date(`2000-01-01T${hora}`).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const turnosProximos = turnos.filter(turno => turno.estado === 'reservado');
    const turnosHistorial = turnos.filter(turno => turno.estado !== 'reservado');
    const turnosMostrar = activeTab === 'proximos' ? turnosProximos : turnosHistorial;

    if (loading) {
        return (
            <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <Header user={user} setUser={setUser} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando turnos...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <header className="w-full bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                                <div className="text-primary">
                                    <svg className="size-6" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fillRule="evenodd"></path>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Sonrisitapp</h2>
                            </div>
                            
                            <div className="hidden md:flex flex-1 justify-center">
                                <nav className="flex items-center gap-9">
                                    <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal" to="/reservar">Reservar</Link>
                                    <Link className="text-primary dark:text-primary text-sm font-bold leading-normal" to="/mis-turnos">Mis Turnos</Link>
                                    {user?.rol === 'admin' && (
                                        <Link className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal" to="/admin">Admin</Link>
                                    )}
                                </nav>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <NotificationBell user={user} />
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {user?.nombre?.charAt(0)?.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                
                <main className="flex-1">
                    <div className="py-5 sm:py-8">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Page Heading */}
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Mis Turnos</h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                                        Gestiona tus citas odontológicas futuras y revisa tu historial.
                                    </p>
                                </div>
                                <Link 
                                    to="/reservar"
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 shadow-sm hover:bg-primary/90 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl">add</span>
                                    <span className="truncate">Agendar Nuevo Turno</span>
                                </Link>
                            </div>
                            
                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                                    {error}
                                </div>
                            )}
                            
                            {/* Tabs */}
                            <div className="mb-6">
                                <div className="flex border-b border-gray-200 dark:border-gray-700 gap-8">
                                    <button 
                                        onClick={() => setActiveTab('proximos')}
                                        className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                                            activeTab === 'proximos' 
                                                ? 'border-b-primary text-gray-900 dark:text-white' 
                                                : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
                                        }`}
                                    >
                                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">Próximos Turnos</p>
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('historial')}
                                        className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                                            activeTab === 'historial' 
                                                ? 'border-b-primary text-gray-900 dark:text-white' 
                                                : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
                                        }`}
                                    >
                                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">Historial de Turnos</p>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Appointments List */}
                            <div className="flex flex-col gap-6">
                                {turnosMostrar.length === 0 ? (
                                    <div className="text-center py-16 px-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                                        <div className="flex justify-center mb-4">
                                            <div className="flex items-center justify-center size-16 bg-primary/10 rounded-full text-primary">
                                                <span className="material-symbols-outlined text-4xl">calendar_month</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {activeTab === 'proximos' ? 'No tienes turnos programados' : 'No tienes historial de turnos'}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {activeTab === 'proximos' ? '¡Agenda tu próxima visita para cuidar tu sonrisa!' : 'Aquí aparecerán tus turnos completados o cancelados.'}
                                        </p>
                                        {activeTab === 'proximos' && (
                                            <div className="mt-6">
                                                <Link 
                                                    to="/reservar"
                                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 shadow-sm hover:bg-primary/90 transition-colors mx-auto"
                                                >
                                                    <span className="material-symbols-outlined text-xl">add</span>
                                                    <span className="truncate">Agendar mi primer turno</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    turnosMostrar.map(turno => (
                                        <div key={turno.id} className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800/50 p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEstadoBadge(turno.estado)}`}>
                                                            {getEstadoTexto(turno.estado)}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
                                                        {formatearFecha(turno.fecha)} - {formatearHora(turno.hora)}
                                                    </p>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                                                        {turno.servicio}
                                                        {turno.observaciones && ` - ${turno.observaciones}`}
                                                    </p>
                                                </div>
                                                <div className="hidden sm:block w-32 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary text-3xl">medical_services</span>
                                                </div>
                                            </div>
                                            
                                            {turno.estado === 'reservado' && (
                                                <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200 dark:border-gray-700/50">
                                                    <button 
                                                        onClick={() => handleViewDetails(turno)}
                                                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                                                    >
                                                        <span className="material-symbols-outlined text-sm mr-1">visibility</span>
                                                        <span className="truncate">Ver Detalles</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleEditClick(turno)}
                                                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                                                    >
                                                        <span className="material-symbols-outlined text-sm mr-1">edit</span>
                                                        <span className="truncate">Modificar</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCancelClick(turno)}
                                                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-transparent text-red-600 dark:text-red-500 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200 transform hover:scale-105 hover:shadow-md border border-red-200 hover:border-red-300"
                                                    >
                                                        <span className="material-symbols-outlined text-sm mr-1">cancel</span>
                                                        <span className="truncate">Cancelar</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Modal de confirmación */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => {
                    setShowCancelModal(false);
                    setTurnoToCancel(null);
                }}
                title="Cancelar Turno"
                size="sm"
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">warning</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        ¿Estás seguro?
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Esta acción cancelará tu turno del {turnoToCancel && formatearFecha(turnoToCancel.fecha)} a las {turnoToCancel && formatearHora(turnoToCancel.hora)}. No podrás deshacer esta acción.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => {
                                setShowCancelModal(false);
                                setTurnoToCancel(null);
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            No, mantener turno
                        </button>
                        <button
                            onClick={confirmCancelTurno}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Sí, cancelar turno
                        </button>
                    </div>
                </div>
            </Modal>
            
            {/* Modal de ver detalles */}
            <Modal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedTurno(null);
                }}
                title="Detalles del Turno"
                size="md"
            >
                {selectedTurno && (
                    <div className="space-y-4">
                        <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary">event</span>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Información del Turno</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Fecha:</span>
                                    <p className="text-gray-900 dark:text-white">{formatearFecha(selectedTurno.fecha)}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Hora:</span>
                                    <p className="text-gray-900 dark:text-white">{formatearHora(selectedTurno.hora)}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Servicio:</span>
                                    <p className="text-gray-900 dark:text-white">{selectedTurno.servicio}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Estado:</span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEstadoBadge(selectedTurno.estado)}`}>
                                        {getEstadoTexto(selectedTurno.estado)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {selectedTurno.observaciones && (
                            <div>
                                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Observaciones:</h5>
                                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                    {selectedTurno.observaciones}
                                </p>
                            </div>
                        )}
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Turno creado el {new Date(selectedTurno.created_at).toLocaleDateString('es-ES')} a las {new Date(selectedTurno.created_at).toLocaleTimeString('es-ES')}
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedTurno(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
            
            {/* Modal de modificar turno */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedTurno(null);
                }}
                title="Modificar Turno"
                size="md"
            >
                {selectedTurno && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={editFormData.fecha}
                                    onChange={handleEditChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Hora
                                </label>
                                <select
                                    name="hora"
                                    value={editFormData.hora}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="09:00">09:00</option>
                                    <option value="10:00">10:00</option>
                                    <option value="11:00">11:00</option>
                                    <option value="14:00">14:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="16:00">16:00</option>
                                    <option value="17:00">17:00</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Servicio
                            </label>
                            <select
                                name="servicio"
                                value={editFormData.servicio}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                            >
                                <option value="Limpieza dental">Limpieza dental</option>
                                <option value="Control general">Control general</option>
                                <option value="Ortodoncia">Ortodoncia</option>
                                <option value="Endodoncia">Endodoncia</option>
                                <option value="Extracción">Extracción</option>
                                <option value="Blanqueamiento">Blanqueamiento</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Observaciones
                            </label>
                            <textarea
                                name="observaciones"
                                value={editFormData.observaciones}
                                onChange={handleEditChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                                placeholder="Observaciones adicionales..."
                            />
                        </div>
                        
                        <div className="flex gap-3 justify-end pt-4">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedTurno(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmEditTurno}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MisTurnos;