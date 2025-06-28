# Product Inventory System

A full-stack web application for managing product inventory with a modern, responsive interface. Built with React, Node.js, Express.js, and MySQL.

## 🚀 Features

### Product Management
- ✅ Add new products with name, description, quantity, and categories
- ✅ Edit existing products with real-time validation
- ✅ Delete products with confirmation dialogs
- ✅ Bulk delete multiple products
- ✅ Unique product name validation
- ✅ Multi-category support for each product

### Advanced Search & Filtering
- ✅ Real-time search by product name
- ✅ Multi-select category filtering
- ✅ Combined search and filter functionality
- ✅ Clear all filters option
- ✅ Active filter display with individual removal

### Pagination & Performance
- ✅ Numbered pagination (1, 2, 3, ...)
- ✅ Configurable items per page
- ✅ Optimized database queries with stored procedures
- ✅ Efficient data loading with React Query

### User Interface
- ✅ Modern, responsive design with TailwindCSS
- ✅ Mobile-friendly interface
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Intuitive category selection with tags/bubbles
- ✅ Statistics dashboard

### Technical Features
- ✅ RESTful API with proper HTTP status codes
- ✅ Input validation (client-side and server-side)
- ✅ Error handling and user feedback
- ✅ Rate limiting and security headers
- ✅ CORS support for cross-origin requests
- ✅ Database connection pooling

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **React Hook Form** - Form handling and validation
- **Yup** - Schema validation
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **MySQL2** - MySQL client for Node.js
- **Joi** - Server-side validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Express Rate Limit** - Rate limiting middleware

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-restart
- **Postman** - API testing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **pnpm**
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd product-inventory-system
```

### 2. Database Setup

1. **Create MySQL Database:**
```sql
CREATE DATABASE product_inventory;
```

2. **Run Database Schema:**
```bash
mysql -u root -p product_inventory < database_schema.sql
```

This will create:
- Tables: `products`, `categories`, `product_categories`
- Stored procedures for optimized operations
- Sample data with 10 categories and 5 products

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

**Configure `.env` file:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=product_inventory

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Start the backend server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend/product-inventory-frontend

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The frontend application will start on `http://localhost:3000`

## 🎯 Usage

### Accessing the Application

1. **Frontend Interface:** `http://localhost:3000`
2. **Backend API:** `http://localhost:5000`
3. **API Documentation:** `http://localhost:5000/api/docs`
4. **Health Check:** `http://localhost:5000/health`

### Basic Operations

#### Adding a Product
1. Click the "Add Product" button
2. Fill in the product details:
   - **Name** (required, must be unique)
   - **Description** (optional)
   - **Quantity** (required, minimum 0)
   - **Categories** (required, select at least one)
3. Click "Create Product"

#### Searching and Filtering
1. Use the search bar to find products by name
2. Click "Filters" to open category filtering
3. Select multiple categories to filter products
4. Use "Clear All" to reset filters

#### Managing Products
- **Edit:** Click the edit icon on any product card
- **Delete:** Click the delete icon and confirm
- **View Statistics:** Click the "Statistics" button in the header

### API Testing

Use the provided Postman collection (`Product_Inventory_API.postman_collection.json`) to test all API endpoints:

1. Import the collection into Postman
2. Set the base URL variable to `http://localhost:5000`
3. Test all endpoints with sample data

## 📁 Project Structure

```
product-inventory-system/
├── backend/                          # Backend API
│   ├── config/
│   │   └── database.js              # Database configuration
│   ├── controllers/
│   │   ├── productController.js     # Product CRUD operations
│   │   └── categoryController.js    # Category CRUD operations
│   ├── middleware/
│   │   └── errorHandler.js          # Error handling middleware
│   ├── models/
│   │   ├── Product.js               # Product model
│   │   └── Category.js              # Category model
│   ├── routes/
│   │   ├── productRoutes.js         # Product API routes
│   │   └── categoryRoutes.js        # Category API routes
│   ├── utils/
│   │   ├── validation.js            # Validation schemas
│   │   └── response.js              # Response utilities
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Dependencies and scripts
│   └── server.js                    # Main server file
├── frontend/product-inventory-frontend/  # Frontend React app
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── forms/
│   │   │   │   └── ProductForm.jsx  # Product form component
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx       # Header component
│   │   │   │   └── Layout.jsx       # Main layout
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── ProductCard.jsx      # Product display card
│   │   │   ├── SearchFilters.jsx    # Search and filter component
│   │   │   ├── Pagination.jsx       # Pagination component
│   │   │   └── Statistics.jsx       # Statistics component
│   │   ├── pages/
│   │   │   └── ProductsPage.jsx     # Main products page
│   │   ├── services/
│   │   │   ├── api.js               # Axios configuration
│   │   │   ├── productService.js    # Product API calls
│   │   │   └── categoryService.js   # Category API calls
│   │   ├── utils/
│   │   │   ├── helpers.js           # Utility functions
│   │   │   └── validation.js        # Client-side validation
│   │   ├── App.jsx                  # Main App component
│   │   ├── App.css                  # Global styles
│   │   └── main.jsx                 # Entry point
│   ├── .env                         # Environment variables
│   ├── package.json                 # Dependencies and scripts
│   └── vite.config.js               # Vite configuration
├── database_schema.sql              # Database schema and sample data
├── API_Documentation.md             # Comprehensive API documentation
├── Product_Inventory_API.postman_collection.json  # Postman collection
└── README.md                        # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000                           # Server port
NODE_ENV=development                # Environment mode
DB_HOST=localhost                   # Database host
DB_PORT=3306                        # Database port
DB_USER=root                        # Database username
DB_PASSWORD=your_password           # Database password
DB_NAME=product_inventory           # Database name
CORS_ORIGIN=http://localhost:3000   # Frontend URL
RATE_LIMIT_WINDOW_MS=900000         # Rate limit window (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100         # Max requests per window
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api  # Backend API URL
VITE_APP_NAME=Product Inventory System       # App name
VITE_APP_VERSION=1.0.0                       # App version
```

### Database Configuration

The application uses MySQL with the following optimizations:
- **Connection Pooling:** Efficient database connections
- **Stored Procedures:** Optimized queries for complex operations
- **Indexes:** Performance optimization for searches
- **Foreign Key Constraints:** Data integrity

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Test all CRUD operations through the UI
3. Verify search and filtering functionality
4. Test pagination with large datasets
5. Verify responsive design on different screen sizes

### API Testing
1. Import the Postman collection
2. Test all endpoints with various scenarios:
   - Valid data
   - Invalid data
   - Edge cases
   - Error conditions

### Database Testing
1. Verify stored procedures work correctly
2. Test data integrity constraints
3. Check performance with large datasets

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Configure production database credentials
3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "inventory-api"
```

### Frontend Deployment
1. Build the production version:
```bash
pnpm run build
```
2. Serve the `dist` folder using a web server like Nginx or Apache
3. Update `VITE_API_BASE_URL` to point to production API

### Database Deployment
1. Set up MySQL on production server
2. Run the database schema script
3. Configure proper user permissions and security

## 🔒 Security Features

- **Input Validation:** Both client-side and server-side validation
- **SQL Injection Prevention:** Parameterized queries and stored procedures
- **Rate Limiting:** Prevents API abuse
- **CORS Configuration:** Controlled cross-origin access
- **Security Headers:** Helmet.js for security headers
- **Error Handling:** Prevents information leakage

## 📊 Performance Optimizations

- **Database Indexes:** Optimized query performance
- **Connection Pooling:** Efficient database connections
- **Stored Procedures:** Reduced database round trips
- **React Query:** Client-side caching and data synchronization
- **Pagination:** Efficient data loading
- **Debounced Search:** Reduced API calls during typing

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Ensure MySQL is running and credentials are correct in `.env`

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change the port in `.env` or kill the process using the port

#### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Verify `CORS_ORIGIN` in backend `.env` matches frontend URL

#### Module Not Found
```
Cannot resolve module 'xyz'
```
**Solution:** Run `npm install` or `pnpm install` to install dependencies

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will show detailed error messages and request logs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Code Style
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Development Team** - Initial work and ongoing maintenance

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **TailwindCSS** for utility-first CSS framework
- **React Query** for excellent data fetching
- **Express.js** for robust backend framework
- **MySQL** for reliable database management

## 📞 Support

For support, please:
1. Check the troubleshooting section
2. Review the API documentation
3. Test with the provided Postman collection
4. Contact the development team

---

**Happy Coding! 🎉**

