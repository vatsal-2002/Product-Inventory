// Success response utility
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Error response utility
const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};

// Paginated response utility
const sendPaginatedResponse = (res, data, pagination, message = 'Success') => {
    res.status(200).json({
        success: true,
        message,
        data,
        pagination
    });
};

// Created response utility
const sendCreated = (res, data, message = 'Resource created successfully') => {
    res.status(201).json({
        success: true,
        message,
        data
    });
};

// No content response utility
const sendNoContent = (res, message = 'Resource deleted successfully') => {
    res.status(200).json({
        success: true,
        message
    });
};

// Not found response utility
const sendNotFound = (res, message = 'Resource not found') => {
    res.status(404).json({
        success: false,
        message
    });
};

// Bad request response utility
const sendBadRequest = (res, message = 'Bad request', errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    res.status(400).json(response);
};

// Unauthorized response utility
const sendUnauthorized = (res, message = 'Unauthorized') => {
    res.status(401).json({
        success: false,
        message
    });
};

// Forbidden response utility
const sendForbidden = (res, message = 'Forbidden') => {
    res.status(403).json({
        success: false,
        message
    });
};

// Conflict response utility
const sendConflict = (res, message = 'Conflict') => {
    res.status(409).json({
        success: false,
        message
    });
};

// Too many requests response utility
const sendTooManyRequests = (res, message = 'Too many requests') => {
    res.status(429).json({
        success: false,
        message
    });
};

module.exports = {
    sendSuccess,
    sendError,
    sendPaginatedResponse,
    sendCreated,
    sendNoContent,
    sendNotFound,
    sendBadRequest,
    sendUnauthorized,
    sendForbidden,
    sendConflict,
    sendTooManyRequests
};

