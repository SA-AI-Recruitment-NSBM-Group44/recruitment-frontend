import axios from 'axios';

// One axios instance for the whole app. Base URL comes from .env.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Attach the JWT to every request automatically.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('recruitai_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired/invalid token? Clear it and send the user back to login.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/api/auth/')) {
      localStorage.removeItem('recruitai_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default client;
