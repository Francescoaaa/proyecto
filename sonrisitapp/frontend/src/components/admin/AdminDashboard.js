// Autor: Francesco - https://github.com/Francescoaaa
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
        
        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfica de Estados de Turnos */}
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estados de Turnos</h3>
                <div className="relative h-48">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        {(() => {
                            const total = stats.turnosPendientes + stats.turnosCompletados + stats.turnosCancelados;
                            if (total === 0) return <text x="100" y="100" textAnchor="middle" className="fill-gray-400 text-sm">Sin datos</text>;
                            
                            let currentAngle = 0;
                            const colors = ['#3B82F6', '#10B981', '#EF4444'];
                            const values = [stats.turnosPendientes, stats.turnosCompletados, stats.turnosCancelados];
                            const labels = ['Pendientes', 'Completados', 'Cancelados'];
                            
                            return values.map((value, index) => {
                                if (value === 0) return null;
                                const percentage = (value / total) * 100;
                                const angle = (value / total) * 360;
                                const x1 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
                                const y1 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
                                const x2 = 100 + 80 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
                                const y2 = 100 + 80 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
                                const largeArc = angle > 180 ? 1 : 0;
                                
                                const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
                                currentAngle += angle;
                                
                                return (
                                    <g key={index}>
                                        <path d={path} fill={colors[index]} opacity="0.8" />
                                        <text 
                                            x={100 + 50 * Math.cos((currentAngle - angle/2 - 90) * Math.PI / 180)} 
                                            y={100 + 50 * Math.sin((currentAngle - angle/2 - 90) * Math.PI / 180)} 
                                            textAnchor="middle" 
                                            className="fill-white text-xs font-semibold"
                                        >
                                            {percentage.toFixed(0)}%
                                        </text>
                                    </g>
                                );
                            });
                        })()}
                    </svg>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    {['Pendientes', 'Completados', 'Cancelados'].map((label, index) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                                index === 0 ? 'bg-blue-500' : 
                                index === 1 ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Gráfica de Actividad Semanal */}
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actividad Semanal</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                    {(() => {
                        const maxValue = Math.max(stats.turnosHoy, stats.turnosSemana, stats.usuariosActivos, stats.usuariosNuevosMes, 1);
                        const data = [
                            { label: 'Hoy', value: stats.turnosHoy, color: 'bg-blue-500' },
                            { label: 'Semana', value: stats.turnosSemana, color: 'bg-green-500' },
                            { label: 'Activos', value: stats.usuariosActivos, color: 'bg-purple-500' },
                            { label: 'Nuevos', value: stats.usuariosNuevosMes, color: 'bg-orange-500' }
                        ];
                        
                        return data.map((item, index) => {
                            const height = (item.value / maxValue) * 160;
                            return (
                                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                    <div className="relative group">
                                        <div 
                                            className={`${item.color} rounded-t transition-all duration-300 hover:opacity-80 w-full`}
                                            style={{ height: `${height}px`, minHeight: '4px' }}
                                        ></div>
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.value}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">{item.label}</span>
                                </div>
                            );
                        });
                    })()}
                </div>
            </div>
        </div>

    </>
);

export default AdminDashboard;