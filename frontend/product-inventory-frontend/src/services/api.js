import axios from 'axios';
import toast from 'react-hot-toast';

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add any auth tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            const { status, data } = error.response;
            
            switch (status) {
                case 400:
                    toast.error(data.message || 'Bad request');
                    break;
                case 401:
                    toast.error('Unauthorized access');
                    break;
                case 403:
                    toast.error('Access forbidden');
                    break;
                case 404:
                    toast.error(data.message || 'Resource not found');
                    break;
                case 409:
                    toast.error(data.message || 'Conflict occurred');
                    break;
                case 429:
                    toast.error('Too many requests. Please try again later.');
                    break;
                case 500:
                    toast.error('Internal server error');
                    break;
                default:
                    toast.error(data.message || 'An error occurred');
            }
        } else if (error.request) {
            toast.error('Network error. Please check your connection.');
        } else {
            toast.error('An unexpected error occurred');
        }
        
        return Promise.reject(error);
    }
);

export default api;

