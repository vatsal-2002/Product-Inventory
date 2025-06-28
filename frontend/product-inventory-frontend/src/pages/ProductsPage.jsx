import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Package, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductForm from '../components/forms/ProductForm';
import ProductCard from '../components/ProductCard';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import Statistics from '../components/Statistics';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { productService } from '../services/productService';
import { buildQueryString } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductsPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        categoryIds: [],
        page: 1,
        limit: 12
    });

    const queryClient = useQueryClient();

    // Fetch products with filters
    const {
        data: productsData,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['products', filters],
        queryFn: () => productService.getProducts(filters),
        keepPreviousData: true
    });

    // Create product mutation
    const createProductMutation = useMutation({
        mutationFn: productService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            setShowForm(false);
            setEditingProduct(null);
            toast.success('Product created successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create product');
        }
    });

    // Update product mutation
    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }) => productService.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            setShowForm(false);
            setEditingProduct(null);
            toast.success('Product updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    });

    // Delete product mutation
    const deleteProductMutation = useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            toast.success('Product deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    });

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleFormSubmit = (data) => {
        if (editingProduct) {
            updateProductMutation.mutate({ id: editingProduct.id, data });
        } else {
            createProductMutation.mutate(data);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const handleDeleteProduct = (productId) => {
        deleteProductMutation.mutate(productId);
    };

    const handleSearch = (searchTerm) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm,
            page: 1
        }));
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 1
        }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({
            ...prev,
            page
        }));
    };

    const handleToggleStats = () => {
        setShowStats(!showStats);
    };

    const products = productsData?.data || [];
    const pagination = productsData?.pagination || {};

    if (showForm) {
        return (
            <Layout>
                <ProductForm
                    product={editingProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    isLoading={createProductMutation.isLoading || updateProductMutation.isLoading}
                />
            </Layout>
        );
    }

    return (
        <Layout 
            onAddProduct={handleAddProduct}
            onToggleStats={handleToggleStats}
            showStats={showStats}
        >
            <div className="space-y-6">
                {/* Statistics */}
                {showStats && (
                    <Statistics />
                )}

                {/* Search and Filters */}
                <SearchFilters
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                />

                {/* Products Grid */}
                {isLoading ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin mr-3" />
                            <span className="text-lg">Loading products...</span>
                        </CardContent>
                    </Card>
                ) : error ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Failed to load products
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {error.message || 'An error occurred while loading products'}
                            </p>
                            <Button onClick={() => refetch()}>
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                ) : products.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="w-12 h-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No products found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {filters.search || filters.categoryIds.length > 0
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by adding your first product'
                                }
                            </p>
                            <Button onClick={handleAddProduct}>
                                Add Product
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteProduct}
                                    isDeleting={deleteProductMutation.isLoading}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                totalCount={pagination.totalCount}
                                limit={pagination.limit}
                                onPageChange={handlePageChange}
                                className="mt-8"
                            />
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default ProductsPage;

