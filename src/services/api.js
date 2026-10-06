import axios from 'axios';

let envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
if (envUrl && !envUrl.endsWith('/api/v1')) {
  envUrl = envUrl.replace(/\/$/, '') + '/api/v1';
}

const api = axios.create({
  baseURL: envUrl,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
