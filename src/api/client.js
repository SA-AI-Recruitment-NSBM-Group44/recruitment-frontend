import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || 'https://localhost:7001';
const baseUrlClean = rawUrl.replace(/\/+$/, '').replace(/\/api$/, '');

const client = axios.create({
  baseURL: baseUrlClean,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('recruitai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/api/auth/')) {
      localStorage.removeItem('recruitai_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
