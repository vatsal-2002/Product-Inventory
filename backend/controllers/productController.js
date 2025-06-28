const Product = require('../models/Product');
const Category = require('../models/Category');
const { catchAsync } = require('../middleware/errorHandler');
const { 
    sendSuccess, 
    sendCreated, 
    sendNotFound, 
    sendBadRequest, 
    sendPaginatedResponse,
    sendNoContent 
} = require('../utils/response');

// Get all products with filters and pagination
const getAllProducts = catchAsync(async (req, res) => {
    const { search, categoryIds, page, limit } = req.query;
    
    // Parse categoryIds if provided
    let parsedCategoryIds = [];
    if (categoryIds) {
        if (Array.isArray(categoryIds)) {
            parsedCategoryIds = categoryIds.map(id => parseInt(id)).filter(id => !isNaN(id));
        } else if (typeof categoryIds === 'string') {
            parsedCategoryIds = categoryIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
        }
    }

    const filters = {
        search: search || '',
        categoryIds: parsedCategoryIds,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
    };

    const result = await Product.getAll(filters);
    
    sendPaginatedResponse(
        res, 
        result.products, 
        result.pagination, 
        'Products retrieved successfully'
    );
});

// Get product by ID
const getProductById = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const product = await Product.getById(id);
    
    if (!product) {
        return sendNotFound(res, 'Product not found');
    }
    
    sendSuccess(res, product, 'Product retrieved successfully');
});

// Create new product
const createProduct = catchAsync(async (req, res) => {
    const { name, description, quantity, categoryIds } = req.body;
    
    // Check if product name already exists
    const nameExists = await Product.nameExists(name);
    if (nameExists) {
        return sendBadRequest(res, 'A product with this name already exists');
    }
    
    // Validate category IDs
    const validCategories = await Category.validateIds(categoryIds);
    if (!validCategories) {
        return sendBadRequest(res, 'One or more category IDs are invalid');
    }
    
    const product = await Product.create({
        name,
        description,
        quantity,
        categoryIds
    });
    
    sendCreated(res, product, 'Product created successfully');
});

// Update product
const updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, description, quantity, categoryIds } = req.body;
    
    // Check if product exists
    const existingProduct = await Product.getById(id);
    if (!existingProduct) {
        return sendNotFound(res, 'Product not found');
    }
    
    // Check if product name already exists (excluding current product)
    const nameExists = await Product.nameExists(name, id);
    if (nameExists) {
        return sendBadRequest(res, 'A product with this name already exists');
    }
    
    // Validate category IDs
    const validCategories = await Category.validateIds(categoryIds);
    if (!validCategories) {
        return sendBadRequest(res, 'One or more category IDs are invalid');
    }
    
    const product = await Product.update(id, {
        name,
        description,
        quantity,
        categoryIds
    });
    
    if (!product) {
        return sendNotFound(res, 'Product not found');
    }
    
    sendSuccess(res, product, 'Product updated successfully');
});

// Delete product
const deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    // Check if product exists
    const existingProduct = await Product.getById(id);
    if (!existingProduct) {
        return sendNotFound(res, 'Product not found');
    }
    
    const deleted = await Product.delete(id);
    
    if (!deleted) {
        return sendNotFound(res, 'Product not found');
    }
    
    sendNoContent(res, 'Product deleted successfully');
});

// Get product statistics
const getProductStats = catchAsync(async (req, res) => {
    const stats = await Product.getStats();
    sendSuccess(res, stats, 'Product statistics retrieved successfully');
});

// Search products by name (for autocomplete)
const searchProducts = catchAsync(async (req, res) => {
    const { q, limit } = req.query;
    
    if (!q || q.trim().length === 0) {
        return sendBadRequest(res, 'Search query is required');
    }
    
    const products = await Product.searchByName(q.trim(), parseInt(limit) || 10);
    sendSuccess(res, products, 'Search results retrieved successfully');
});

// Bulk delete products
const bulkDeleteProducts = catchAsync(async (req, res) => {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return sendBadRequest(res, 'Product IDs array is required');
    }
    
    const results = [];
    let deletedCount = 0;
    
    for (const id of ids) {
        try {
            const deleted = await Product.delete(id);
            if (deleted) {
                deletedCount++;
            }
            results.push({ id, deleted });
        } catch (error) {
            results.push({ id, deleted: false, error: error.message });
        }
    }
    
    sendSuccess(res, {
        deletedCount,
        totalRequested: ids.length,
        results
    }, `${deletedCount} products deleted successfully`);
});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStats,
    searchProducts,
    bulkDeleteProducts
};

