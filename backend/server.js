const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("dotenv").config();

// Import routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Import middleware
const {
  globalErrorHandler,
  handleNotFound,
} = require("./middleware/errorHandler");

// Import database
const { testConnection } = require("./config/database");

// Create Express app
const app = express();

// Trust proxy for rate limiting
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product Inventory System API",
    version: "1.0.0",
    documentation: "/api/docs",
    endpoints: {
      products: "/api/products",
      categories: "/api/categories",
      health: "/health",
    },
  });
});

// API documentation endpoint
app.get("/api/docs", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Documentation",
    version: "1.0.0",
    baseUrl: `${req.protocol}://${req.get("host")}`,
    endpoints: {
      products: {
        "GET /api/products": "Get all products with filters and pagination",
        "GET /api/products/:id": "Get product by ID",
        "POST /api/products": "Create new product",
        "PUT /api/products/:id": "Update product",
        "DELETE /api/products/:id": "Delete product",
        "GET /api/products/search": "Search products by name",
        "GET /api/products/stats": "Get product statistics",
        "POST /api/products/bulk-delete": "Bulk delete products",
      },
      categories: {
        "GET /api/categories": "Get all categories",
        "GET /api/categories/:id": "Get category by ID",
        "POST /api/categories": "Create new category",
        "PUT /api/categories/:id": "Update category",
        "DELETE /api/categories/:id": "Delete category",
        "GET /api/categories/search": "Search categories by name",
        "GET /api/categories/with-count": "Get categories with product count",
      },
    },
  });
});

// Handle unhandled routes
app.all("*", handleNotFound);

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error("❌ Failed to connect to database. Server not started.");
      process.exit(1);
    }

    // Start server
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();

module.exports = app;
