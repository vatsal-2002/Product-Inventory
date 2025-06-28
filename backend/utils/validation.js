const Joi = require('joi');

// Product validation schemas
const productSchemas = {
    create: Joi.object({
        name: Joi.string()
            .trim()
            .min(1)
            .max(255)
            .required()
            .messages({
                'string.empty': 'Product name is required',
                'string.min': 'Product name must be at least 1 character long',
                'string.max': 'Product name must not exceed 255 characters',
                'any.required': 'Product name is required'
            }),
        description: Joi.string()
            .trim()
            .allow('')
            .max(1000)
            .messages({
                'string.max': 'Description must not exceed 1000 characters'
            }),
        quantity: Joi.number()
            .integer()
            .min(0)
            .required()
            .messages({
                'number.base': 'Quantity must be a number',
                'number.integer': 'Quantity must be an integer',
                'number.min': 'Quantity must be at least 0',
                'any.required': 'Quantity is required'
            }),
        categoryIds: Joi.array()
            .items(Joi.number().integer().positive())
            .min(1)
            .required()
            .messages({
                'array.base': 'Category IDs must be an array',
                'array.min': 'At least one category must be selected',
                'any.required': 'Categories are required'
            })
    }),

    update: Joi.object({
        name: Joi.string()
            .trim()
            .min(1)
            .max(255)
            .required()
            .messages({
                'string.empty': 'Product name is required',
                'string.min': 'Product name must be at least 1 character long',
                'string.max': 'Product name must not exceed 255 characters',
                'any.required': 'Product name is required'
            }),
        description: Joi.string()
            .trim()
            .allow('')
            .max(1000)
            .messages({
                'string.max': 'Description must not exceed 1000 characters'
            }),
        quantity: Joi.number()
            .integer()
            .min(0)
            .required()
            .messages({
                'number.base': 'Quantity must be a number',
                'number.integer': 'Quantity must be an integer',
                'number.min': 'Quantity must be at least 0',
                'any.required': 'Quantity is required'
            }),
        categoryIds: Joi.array()
            .items(Joi.number().integer().positive())
            .min(1)
            .required()
            .messages({
                'array.base': 'Category IDs must be an array',
                'array.min': 'At least one category must be selected',
                'any.required': 'Categories are required'
            })
    }),

    query: Joi.object({
        search: Joi.string()
            .trim()
            .allow('')
            .max(255)
            .messages({
                'string.max': 'Search term must not exceed 255 characters'
            }),
        categoryIds: Joi.array()
            .items(Joi.number().integer().positive())
            .messages({
                'array.base': 'Category IDs must be an array'
            }),
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
                'number.base': 'Page must be a number',
                'number.integer': 'Page must be an integer',
                'number.min': 'Page must be at least 1'
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .messages({
                'number.base': 'Limit must be a number',
                'number.integer': 'Limit must be an integer',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit must not exceed 100'
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

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        req.body = value;
        next();
    };
};

// Query validation middleware
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Query validation failed',
                errors
            });
        }

        req.query = value;
        next();
    };
};

// Params validation middleware
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Parameter validation failed',
                errors
            });
        }

        req.params = value;
        next();
    };
};

module.exports = {
    productSchemas,
    validate,
    validateQuery,
    validateParams
};

