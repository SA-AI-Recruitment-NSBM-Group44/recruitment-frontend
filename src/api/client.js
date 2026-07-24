import axios from 'axios';

// One axios instance for the whole app with fallback base URL and default headers.
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach the JWT token to every outgoing request automatically if present in LocalStorage.
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('recruitai_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor for handling responses & expired token errors (401 Unauthorized)
client.interceptors.response.use(
    (response) => response,
    (error) => {
        // If token is expired or invalid (401), clear it and redirect to login page (except login/auth requests)
        if (error.response?.status === 401 && !error.config.url.includes('/api/auth/')) {
            localStorage.removeItem('recruitai_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default client;