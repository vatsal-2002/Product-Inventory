import React from 'react';
import Header from './Header';

const Layout = ({ children, onAddProduct, onToggleStats, showStats }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header 
                onAddProduct={onAddProduct}
                onToggleStats={onToggleStats}
                showStats={showStats}
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;

