import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';

const Reservar = ({ user, setUser }) => {
    const [turnos, setTurnos] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [formData, setFormData] = useState({
        patientName: user?.nombre || '',
        contactNumber: '',
        serviceType: '',
        notes: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hoveredDate, setHoveredDate] = useState(null);
    const [hoveredTime, setHoveredTime] = useState(null);

    const servicios = [
        'Limpieza dental',
        'Control general', 
        'Ortodoncia',
        'Endodoncia',
        'Emergencia'
    ];

    const horarios = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30'
    ];

    useEffect(() => {
        cargarTurnos();
    }, []);

    const cargarTurnos = async () => {
        try {
            const data = await api.listarTurnos();
            console.log('RESERVAR: Turnos cargados:', data);
            // Asegurar que data sea un array
            setTurnos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('RESERVAR: Error al cargar turnos:', error);
            setError('Error al cargar turnos');
            setTurnos([]); // Asegurar que turnos sea un array vacío en caso de error
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!selectedDate || !selectedTime) {
            setError('Por favor selecciona fecha y hora');
            setLoading(false);
            return;
        }

        try {
            const turnoData = {
                usuario_id: user.id,
                fecha: selectedDate,
                hora: selectedTime,
                servicio: formData.serviceType,
                observaciones: formData.notes
            };

            const response = await api.crearTurno(turnoData);
            
            if (response.id) {
                setSuccess('Turno reservado exitosamente');
                setSelectedDate('');
                setSelectedTime('');
                setFormData({
                    patientName: user?.nombre || '',
                    contactNumber: '',
                    serviceType: '',
                    notes: ''
                });
                cargarTurnos();
            } else {
                setError(response.error || 'Error al reservar turno');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const turnoOcupado = (fecha, hora) => {
        // Verificar que turnos sea un array antes de usar .some()
        if (!Array.isArray(turnos)) {
            console.warn('RESERVAR: turnos no es un array:', turnos);
            return false;
        }
        
        return turnos.some(turno => 
            turno.fecha === fecha && 
            turno.hora === hora && 
            ['reservado', 'confirmado'].includes(turno.estado)
        );
    };

    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };

    const formatDateForAPI = (day) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const date = new Date(year, month, day);
        return date.toISOString().split('T')[0];
    };

    const isDateDisabled = (day) => {
        if (!day) return true;
        const today = new Date();
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return date < today;
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root">
            <Header user={user} setUser={setUser} />
            
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col gap-4 mb-10">
                    <h1 className="text-4xl font-black leading-tight tracking-tight">Reservar Nuevo Turno</h1>
                    <p className="text-base font-normal leading-normal text-slate-500 dark:text-slate-400">
                        Selecciona una fecha y hora, luego confirma tus detalles para programar tu visita.
                    </p>
                </div>
                
                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
                        {success}
                    </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-3 space-y-8">
                        {/* Calendar */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold leading-tight tracking-tight mb-4">1. Selecciona una Fecha</h2>
                            <div className="flex flex-wrap items-center justify-center">
                                <div className="w-full">
                                    <div className="flex items-center p-1 justify-between">
                                        <button 
                                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                            className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                                        </button>
                                        <p className="text-base font-bold leading-tight flex-1 text-center">
                                            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                        </p>
                                        <button 
                                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                            className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 mt-2">
                                        {['D', 'L', 'M', 'Mi', 'J', 'V', 'S'].map((day, index) => (
                                            <p key={`day-${index}`} className="text-[13px] font-bold h-10 w-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                                                {day}
                                            </p>
                                        ))}
                                        {getDaysInMonth().map((day, index) => (
                                            <div key={index}>
                                                {day ? (
                                                    <button
                                                        onClick={() => setSelectedDate(formatDateForAPI(day))}
                                                        onMouseEnter={() => setHoveredDate(day)}
                                                        onMouseLeave={() => setHoveredDate(null)}
                                                        disabled={isDateDisabled(day)}
                                                        className={`h-10 w-full text-sm font-medium leading-normal group transition-all duration-200 ${
                                                            selectedDate === formatDateForAPI(day)
                                                                ? 'text-white scale-110'
                                                                : isDateDisabled(day)
                                                                ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                                                : 'hover:bg-primary/10 hover:scale-105'
                                                        }`}
                                                    >
                                                        <div className={`flex size-full items-center justify-center rounded-full transition-all duration-200 ${
                                                            selectedDate === formatDateForAPI(day)
                                                                ? 'bg-primary shadow-lg'
                                                                : hoveredDate === day && !isDateDisabled(day)
                                                                ? 'bg-primary/20 scale-110'
                                                                : ''
                                                        }`}>
                                                            {day}
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <div className="h-10 w-full"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Time Selection */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold leading-tight tracking-tight mb-4">2. Elige un Horario Disponible</h2>
                            
                            {selectedDate && (
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h3 className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">info</span>
                                        Turnos para {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </h3>
                                    <div className="space-y-1">
                                        {turnos
                                            .filter(turno => turno.fecha === selectedDate && ['reservado', 'confirmado'].includes(turno.estado))
                                            .sort((a, b) => a.hora.localeCompare(b.hora))
                                            .map(turno => (
                                                <div key={turno.id} className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm text-red-500">schedule</span>
                                                    <span className="font-medium">{turno.hora}</span> - {turno.servicio_nombre || turno.servicio} (Ocupado)
                                                </div>
                                            ))
                                        }
                                        {turnos.filter(turno => turno.fecha === selectedDate && ['reservado', 'confirmado'].includes(turno.estado)).length === 0 && (
                                            <p className="text-xs text-blue-700 dark:text-blue-300">No hay turnos reservados para este día</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {horarios.map(hora => {
                                    const isOccupied = turnoOcupado(selectedDate, hora);
                                    const isSelected = selectedTime === hora;
                                    
                                    return (
                                        <button
                                            key={hora}
                                            onClick={() => setSelectedTime(hora)}
                                            onMouseEnter={() => setHoveredTime(hora)}
                                            onMouseLeave={() => setHoveredTime(null)}
                                            disabled={isOccupied || !selectedDate}
                                            className={`flex items-center justify-center text-sm font-semibold py-3 px-4 rounded-lg border transition-all duration-200 transform ${
                                                isSelected
                                                    ? 'text-white bg-primary border-primary scale-105 shadow-lg'
                                                    : isOccupied
                                                    ? 'border-red-200 dark:border-red-800 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 cursor-not-allowed'
                                                    : !selectedDate
                                                    ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                                    : hoveredTime === hora
                                                    ? 'border-primary text-primary dark:border-primary scale-105 shadow-md bg-primary/5'
                                                    : 'border-slate-300 dark:border-slate-700 hover:border-primary hover:text-primary dark:hover:border-primary hover:scale-105'
                                            }`}
                                        >
                                            {isOccupied ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">block</span>
                                                    {hora}
                                                </div>
                                            ) : (
                                                hora
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Confirmation Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold leading-tight tracking-tight mb-6">3. Confirma tus Detalles</h2>
                            
                            {selectedDate && selectedTime && (
                                <div className="bg-primary/10 dark:bg-primary/20 border-l-4 border-primary p-4 rounded-lg mb-6 animate-pulse">
                                    <p className="font-bold text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">event_available</span>
                                        Resumen del Turno
                                    </p>
                                    <p className="text-sm font-medium text-text-light dark:text-text-dark">
                                        Reservando para: <span className="font-bold">{new Date(selectedDate).toLocaleDateString('es-ES')}</span> a las <span className="font-bold">{selectedTime}</span>
                                    </p>
                                </div>
                            )}
                            
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" htmlFor="patientName">Nombre del Paciente</label>
                                    <input 
                                        className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary focus:ring-primary focus:ring-opacity-50" 
                                        id="patientName" 
                                        name="patientName" 
                                        placeholder="ej. Juan Pérez" 
                                        type="text"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" htmlFor="contactNumber">Número de Contacto</label>
                                    <input 
                                        className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary focus:ring-primary focus:ring-opacity-50" 
                                        id="contactNumber" 
                                        name="contactNumber" 
                                        placeholder="ej. (123) 456-7890" 
                                        type="tel"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" htmlFor="serviceType">Tipo de Servicio</label>
                                    <select 
                                        className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary focus:ring-primary focus:ring-opacity-50" 
                                        id="serviceType" 
                                        name="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecciona un servicio...</option>
                                        {servicios.map(servicio => (
                                            <option key={servicio} value={servicio}>{servicio}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" htmlFor="notes">Notas o Motivo de la Visita (Opcional)</label>
                                    <textarea 
                                        className="block w-full rounded-lg border-slate-300 dark:border-slate-700 bg-background-light dark:bg-slate-800 focus:border-primary focus:ring-primary focus:ring-opacity-50" 
                                        id="notes" 
                                        name="notes" 
                                        placeholder="Describe tus síntomas o motivo de la visita..." 
                                        rows="3"
                                        value={formData.notes}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                                
                                <div className="pt-4">
                                    <button 
                                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors disabled:opacity-50" 
                                        type="submit"
                                        disabled={loading || !selectedDate || !selectedTime}
                                    >
                                        <span className="material-symbols-outlined text-xl">verified</span>
                                        <span>{loading ? 'Confirmando...' : 'Confirmar Turno'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Reservar;