// Autor: Francesco - https://github.com/Francescoaaa
import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300";
        
        if (!isVisible) {
            return `${baseStyles} translate-x-full opacity-0`;
        }

        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-500 text-white`;
            case 'error':
                return `${baseStyles} bg-red-500 text-white`;
            case 'warning':
                return `${baseStyles} bg-yellow-500 text-white`;
            case 'info':
                return `${baseStyles} bg-blue-500 text-white`;
            default:
                return `${baseStyles} bg-gray-500 text-white`;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'notifications';
        }
    };

    return (
        <div className={getToastStyles()}>
            <span className="material-symbols-outlined text-xl">
                {getIcon()}
            </span>
            <span className="font-medium">{message}</span>
            <button 
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-2 hover:bg-white/20 rounded p-1 transition-colors"
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
    );
};

export default Toast;