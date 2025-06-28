const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStats,
    searchProducts,
    bulkDeleteProducts
} = require('../controllers/productController');
const { 
    productSchemas, 
    validate, 
    validateQuery, 
    validateParams 
} = require('../utils/validation');

const router = express.Router();

// GET /api/products - Get all products with filters and pagination
router.get('/', 
    validateQuery(productSchemas.query),
    getAllProducts
);

// GET /api/products/search - Search products by name
router.get('/search', searchProducts);

// GET /api/products/stats - Get product statistics
router.get('/stats', getProductStats);

// GET /api/products/:id - Get product by ID
router.get('/:id', 
    validateParams(productSchemas.id),
    getProductById
);

// POST /api/products - Create new product
router.post('/', 
    validate(productSchemas.create),
    createProduct
);

// PUT /api/products/:id - Update product
router.put('/:id', 
    validateParams(productSchemas.id),
    validate(productSchemas.update),
    updateProduct
);

// DELETE /api/products/:id - Delete product
router.delete('/:id', 
    validateParams(productSchemas.id),
    deleteProduct
);

// POST /api/products/bulk-delete - Bulk delete products
router.post('/bulk-delete', bulkDeleteProducts);

module.exports = router;

