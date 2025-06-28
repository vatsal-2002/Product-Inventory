# Database Schema Documentation

## Overview

The Product Inventory System uses a MySQL database with a well-designed relational schema that supports efficient product and category management. The database includes stored procedures for optimized operations and proper indexing for performance.

## Database Design Principles

- **Normalization**: The schema follows 3NF (Third Normal Form) to eliminate data redundancy
- **Referential Integrity**: Foreign key constraints ensure data consistency
- **Performance Optimization**: Strategic indexing for frequently queried columns
- **Scalability**: Designed to handle large datasets efficiently
- **Data Integrity**: Constraints and validation rules prevent invalid data

## Tables

### 1. products

Stores the main product information.

```sql
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
```

**Columns:**
- `id`: Primary key, auto-incrementing integer
- `name`: Product name, unique constraint for business rule
- `description`: Optional product description
- `quantity`: Current stock quantity, defaults to 0
- `created_at`: Timestamp when record was created
- `updated_at`: Timestamp when record was last modified

**Indexes:**
- `PRIMARY KEY (id)`: Clustered index for primary key
- `UNIQUE KEY (name)`: Ensures product name uniqueness
- `INDEX idx_name (name)`: Optimizes name-based searches
- `INDEX idx_created_at (created_at)`: Optimizes date-based queries

**Constraints:**
- `name` must be unique across all products
- `quantity` cannot be negative (enforced at application level)

### 2. categories

Stores product categories for classification.

```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Primary key, auto-incrementing integer
- `name`: Category name, unique constraint
- `description`: Optional category description
- `created_at`: Timestamp when record was created
- `updated_at`: Timestamp when record was last modified

**Constraints:**
- `name` must be unique across all categories
- `name` length limited to 100 characters for UI consistency

### 3. product_categories

Junction table implementing many-to-many relationship between products and categories.

```sql
CREATE TABLE product_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_category (product_id, category_id)
);
```

**Columns:**
- `id`: Primary key, auto-incrementing integer
- `product_id`: Foreign key referencing products table
- `category_id`: Foreign key referencing categories table
- `created_at`: Timestamp when association was created

**Indexes:**
- `PRIMARY KEY (id)`: Clustered index for primary key
- `UNIQUE KEY unique_product_category (product_id, category_id)`: Prevents duplicate associations
- `INDEX idx_product_categories_product_id (product_id)`: Optimizes product-based queries
- `INDEX idx_product_categories_category_id (category_id)`: Optimizes category-based queries

**Foreign Key Constraints:**
- `product_id` references `products(id)` with CASCADE delete
- `category_id` references `categories(id)` with CASCADE delete

## Relationships

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────────────┐         ┌─────────────┐
│  products   │         │  product_categories │         │ categories  │
├─────────────┤         ├─────────────────────┤         ├─────────────┤
│ id (PK)     │◄────────┤ product_id (FK)     │         │ id (PK)     │
│ name        │         │ category_id (FK)    ├────────►│ name        │
│ description │         │ id (PK)             │         │ description │
│ quantity    │         │ created_at          │         │ created_at  │
│ created_at  │         └─────────────────────┘         │ updated_at  │
│ updated_at  │                                         └─────────────┘
└─────────────┘
```

### Relationship Types

1. **Products ↔ Categories**: Many-to-Many
   - One product can belong to multiple categories
   - One category can contain multiple products
   - Implemented via `product_categories` junction table

## Stored Procedures

### 1. GetProductsWithFilters

Retrieves products with pagination, search, and category filtering.

```sql
CALL GetProductsWithFilters(
    IN p_search VARCHAR(255),      -- Search term for product name
    IN p_category_ids TEXT,        -- Comma-separated category IDs
    IN p_page INT,                 -- Page number
    IN p_limit INT                 -- Items per page
);
```

**Features:**
- Dynamic filtering by product name
- Category-based filtering with OR logic
- Pagination with offset calculation
- Total count for pagination metadata
- Optimized with temporary tables

**Returns:**
- Product details with aggregated categories
- Total count for pagination
- Efficient single-query execution

### 2. CreateProduct

Creates a new product with category associations.

```sql
CALL CreateProduct(
    IN p_name VARCHAR(255),        -- Product name
    IN p_description TEXT,         -- Product description
    IN p_quantity INT,             -- Initial quantity
    IN p_category_ids TEXT         -- Comma-separated category IDs
);
```

**Features:**
- Transactional operation ensuring data consistency
- Automatic category association parsing
- Error handling with rollback on failure
- Returns created product with categories

### 3. UpdateProduct

Updates an existing product and its category associations.

```sql
CALL UpdateProduct(
    IN p_product_id INT,           -- Product ID to update
    IN p_name VARCHAR(255),        -- New product name
    IN p_description TEXT,         -- New description
    IN p_quantity INT,             -- New quantity
    IN p_category_ids TEXT         -- New category associations
);
```

**Features:**
- Complete category association replacement
- Transactional operation
- Maintains referential integrity
- Returns updated product data

### 4. DeleteProduct

Deletes a product and all its associations.

```sql
CALL DeleteProduct(
    IN p_product_id INT            -- Product ID to delete
);
```

**Features:**
- Cascading delete of category associations
- Transactional operation
- Returns affected row count

### 5. GetAllCategories

Retrieves all categories ordered by name.

```sql
CALL GetAllCategories();
```

**Features:**
- Simple category listing
- Alphabetical ordering
- Optimized for UI dropdown population

## Indexes and Performance

### Primary Indexes

1. **products.id**: Clustered index for primary key lookups
2. **categories.id**: Clustered index for primary key lookups
3. **product_categories.id**: Clustered index for junction table

### Secondary Indexes

1. **products.name**: Optimizes product name searches and uniqueness checks
2. **products.created_at**: Optimizes date-based sorting and filtering
3. **product_categories.product_id**: Optimizes product-to-category lookups
4. **product_categories.category_id**: Optimizes category-to-product lookups

### Unique Constraints

1. **products.name**: Ensures business rule of unique product names
2. **categories.name**: Ensures unique category names
3. **product_categories(product_id, category_id)**: Prevents duplicate associations

## Data Integrity Rules

### Business Rules

1. **Product Names**: Must be unique across the system
2. **Category Names**: Must be unique across the system
3. **Product Quantity**: Cannot be negative (enforced at application level)
4. **Category Association**: Each product must have at least one category

### Database Constraints

1. **Foreign Key Constraints**: Maintain referential integrity
2. **Unique Constraints**: Prevent duplicate data
3. **NOT NULL Constraints**: Ensure required fields are populated
4. **CASCADE Deletes**: Maintain consistency when deleting records

## Sample Data

The database includes sample data for testing and demonstration:

### Categories (10 items)
- Electronics
- Clothing
- Books
- Home & Garden
- Sports
- Toys
- Food & Beverages
- Health & Beauty
- Automotive
- Office Supplies

### Products (5 items)
- iPhone 14 (Electronics)
- Nike Running Shoes (Clothing, Sports)
- JavaScript Programming Book (Books)
- Garden Hose (Home & Garden)
- Basketball (Sports, Toys)

## Performance Considerations

### Query Optimization

1. **Indexed Searches**: All search operations use appropriate indexes
2. **Stored Procedures**: Reduce network round trips and optimize execution plans
3. **Pagination**: Efficient LIMIT/OFFSET implementation
4. **JOIN Optimization**: Proper join order and index usage

### Scalability Features

1. **Connection Pooling**: Efficient database connection management
2. **Prepared Statements**: Prevent SQL injection and improve performance
3. **Batch Operations**: Bulk operations for better throughput
4. **Caching Strategy**: Application-level caching for frequently accessed data

## Security Measures

### SQL Injection Prevention

1. **Parameterized Queries**: All user inputs are parameterized
2. **Stored Procedures**: Reduce attack surface
3. **Input Validation**: Server-side validation before database operations

### Access Control

1. **Database User Permissions**: Principle of least privilege
2. **Connection Security**: Encrypted connections in production
3. **Audit Trail**: Timestamp tracking for all operations

## Backup and Recovery

### Backup Strategy

1. **Regular Backups**: Automated daily backups
2. **Point-in-Time Recovery**: Transaction log backups
3. **Testing**: Regular backup restoration testing

### Recovery Procedures

1. **Full Recovery**: Complete database restoration
2. **Partial Recovery**: Table-level restoration if needed
3. **Data Validation**: Post-recovery data integrity checks

## Migration and Versioning

### Schema Versioning

1. **Version Control**: Database schema changes tracked in version control
2. **Migration Scripts**: Automated schema updates
3. **Rollback Procedures**: Safe rollback mechanisms

### Data Migration

1. **Backward Compatibility**: Maintain compatibility during updates
2. **Data Transformation**: Handle data format changes
3. **Validation**: Ensure data integrity after migrations

## Monitoring and Maintenance

### Performance Monitoring

1. **Query Performance**: Monitor slow queries
2. **Index Usage**: Track index effectiveness
3. **Connection Monitoring**: Monitor connection pool usage

### Maintenance Tasks

1. **Index Maintenance**: Regular index optimization
2. **Statistics Updates**: Keep query optimizer statistics current
3. **Space Management**: Monitor and manage database growth

## Troubleshooting

### Common Issues

1. **Duplicate Key Errors**: Check unique constraints
2. **Foreign Key Violations**: Verify referential integrity
3. **Performance Issues**: Check index usage and query plans

### Diagnostic Queries

```sql
-- Check table sizes
SELECT 
    table_name,
    table_rows,
    data_length,
    index_length
FROM information_schema.tables 
WHERE table_schema = 'product_inventory';

-- Check index usage
SHOW INDEX FROM products;
SHOW INDEX FROM categories;
SHOW INDEX FROM product_categories;

-- Check foreign key constraints
SELECT 
    constraint_name,
    table_name,
    column_name,
    referenced_table_name,
    referenced_column_name
FROM information_schema.key_column_usage 
WHERE table_schema = 'product_inventory' 
AND referenced_table_name IS NOT NULL;
```

This database schema provides a solid foundation for the Product Inventory System with excellent performance, scalability, and maintainability characteristics.

