const { executeStoredProcedure, executeQuery } = require('../config/database');

class Category {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Get all categories
    static async getAll() {
        const result = await executeStoredProcedure('GetAllCategories');

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.data.map(category => new Category(category));
    }

    // Get category by ID
    static async getById(id) {
        const result = await executeQuery(
            'SELECT id, name, description, created_at, updated_at FROM categories WHERE id = ?',
            [id]
        );

        if (!result.success) {
            throw new Error(result.error);
        }

        if (result.data.length === 0) {
            return null;
        }

        return new Category(result.data[0]);
    }

    // Create new category
    static async create(categoryData) {
        const { name, description } = categoryData;
        
        const result = await executeQuery(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description || '']
        );

        if (!result.success) {
            throw new Error(result.error);
        }

        const insertId = result.data.insertId;
        return await Category.getById(insertId);
    }

    // Update category
    static async update(id, categoryData) {
        const { name, description } = categoryData;
        
        const result = await executeQuery(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [name, description || '', id]
        );

        if (!result.success) {
            throw new Error(result.error);
        }

        if (result.data.affectedRows === 0) {
            return null;
        }

        return await Category.getById(id);
    }

    // Delete category
    static async delete(id) {
        // Check if category is being used by any products
        const usageResult = await executeQuery(
            'SELECT COUNT(*) as count FROM product_categories WHERE category_id = ?',
            [id]
        );

        if (!usageResult.success) {
            throw new Error(usageResult.error);
        }

        if (usageResult.data[0].count > 0) {
            throw new Error('Cannot delete category that is being used by products');
        }

        const result = await executeQuery(
            'DELETE FROM categories WHERE id = ?',
            [id]
        );

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.data.affectedRows > 0;
    }

    // Check if category name exists (for validation)
    static async nameExists(name, excludeId = null) {
        let query = 'SELECT id FROM categories WHERE name = ?';
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

    // Get categories with product count
    static async getWithProductCount() {
        const result = await executeQuery(`
            SELECT 
                c.id,
                c.name,
                c.description,
                c.created_at,
                c.updated_at,
                COUNT(pc.product_id) as product_count
            FROM categories c
            LEFT JOIN product_categories pc ON c.id = pc.category_id
            GROUP BY c.id, c.name, c.description, c.created_at, c.updated_at
            ORDER BY c.name
        `);

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.data.map(category => ({
            ...new Category(category),
            product_count: category.product_count
        }));
    }

    // Validate category IDs exist
    static async validateIds(categoryIds) {
        if (!categoryIds || categoryIds.length === 0) {
            return false;
        }

        const placeholders = categoryIds.map(() => '?').join(',');
        const result = await executeQuery(
            `SELECT COUNT(*) as count FROM categories WHERE id IN (${placeholders})`,
            categoryIds
        );

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.data[0].count === categoryIds.length;
    }

    // Search categories by name
    static async searchByName(searchTerm, limit = 10) {
        const result = await executeQuery(
            'SELECT id, name FROM categories WHERE name LIKE ? ORDER BY name LIMIT ?',
            [`%${searchTerm}%`, limit]
        );

        if (!result.success) {
            throw new Error(result.error);
        }

        return result.data;
    }
}

module.exports = Category;

