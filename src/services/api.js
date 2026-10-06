import axios from 'axios';

// 1. Vercel / .env dan kelayotgan o'zgaruvchini olish
let rawUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://renewed-success-production-b764.up.railway.app/api/v1';

// 2. Qavslar '[', ']', tirnoqlar va bo'shliqlarni tozalash
let cleanUrl = String(rawUrl)
  .replace(/[\[\]'"]/g, '') // '[' va ']' hamda tirnoqlarni olib tashlaydi
  .trim();

// 3. Agar oxirida /api/v1 bo'lmasa, qo'shib qo'yish
if (!cleanUrl.endsWith('/api/v1')) {
  cleanUrl = cleanUrl.replace(/\/$/, '') + '/api/v1';
}

console.log('🔗 Connecting to Backend API:', cleanUrl);

const api = axios.create({
  baseURL: cleanUrl, // Endi har doim https:// bilan boshlanadi va Vercel domeni qo'shilib ketmaydi
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (JWT Token uchun)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;