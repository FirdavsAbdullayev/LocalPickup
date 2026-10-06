import axios from 'axios';

// 1. VITE_API_URL yoki VITE_API_BASE_URL ma'lumotlarini olish va zaxira havola
let envUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://renewed-success-production-b764.up.railway.app/api/v1';

// 2. To'rtburchak qavslar [...], tirnoqlar ' " va keraksiz bo'sh joylarni tozalash
if (envUrl) {
  envUrl = envUrl.replace(/[\[\]'"]/g, '').trim();

  if (!envUrl.endsWith('/api/v1')) {
    envUrl = envUrl.replace(/\/$/, '') + '/api/v1';
  }
}

const api = axios.create({
  baseURL: envUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor (JWT Token biriktirish)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (401 xatolikda tokenni o'chirish)
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