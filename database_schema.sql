-- Product Inventory System Database Schema
-- MySQL Database with Stored Procedures

-- Create Database
CREATE DATABASE IF NOT EXISTS product_inventory;
USE product_inventory;

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_created_at (created_at)
);

-- Product Categories Junction Table (Many-to-Many)
CREATE TABLE product_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_category (product_id, category_id)
);

-- Indexes for better performance
CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX idx_product_categories_category_id ON product_categories(category_id);

-- Stored Procedures

-- 1. Get Products with Pagination and Filters
DELIMITER //
CREATE PROCEDURE GetProductsWithFilters(
    IN p_search VARCHAR(255),
    IN p_category_ids TEXT,
    IN p_page INT,
    IN p_limit INT
)
BEGIN
    DECLARE v_offset INT DEFAULT 0;
    DECLARE v_total_count INT DEFAULT 0;
    
    SET v_offset = (p_page - 1) * p_limit;
    
    -- Create temporary table for category filtering
    DROP TEMPORARY TABLE IF EXISTS temp_categories;
    CREATE TEMPORARY TABLE temp_categories (category_id INT);
    
    -- Parse category IDs if provided
    IF p_category_ids IS NOT NULL AND p_category_ids != '' THEN
        SET @sql = CONCAT('INSERT INTO temp_categories (category_id) VALUES (', REPLACE(p_category_ids, ',', '),('), ')');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    
    -- Get total count for pagination
    SELECT COUNT(DISTINCT p.id) INTO v_total_count
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN temp_categories tc ON pc.category_id = tc.category_id
    WHERE (p_search IS NULL OR p_search = '' OR p.name LIKE CONCAT('%', p_search, '%'))
    AND (p_category_ids IS NULL OR p_category_ids = '' OR tc.category_id IS NOT NULL);
    
    -- Get products with categories
    SELECT 
        p.id,
        p.name,
        p.description,
        p.quantity,
        p.created_at,
        p.updated_at,
        GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ',') as categories,
        GROUP_CONCAT(DISTINCT c.id ORDER BY c.name SEPARATOR ',') as category_ids,
        v_total_count as total_count
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN temp_categories tc ON pc.category_id = tc.category_id
    WHERE (p_search IS NULL OR p_search = '' OR p.name LIKE CONCAT('%', p_search, '%'))
    AND (p_category_ids IS NULL OR p_category_ids = '' OR tc.category_id IS NOT NULL)
    GROUP BY p.id, p.name, p.description, p.quantity, p.created_at, p.updated_at
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET v_offset;
    
    DROP TEMPORARY TABLE temp_categories;
END //

-- 2. Create Product with Categories
CREATE PROCEDURE CreateProduct(
    IN p_name VARCHAR(255),
    IN p_description TEXT,
    IN p_quantity INT,
    IN p_category_ids TEXT
)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_category_id INT;
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_len INT;
    DECLARE v_delim_pos INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Insert product
    INSERT INTO products (name, description, quantity)
    VALUES (p_name, p_description, p_quantity);
    
    SET v_product_id = LAST_INSERT_ID();
    
    -- Insert product categories if provided
    IF p_category_ids IS NOT NULL AND p_category_ids != '' THEN
        SET v_len = CHAR_LENGTH(p_category_ids);
        
        WHILE v_pos <= v_len DO
            SET v_delim_pos = LOCATE(',', p_category_ids, v_pos);
            
            IF v_delim_pos = 0 THEN
                SET v_delim_pos = v_len + 1;
            END IF;
            
            SET v_category_id = CAST(SUBSTRING(p_category_ids, v_pos, v_delim_pos - v_pos) AS UNSIGNED);
            
            IF v_category_id > 0 THEN
                INSERT IGNORE INTO product_categories (product_id, category_id)
                VALUES (v_product_id, v_category_id);
            END IF;
            
            SET v_pos = v_delim_pos + 1;
        END WHILE;
    END IF;
    
    COMMIT;
    
    -- Return the created product
    SELECT 
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
    WHERE p.id = v_product_id
    GROUP BY p.id;
END //

-- 3. Update Product with Categories
CREATE PROCEDURE UpdateProduct(
    IN p_product_id INT,
    IN p_name VARCHAR(255),
    IN p_description TEXT,
    IN p_quantity INT,
    IN p_category_ids TEXT
)
BEGIN
    DECLARE v_category_id INT;
    DECLARE v_pos INT DEFAULT 1;
    DECLARE v_len INT;
    DECLARE v_delim_pos INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update product
    UPDATE products 
    SET name = p_name, description = p_description, quantity = p_quantity
    WHERE id = p_product_id;
    
    -- Delete existing categories
    DELETE FROM product_categories WHERE product_id = p_product_id;
    
    -- Insert new categories if provided
    IF p_category_ids IS NOT NULL AND p_category_ids != '' THEN
        SET v_len = CHAR_LENGTH(p_category_ids);
        
        WHILE v_pos <= v_len DO
            SET v_delim_pos = LOCATE(',', p_category_ids, v_pos);
            
            IF v_delim_pos = 0 THEN
                SET v_delim_pos = v_len + 1;
            END IF;
            
            SET v_category_id = CAST(SUBSTRING(p_category_ids, v_pos, v_delim_pos - v_pos) AS UNSIGNED);
            
            IF v_category_id > 0 THEN
                INSERT IGNORE INTO product_categories (product_id, category_id)
                VALUES (p_product_id, v_category_id);
            END IF;
            
            SET v_pos = v_delim_pos + 1;
        END WHILE;
    END IF;
    
    COMMIT;
    
    -- Return the updated product
    SELECT 
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
    WHERE p.id = p_product_id
    GROUP BY p.id;
END //

-- 4. Delete Product
CREATE PROCEDURE DeleteProduct(IN p_product_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete product categories (cascade will handle this, but explicit for clarity)
    DELETE FROM product_categories WHERE product_id = p_product_id;
    
    -- Delete product
    DELETE FROM products WHERE id = p_product_id;
    
    COMMIT;
    
    SELECT ROW_COUNT() as affected_rows;
END //

-- 5. Get All Categories
CREATE PROCEDURE GetAllCategories()
BEGIN
    SELECT id, name, description, created_at, updated_at
    FROM categories
    ORDER BY name;
END //

DELIMITER ;

-- Sample Data Seeder
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Apparel and fashion items'),
('Books', 'Books and educational materials'),
('Home & Garden', 'Home improvement and gardening supplies'),
('Sports', 'Sports equipment and accessories'),
('Toys', 'Toys and games for children'),
('Food & Beverages', 'Food items and drinks'),
('Health & Beauty', 'Health and beauty products'),
('Automotive', 'Car parts and automotive accessories'),
('Office Supplies', 'Office and business supplies');

-- Sample Products
CALL CreateProduct('iPhone 14', 'Latest Apple smartphone with advanced features', 50, '1');
CALL CreateProduct('Nike Running Shoes', 'Comfortable running shoes for athletes', 30, '2,5');
CALL CreateProduct('JavaScript Programming Book', 'Comprehensive guide to JavaScript programming', 25, '3');
CALL CreateProduct('Garden Hose', 'Durable garden hose for watering plants', 15, '4');
CALL CreateProduct('Basketball', 'Official size basketball for outdoor play', 20, '5,6');

