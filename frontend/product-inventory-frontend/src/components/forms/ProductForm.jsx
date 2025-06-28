import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X, Loader2, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { productSchema } from '../../utils/validation';
import { categoryService } from '../../services/categoryService';
import toast from 'react-hot-toast';

const ProductForm = ({ 
    product = null, 
    onSubmit, 
    onCancel, 
    isLoading = false 
}) => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const isEditing = !!product;

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm({
        resolver: yupResolver(productSchema),
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            quantity: product?.quantity || 0,
            categoryIds: product?.category_ids || []
        }
    });

    // Load categories on component mount
    useEffect(() => {
        loadCategories();
    }, []);

    // Set selected categories when product changes
    useEffect(() => {
        if (product && categories.length > 0) {
            const selected = categories.filter(cat => 
                product.category_ids?.includes(cat.id)
            );
            setSelectedCategories(selected);
        }
    }, [product, categories]);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await categoryService.getCategories();
            setCategories(response.data || []);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleCategoryToggle = (category) => {
        const isSelected = selectedCategories.some(cat => cat.id === category.id);
        let newSelected;
        
        if (isSelected) {
            newSelected = selectedCategories.filter(cat => cat.id !== category.id);
        } else {
            newSelected = [...selectedCategories, category];
        }
        
        setSelectedCategories(newSelected);
        setValue('categoryIds', newSelected.map(cat => cat.id));
    };

    const onFormSubmit = (data) => {
        onSubmit({
            ...data,
            categoryIds: selectedCategories.map(cat => cat.id)
        });
    };

    const handleReset = () => {
        reset();
        setSelectedCategories([]);
        if (onCancel) onCancel();
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <CardTitle>
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    disabled={isLoading}
                >
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Product Name <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="name"
                                    placeholder="Enter product name"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="description"
                                    placeholder="Enter product description"
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">
                            Quantity <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                            name="quantity"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="quantity"
                                    type="number"
                                    min="0"
                                    placeholder="Enter quantity"
                                    className={errors.quantity ? 'border-red-500' : ''}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                            )}
                        />
                        {errors.quantity && (
                            <p className="text-sm text-red-500">{errors.quantity.message}</p>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                        <Label>
                            Categories <span className="text-red-500">*</span>
                        </Label>
                        
                        {loadingCategories ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Loading categories...
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* Selected Categories */}
                                {selectedCategories.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCategories.map(category => (
                                            <Badge
                                                key={category.id}
                                                variant="default"
                                                className="cursor-pointer hover:bg-blue-700"
                                                onClick={() => handleCategoryToggle(category)}
                                            >
                                                {category.name}
                                                <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Available Categories */}
                                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {categories
                                            .filter(cat => !selectedCategories.some(selected => selected.id === cat.id))
                                            .map(category => (
                                                <Badge
                                                    key={category.id}
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-gray-100 justify-center"
                                                    onClick={() => handleCategoryToggle(category)}
                                                >
                                                    {category.name}
                                                </Badge>
                                            ))
                                        }
                                    </div>
                                    {categories.filter(cat => !selectedCategories.some(selected => selected.id === cat.id)).length === 0 && (
                                        <p className="text-sm text-gray-500 text-center py-2">
                                            All categories selected
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {errors.categoryIds && (
                            <p className="text-sm text-red-500">{errors.categoryIds.message}</p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || selectedCategories.length === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {isEditing ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProductForm;

