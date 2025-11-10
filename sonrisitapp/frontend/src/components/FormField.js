import React from 'react';

const FormField = ({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    error, 
    required = false,
    icon,
    showPasswordToggle = false,
    showPassword = false,
    onTogglePassword,
    className = ''
}) => {
    return (
        <div className={`flex flex-col ${className}`}>
            <label className="text-sm font-medium leading-normal pb-2 text-gray-900 dark:text-gray-200" htmlFor={name}>
                {label}
            </label>
            <div className="flex w-full items-stretch rounded-lg">
                <input 
                    className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                        error ? 'border-red-300' : 'border-gray-300'
                    } dark:border-gray-600 bg-background-light dark:bg-background-dark h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 ${
                        icon || showPasswordToggle ? 'rounded-r-none border-r-0' : ''
                    } text-base font-normal leading-normal`}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    required={required}
                />
                {(icon || showPasswordToggle) && (
                    <div className="text-gray-400 dark:text-gray-500 flex border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark items-center justify-center pr-3 rounded-r-lg border-l-0">
                        {showPasswordToggle ? (
                            <button
                                type="button"
                                onClick={onTogglePassword}
                                className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        ) : (
                            <span className="material-symbols-outlined">{icon}</span>
                        )}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
};

export default FormField;