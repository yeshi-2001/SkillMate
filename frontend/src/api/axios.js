import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRedirecting = false;

// Add JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // Only redirect on auth errors, not on login/register routes
    if ((status === 401 || status === 422) && !isRedirecting) {
      const url = error.config?.url || '';
      // Don't redirect if we're already on login/register
      if (!url.includes('/login') && !url.includes('/register')) {
        isRedirecting = true;
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
