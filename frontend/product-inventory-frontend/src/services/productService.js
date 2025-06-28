import api from './api';

export const productService = {
    // Get all products with filters and pagination
    getProducts: async (params = {}) => {
        const { data } = await api.get('/products', { params });
        return data;
    },

    // Get product by ID
    getProductById: async (id) => {
        const { data } = await api.get(`/products/${id}`);
        return data;
    },

    // Create new product
    createProduct: async (productData) => {
        const { data } = await api.post('/products', productData);
        return data;
    },

    // Update product
    updateProduct: async (id, productData) => {
        const { data } = await api.put(`/products/${id}`, productData);
        return data;
    },

    // Delete product
    deleteProduct: async (id) => {
        const { data } = await api.delete(`/products/${id}`);
        return data;
    },

    // Bulk delete products
    bulkDeleteProducts: async (ids) => {
        const { data } = await api.post('/products/bulk-delete', { ids });
        return data;
    },

    // Search products by name
    searchProducts: async (query, limit = 10) => {
        const { data } = await api.get('/products/search', {
            params: { q: query, limit }
        });
        return data;
    },

    // Get product statistics
    getProductStats: async () => {
        const { data } = await api.get('/products/stats');
        return data;
    }
};

export default productService;

