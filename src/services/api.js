import axios from 'axios';

const normalizeUrl = (raw) => {
  let url = String(raw || '')
    .replace(/[[\]"']/g, '')
    .trim()
    .replace(/\/+$/, '');

  if (!url) return '';

  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  if (!/\/api\/v\d+$/i.test(url)) url = `${url}/api/v1`;

  return url;
};

const baseURL =
  normalizeUrl(import.meta.env.VITE_API_URL) ||
  normalizeUrl(import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
