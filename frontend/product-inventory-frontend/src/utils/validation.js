import * as yup from 'yup';

// Product validation schema
export const productSchema = yup.object({
    name: yup
        .string()
        .required('Product name is required')
        .min(1, 'Product name must be at least 1 character')
        .max(255, 'Product name must not exceed 255 characters')
        .trim(),
    
    description: yup
        .string()
        .max(1000, 'Description must not exceed 1000 characters')
        .trim(),
    
    quantity: yup
        .number()
        .required('Quantity is required')
        .integer('Quantity must be a whole number')
        .min(0, 'Quantity must be at least 0'),
    
    categoryIds: yup
        .array()
        .of(yup.number().positive('Invalid category'))
        .min(1, 'At least one category must be selected')
        .required('Categories are required')
});

// Category validation schema
export const categorySchema = yup.object({
    name: yup
        .string()
        .required('Category name is required')
        .min(1, 'Category name must be at least 1 character')
        .max(100, 'Category name must not exceed 100 characters')
        .trim(),
    
    description: yup
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
});

// Search validation schema
export const searchSchema = yup.object({
    search: yup
        .string()
        .max(255, 'Search term must not exceed 255 characters')
        .trim(),
    
    categoryIds: yup
        .array()
        .of(yup.number().positive('Invalid category')),
    
    page: yup
        .number()
        .integer('Page must be a whole number')
        .min(1, 'Page must be at least 1')
        .default(1),
    
    limit: yup
        .number()
        .integer('Limit must be a whole number')
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit must not exceed 100')
        .default(10)
});

// Validation helper functions
export const validateField = async (schema, field, value) => {
    try {
        await schema.validateAt(field, { [field]: value });
        return null;
    } catch (error) {
        return error.message;
    }
};

export const validateForm = async (schema, data) => {
    try {
        await schema.validate(data, { abortEarly: false });
        return { isValid: true, errors: {} };
    } catch (error) {
        const errors = {};
        error.inner.forEach(err => {
            errors[err.path] = err.message;
        });
        return { isValid: false, errors };
    }
};

// Custom validation rules
export const customValidations = {
    uniqueProductName: (existingNames = []) => {
        return yup
            .string()
            .test(
                'unique-name',
                'A product with this name already exists',
                function(value) {
                    if (!value) return true;
                    return !existingNames.includes(value.toLowerCase().trim());
                }
            );
    },
    
    uniqueCategoryName: (existingNames = []) => {
        return yup
            .string()
            .test(
                'unique-name',
                'A category with this name already exists',
                function(value) {
                    if (!value) return true;
                    return !existingNames.includes(value.toLowerCase().trim());
                }
            );
    }
};

