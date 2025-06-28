import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, BarChart3, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatNumber } from '../utils/helpers';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const Statistics = ({ className = '' }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const response = await productService.getProductStats();
            setStats(response.data);
        } catch (error) {
            toast.error('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className={className}>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading statistics...
                </CardContent>
            </Card>
        );
    }

    if (!stats) {
        return (
            <Card className={className}>
                <CardContent className="flex items-center justify-center py-8 text-gray-500">
                    Failed to load statistics
                </CardContent>
            </Card>
        );
    }

    const statCards = [
        {
            title: 'Total Products',
            value: formatNumber(stats.total_products || 0),
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Total Inventory',
            value: formatNumber(stats.total_quantity || 0),
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Average Quantity',
            value: formatNumber(Math.round(stats.avg_quantity || 0)),
            icon: BarChart3,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Low Stock Items',
            value: formatNumber(stats.low_stock_count || 0),
            icon: AlertTriangle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {stat.value}
                            </div>
                            {stat.title === 'Low Stock Items' && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Items with quantity &lt; 10
                                </p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default Statistics;

