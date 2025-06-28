const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'product_inventory',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Execute query with error handling
const executeQuery = async (query, params = []) => {
    try {
        const [results] = await pool.execute(query, params);
        return { success: true, data: results };
    } catch (error) {
        console.error('Database query error:', error);
        return { success: false, error: error.message };
    }
};

// Execute stored procedure
const executeStoredProcedure = async (procedureName, params = []) => {
    try {
        const placeholders = params.map(() => '?').join(',');
        const query = `CALL ${procedureName}(${placeholders})`;
        const [results] = await pool.execute(query, params);
        return { success: true, data: results[0] || results };
    } catch (error) {
        console.error('Stored procedure error:', error);
        return { success: false, error: error.message };
    }
};

// Close database connection
const closeConnection = async () => {
    try {
        await pool.end();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
};

module.exports = {
    pool,
    testConnection,
    executeQuery,
    executeStoredProcedure,
    closeConnection
};

