import React from 'react';
import { Package, Plus, Search, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';

const Header = ({ onAddProduct, onToggleStats, showStats }) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Product Inventory
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage your products efficiently
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <Button
                            variant={showStats ? "default" : "outline"}
                            size="sm"
                            onClick={onToggleStats}
                            className="hidden sm:flex"
                        >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Statistics
                        </Button>
                        
                        <Button
                            onClick={onAddProduct}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

