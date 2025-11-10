import React from 'react';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
    if (!message) return null;
    
    const types = {
        success: {
            bg: 'bg-green-50 border-green-200',
            text: 'text-green-700',
            icon: 'check_circle'
        },
        error: {
            bg: 'bg-red-50 border-red-200',
            text: 'text-red-700',
            icon: 'error'
        },
        warning: {
            bg: 'bg-yellow-50 border-yellow-200',
            text: 'text-yellow-700',
            icon: 'warning'
        },
        info: {
            bg: 'bg-blue-50 border-blue-200',
            text: 'text-blue-700',
            icon: 'info'
        }
    };
    
    const alertType = types[type];
    
    return (
        <div className={`mb-6 p-4 rounded-lg border ${alertType.bg} ${alertType.text} ${className}`}>
            <div className="flex items-center">
                <span className="material-symbols-outlined text-sm mr-2">{alertType.icon}</span>
                <span className="flex-1">{message}</span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-2 hover:opacity-70 transition-opacity"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;