# Product Inventory System API Documentation

## Overview

The Product Inventory System API provides a comprehensive set of endpoints for managing products and categories in an inventory management system. Built with Node.js, Express.js, and MySQL, it follows RESTful principles and includes proper validation, error handling, and pagination.

## Base URL

```
http://localhost:5000
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Window**: 15 minutes
- **Max Requests**: 100 per IP address
- **Headers**: Rate limit information is included in response headers

## Endpoints

### Health Check

#### GET /health
Check if the server is running and healthy.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "development"
}
```

### API Documentation

#### GET /api/docs
Get comprehensive API documentation with all available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "API Documentation",
  "version": "1.0.0",
  "baseUrl": "http://localhost:5000",
  "endpoints": { ... }
}
```

## Products API

### Get All Products

#### GET /api/products

Retrieve all products with optional filtering and pagination.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 10, max: 100) |
| search | string | No | Search by product name |
| categoryIds | string | No | Comma-separated category IDs |

**Example Request:**
```
GET /api/products?page=1&limit=10&search=iPhone&categoryIds=1,2
```

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "iPhone 14",
      "description": "Latest Apple smartphone",
      "quantity": 50,
      "categories": ["Electronics"],
      "category_ids": [1],
      "created_at": "2024-01-01T12:00:00.000Z",
      "updated_at": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1,
    "limit": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Get Product by ID

#### GET /api/products/:id

Retrieve a specific product by its ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Product ID |

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "iPhone 14",
    "description": "Latest Apple smartphone",
    "quantity": 50,
    "categories": ["Electronics"],
    "category_ids": [1],
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### Create Product

#### POST /api/products

Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "quantity": 100,
  "categoryIds": [1, 2]
}
```

**Validation Rules:**
- `name`: Required, 1-255 characters, must be unique
- `description`: Optional, max 1000 characters
- `quantity`: Required, integer, minimum 0
- `categoryIds`: Required, array of valid category IDs, minimum 1 category

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 2,
    "name": "Product Name",
    "description": "Product description",
    "quantity": 100,
    "categories": ["Electronics", "Gadgets"],
    "category_ids": [1, 2],
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### Update Product

#### PUT /api/products/:id

Update an existing product.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Product ID |

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "description": "Updated description",
  "quantity": 150,
  "categoryIds": [1, 3]
}
```

**Validation Rules:**
Same as create product, but name uniqueness excludes the current product.

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Product Name",
    "description": "Updated description",
    "quantity": 150,
    "categories": ["Electronics", "Mobile"],
    "category_ids": [1, 3],
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T13:00:00.000Z"
  }
}
```

### Delete Product

#### DELETE /api/products/:id

Delete a product by its ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Product ID |

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Search Products

#### GET /api/products/search

Search products by name for autocomplete functionality.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query |
| limit | integer | No | Maximum results (default: 10) |

**Response:**
```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "iPhone 14"
    }
  ]
}
```

### Get Product Statistics

#### GET /api/products/stats

Get statistical information about products.

**Response:**
```json
{
  "success": true,
  "message": "Product statistics retrieved successfully",
  "data": {
    "total_products": 25,
    "total_quantity": 1250,
    "avg_quantity": 50,
    "min_quantity": 0,
    "max_quantity": 500
  }
}
```

### Bulk Delete Products

#### POST /api/products/bulk-delete

Delete multiple products at once.

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 products deleted successfully",
  "data": {
    "deletedCount": 2,
    "totalRequested": 3,
    "results": [
      { "id": 1, "deleted": true },
      { "id": 2, "deleted": true },
      { "id": 3, "deleted": false, "error": "Product not found" }
    ]
  }
}
```

## Categories API

### Get All Categories

#### GET /api/categories

Retrieve all categories.

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and gadgets",
      "created_at": "2024-01-01T12:00:00.000Z",
      "updated_at": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Get Categories with Product Count

#### GET /api/categories/with-count

Retrieve all categories with the count of products in each category.

**Response:**
```json
{
  "success": true,
  "message": "Categories with product count retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and gadgets",
      "product_count": 15,
      "created_at": "2024-01-01T12:00:00.000Z",
      "updated_at": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Get Category by ID

#### GET /api/categories/:id

Retrieve a specific category by its ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Category ID |

**Response:**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### Create Category

#### POST /api/categories

Create a new category.

**Request Body:**
```json
{
  "name": "Category Name",
  "description": "Category description"
}
```

**Validation Rules:**
- `name`: Required, 1-100 characters, must be unique
- `description`: Optional, max 500 characters

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 2,
    "name": "Category Name",
    "description": "Category description",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### Update Category

#### PUT /api/categories/:id

Update an existing category.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Category ID |

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Category Name",
    "description": "Updated description",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T13:00:00.000Z"
  }
}
```

### Delete Category

#### DELETE /api/categories/:id

Delete a category by its ID. Note: Categories that are being used by products cannot be deleted.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Category ID |

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Response (if category is in use):**
```json
{
  "success": false,
  "message": "Cannot delete category that is being used by products"
}
```

### Search Categories

#### GET /api/categories/search

Search categories by name for autocomplete functionality.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query |
| limit | integer | No | Maximum results (default: 10) |

**Response:**
```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Electronics"
    }
  ]
}
```

## Database Schema

### Products Table
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Product Categories Junction Table
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

## Stored Procedures

The API uses several stored procedures for optimized database operations:

1. **GetProductsWithFilters** - Retrieves products with pagination and filtering
2. **CreateProduct** - Creates a product with categories
3. **UpdateProduct** - Updates a product and its categories
4. **DeleteProduct** - Deletes a product and its category associations
5. **GetAllCategories** - Retrieves all categories

## Error Handling

The API implements comprehensive error handling:

### Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Product name is required"
    }
  ]
}
```

### Database Errors
- Duplicate key errors are handled gracefully
- Foreign key constraint violations are caught
- Connection errors are properly managed

### Rate Limiting
When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Best Practices

1. **Always validate input data** before sending requests
2. **Handle errors gracefully** in your client application
3. **Use pagination** for large datasets
4. **Implement proper error handling** for network issues
5. **Cache category data** as it changes infrequently
6. **Use search endpoints** for autocomplete functionality
7. **Respect rate limits** to avoid being blocked

## Testing

Use the provided Postman collection to test all endpoints. The collection includes:
- Pre-configured base URL variable
- Sample request bodies
- Comprehensive test coverage for all endpoints

## Support

For issues or questions regarding the API, please refer to the source code or contact the development team.

