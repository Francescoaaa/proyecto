import React from 'react';

const AdminDashboard = ({ stats, user }) => (
    <>
        <div className="flex flex-wrap justify-between gap-3 mb-6">
            <div className="flex min-w-72 flex-col gap-1">
                <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">Dashboard</p>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">Resumen general del estado de la clínica.</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
                { title: 'Turnos Hoy', value: stats.turnosHoy, icon: 'today', color: 'green' },
                { title: 'Pendientes', value: stats.turnosPendientes, icon: 'pending', color: 'blue' },
                { title: 'Completados', value: stats.turnosCompletados, icon: 'check_circle', color: 'green' },
                { title: 'Total Usuarios', value: stats.totalUsuarios, icon: 'group', color: 'purple' }
            ].map(({ title, value, icon, color }) => (
                <div key={title} className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                    <div className="flex items-center justify-between">
                        <p className="text-base font-medium text-gray-600 dark:text-gray-300">{title}</p>
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">{icon}</span>
                    </div>
                    <p className="tracking-tight text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">{value}</p>
                </div>
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen Semanal</h3>
                <div className="space-y-3">
                    {[
                        ['Turnos esta semana:', stats.turnosSemana],
                        ['Usuarios activos:', stats.usuariosActivos],
                        ['Nuevos usuarios (mes):', stats.usuariosNuevosMes]
                    ].map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">{label}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estado de Turnos</h3>
                <div className="space-y-3">
                    {[
                        ['Reservados:', stats.turnosPendientes, 'blue'],
                        ['Completados:', stats.turnosCompletados, 'green'],
                        ['Cancelados:', stats.turnosCancelados, 'red']
                    ].map(([label, value, color]) => (
                        <div key={label} className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">{label}</span>
                            <span className={`px-2 py-1 text-xs font-semibold bg-${color}-100 text-${color}-800 dark:bg-${color}-900/50 dark:text-${color}-300 rounded-full`}>{value}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">Servicio más popular:</span>
                        <span className="font-semibold text-primary">{stats.servicioMasPopular}</span>
                    </div>
                </div>
            </div>
        </div>
        

    </>
);

export default AdminDashboard;