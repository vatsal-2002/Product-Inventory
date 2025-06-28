// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Handle duplicate key error
const handleDuplicateKeyError = (error) => {
    if (error.code === 'ER_DUP_ENTRY') {
        const field = error.sqlMessage.match(/for key '(.+?)'/)?.[1] || 'field';
        const message = field.includes('name') 
            ? 'A product with this name already exists' 
            : 'Duplicate entry detected';
        return new AppError(message, 400);
    }
    return error;
};

// Handle foreign key constraint error
const handleForeignKeyError = (error) => {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return new AppError('Referenced record does not exist', 400);
    }
    return error;
};

// Handle validation errors
const handleValidationError = (error) => {
    if (error.code === 'ER_DATA_TOO_LONG') {
        return new AppError('Data too long for field', 400);
    }
    if (error.code === 'ER_BAD_NULL_ERROR') {
        return new AppError('Required field cannot be null', 400);
    }
    return error;
};

// Send error response in development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Send error response in production
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    } else {
        // Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong!'
        });
    }
};

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Handle specific MySQL errors
        error = handleDuplicateKeyError(error);
        error = handleForeignKeyError(error);
        error = handleValidationError(error);

        sendErrorProd(error, res);
    }
};

// Async error wrapper
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Handle unhandled routes
const handleNotFound = (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
};

module.exports = {
    AppError,
    globalErrorHandler,
    catchAsync,
    handleNotFound
};

