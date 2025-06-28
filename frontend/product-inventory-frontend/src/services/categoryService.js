import api from './api';

export const categoryService = {
    // Get all categories
    getCategories: async () => {
        const { data } = await api.get('/categories');
        return data;
    },

    // Get categories with product count
    getCategoriesWithCount: async () => {
        const { data } = await api.get('/categories/with-count');
        return data;
    },

    // Get category by ID
    getCategoryById: async (id) => {
        const { data } = await api.get(`/categories/${id}`);
        return data;
    },

    // Create new category
    createCategory: async (categoryData) => {
        const { data } = await api.post('/categories', categoryData);
        return data;
    },

    // Update category
    updateCategory: async (id, categoryData) => {
        const { data } = await api.put(`/categories/${id}`, categoryData);
        return data;
    },

    // Delete category
    deleteCategory: async (id) => {
        const { data } = await api.delete(`/categories/${id}`);
        return data;
    },

    // Search categories by name
    searchCategories: async (query, limit = 10) => {
        const { data } = await api.get('/categories/search', {
            params: { q: query, limit }
        });
        return data;
    }
};

export default categoryService;

