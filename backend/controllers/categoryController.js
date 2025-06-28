const Category = require('../models/Category');
const { catchAsync } = require('../middleware/errorHandler');
const { 
    sendSuccess, 
    sendCreated, 
    sendNotFound, 
    sendBadRequest,
    sendNoContent 
} = require('../utils/response');

// Get all categories
const getAllCategories = catchAsync(async (req, res) => {
    const categories = await Category.getAll();
    sendSuccess(res, categories, 'Categories retrieved successfully');
});

// Get all categories with product count
const getCategoriesWithCount = catchAsync(async (req, res) => {
    const categories = await Category.getWithProductCount();
    sendSuccess(res, categories, 'Categories with product count retrieved successfully');
});

// Get category by ID
const getCategoryById = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const category = await Category.getById(id);
    
    if (!category) {
        return sendNotFound(res, 'Category not found');
    }
    
    sendSuccess(res, category, 'Category retrieved successfully');
});

// Create new category
const createCategory = catchAsync(async (req, res) => {
    const { name, description } = req.body;
    
    // Check if category name already exists
    const nameExists = await Category.nameExists(name);
    if (nameExists) {
        return sendBadRequest(res, 'A category with this name already exists');
    }
    
    const category = await Category.create({
        name,
        description
    });
    
    sendCreated(res, category, 'Category created successfully');
});

// Update category
const updateCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Check if category exists
    const existingCategory = await Category.getById(id);
    if (!existingCategory) {
        return sendNotFound(res, 'Category not found');
    }
    
    // Check if category name already exists (excluding current category)
    const nameExists = await Category.nameExists(name, id);
    if (nameExists) {
        return sendBadRequest(res, 'A category with this name already exists');
    }
    
    const category = await Category.update(id, {
        name,
        description
    });
    
    if (!category) {
        return sendNotFound(res, 'Category not found');
    }
    
    sendSuccess(res, category, 'Category updated successfully');
});

// Delete category
const deleteCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await Category.getById(id);
    if (!existingCategory) {
        return sendNotFound(res, 'Category not found');
    }
    
    try {
        const deleted = await Category.delete(id);
        
        if (!deleted) {
            return sendNotFound(res, 'Category not found');
        }
        
        sendNoContent(res, 'Category deleted successfully');
    } catch (error) {
        if (error.message.includes('Cannot delete category that is being used')) {
            return sendBadRequest(res, 'Cannot delete category that is being used by products');
        }
        throw error;
    }
});

// Search categories by name (for autocomplete)
const searchCategories = catchAsync(async (req, res) => {
    const { q, limit } = req.query;
    
    if (!q || q.trim().length === 0) {
        return sendBadRequest(res, 'Search query is required');
    }
    
    const categories = await Category.searchByName(q.trim(), parseInt(limit) || 10);
    sendSuccess(res, categories, 'Search results retrieved successfully');
});

module.exports = {
    getAllCategories,
    getCategoriesWithCount,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories
};

