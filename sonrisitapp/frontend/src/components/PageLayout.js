import React from 'react';
import Header from './Header';

const PageLayout = ({ 
    user, 
    setUser, 
    children, 
    title, 
    subtitle, 
    maxWidth = '4xl',
    showHeader = true 
}) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            {showHeader && <Header user={user} setUser={setUser} />}
            
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className={`max-w-${maxWidth} mx-auto`}>
                    {(title || subtitle) && (
                        <div className="flex flex-wrap justify-between gap-3 mb-8">
                            <div>
                                {title && (
                                    <h1 className="text-4xl font-black leading-tight tracking-tight">{title}</h1>
                                )}
                                {subtitle && (
                                    <p className="text-base font-normal leading-normal text-slate-500 dark:text-slate-400 mt-2">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {children}
                </div>
            </main>
        </div>
    );
};

export default PageLayout;