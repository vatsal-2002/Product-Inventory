const { executeStoredProcedure, executeQuery } = require('../config/database');

class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.quantity = data.quantity;
        this.categories = data.categories;
        this.category_ids = data.category_ids;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Get all products with filters and pagination
    static async getAll(filters = {}) {
        const { search = '', categoryIds = [], page = 1, limit = 10 } = filters;
        
        // Convert categoryIds array to comma-separated string
        const categoryIdsString = categoryIds.length > 0 ? categoryIds.join(',') : null;
        
        const result = await executeStoredProcedure('GetProductsWithFilters', [
            search || null,
            categoryIdsString,
            page,
            limit
        ]);

        if (!result.success) {
            throw new Error(result.error);
        }

        const products = result.data.map(product => {
            // Parse categories and category_ids
            const categories = product.categories ? product.categories.split(',') : [];
            const category_ids = product.category_ids ? product.category_ids.split(',').map(id => parseInt(id)) : [];
            
            return new Product({
                ...product,
                categories,
                category_ids
            });
        });

        // Calculate pagination info
        const totalCount = result.data.length > 0 ? result.data[0].total_count : 0;
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage,
                hasPrevPage
            }
        };
    }

    // Get product by ID
    static async getById(id) {
        const result = await executeQuery(
            `SELECT 
                p.id,
                p.name,
                p.description,
                p.quantity,
                p.created_at,
                p.updated_at,
                GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ',') as categories,
                GROUP_CONCAT(DISTINCT c.id ORDER BY c.name SEPARATOR ',') as category_ids
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            WHERE p.id = ?
            GROUP BY p.id`,
            [id]
        );

        if (!result.success) {
            throw new Error(result.error);
        }

        if (result.data.length === 0) {
            return null;
        }

        const product = result.data[0];
        const categories = product.categories ? product.categories.split(',') : [];
        const category_ids = product.category_ids ? product.category_ids.split(',').map(id => parseInt(id)) : [];

        return new Product({
            ...product,
            categories,
            category_ids
        });
    }

    // Create new product
    static async create(productData) {
        const { name, description, quantity, categoryIds } = productData;
        
        // Convert categoryIds array to comma-separated string
        const categoryIdsString = categoryIds.join(',');
        
        const result = await executeStoredProcedure('CreateProduct', [
            name,
            description || '',
            quantity,
            categoryIdsString
        ]);

        if (!result.success) {
            throw new Error(result.error);
        }

        if (result.data.length === 0) {
            throw new Error('Failed to create product');
        }

        const product = result.data[0];
        const categories = product.categories ? product.categories.split(',') : [];
        const category_ids = product.category_ids ? product.category_ids.split(',').map(id => parseInt(id)) : [];

        return new Product({
            ...product,
            categories,
            category_ids
        });
    }

    // Update product
    static async update(id, productData) {
        const { name, description, quantity, categoryIds } = productData;
        
        // Convert categoryIds array to comma-separated string
        const categoryIdsString = categoryIds.join(',');
        
        const result = await executeStoredProcedure('UpdateProduct', [
            id,
            name,
            description || '',
            quantity,
            categoryIdsString
        ]);

        if (!result.success) {
            throw new Error(result.error);
        }

        if (result.data.length === 0) {
            return null;
        }

        const product = result.data[0];
        const categories = product.categories ? product.categories.split(',') : [];
        const category_ids = product.category_ids ? product.category_ids.split(',').map(id => parseInt(id)) : [];

        return new Product({
            ...product,
            categories,
            category_ids
        });
    }

    // Delete product
    static async delete(id) {
        const result = await executeStoredProcedure('DeleteProduct', [id]);

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.data[0]?.affected_rows > 0;
    }

    // Check if product name exists (for validation)
    static async nameExists(name, excludeId = null) {
        let query = 'SELECT id FROM products WHERE name = ?';
        let params = [name];

        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }

        const result = await executeQuery(query, params);

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.data.length > 0;
    }

    // Get product statistics
    static async getStats() {
        const result = await executeQuery(`
            SELECT 
                COUNT(*) as total_products,
                SUM(quantity) as total_quantity,
                AVG(quantity) as avg_quantity,
                MIN(quantity) as min_quantity,
                MAX(quantity) as max_quantity
            FROM products
        `);

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.data[0];
    }

    // Search products by name (for autocomplete)
    static async searchByName(searchTerm, limit = 10) {
        const result = await executeQuery(
            'SELECT id, name FROM products WHERE name LIKE ? ORDER BY name LIMIT ?',
            [`%${searchTerm}%`, limit]
        );

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.data;
    }
}

module.exports = Product;

