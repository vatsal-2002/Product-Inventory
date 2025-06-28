const express = require('express');
const {
    getAllCategories,
    getCategoriesWithCount,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories
} = require('../controllers/categoryController');
const Joi = require('joi');
const { validate, validateParams } = require('../utils/validation');

const router = express.Router();

// Category validation schemas
const categorySchemas = {
    create: Joi.object({
        name: Joi.string()
            .trim()
            .min(1)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Category name is required',
                'string.min': 'Category name must be at least 1 character long',
                'string.max': 'Category name must not exceed 100 characters',
                'any.required': 'Category name is required'
            }),
        description: Joi.string()
            .trim()
            .allow('')
            .max(500)
            .messages({
                'string.max': 'Description must not exceed 500 characters'
            })
    }),

    update: Joi.object({
        name: Joi.string()
            .trim()
            .min(1)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Category name is required',
                'string.min': 'Category name must be at least 1 character long',
                'string.max': 'Category name must not exceed 100 characters',
                'any.required': 'Category name is required'
            }),
        description: Joi.string()
            .trim()
            .allow('')
            .max(500)
            .messages({
                'string.max': 'Description must not exceed 500 characters'
            })
    }),

    id: Joi.object({
        id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'ID must be a number',
                'number.integer': 'ID must be an integer',
                'number.positive': 'ID must be positive',
                'any.required': 'ID is required'
            })
    })
};

// GET /api/categories - Get all categories
router.get('/', getAllCategories);

// GET /api/categories/with-count - Get categories with product count
router.get('/with-count', getCategoriesWithCount);

// GET /api/categories/search - Search categories by name
router.get('/search', searchCategories);

// GET /api/categories/:id - Get category by ID
router.get('/:id', 
    validateParams(categorySchemas.id),
    getCategoryById
);

// POST /api/categories - Create new category
router.post('/', 
    validate(categorySchemas.create),
    createCategory
);

// PUT /api/categories/:id - Update category
router.put('/:id', 
    validateParams(categorySchemas.id),
    validate(categorySchemas.update),
    updateCategory
);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', 
    validateParams(categorySchemas.id),
    deleteCategory
);

module.exports = router;

