import React, { useState } from 'react';
import { Edit, Trash2, Package, Calendar, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import { formatDate, truncateText } from '../utils/helpers';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';

const ProductCard = ({ 
    product, 
    onEdit, 
    onDelete, 
    isDeleting = false 
}) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        onDelete(product.id);
        setShowDeleteDialog(false);
    };

    const getQuantityColor = (quantity) => {
        if (quantity === 0) return 'text-red-600 bg-red-50';
        if (quantity < 10) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 truncate" title={product.name}>
                            {product.name}
                        </h3>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(product)}
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                        >
                            <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        
                        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={isDeleting}
                                    className="h-8 w-8 p-0 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{product.name}"? 
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Description */}
                {product.description && (
                    <p className="text-sm text-gray-600" title={product.description}>
                        {truncateText(product.description, 120)}
                    </p>
                )}

                {/* Quantity */}
                <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <Badge 
                        variant="outline" 
                        className={`${getQuantityColor(product.quantity)} border-0 font-medium`}
                    >
                        {product.quantity}
                    </Badge>
                </div>

                {/* Categories */}
                {product.categories && product.categories.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Categories:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {product.categories.map((category, index) => (
                                <Badge 
                                    key={index} 
                                    variant="secondary" 
                                    className="text-xs"
                                >
                                    {category}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Created Date */}
                <div className="flex items-center space-x-2 text-xs text-gray-500 pt-2 border-t">
                    <Calendar className="w-3 h-3" />
                    <span>Added on {formatDate(product.created_at)}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;

