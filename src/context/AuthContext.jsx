import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './contexts';
import { toast } from 'react-toastify';
import api from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await api.get('/users/me');
        if (active) setUser(res.data.data.user);
      } catch {
        localStorage.removeItem('token');
      }
    };

    restoreSession()
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const res = await api.post('/users/login', credentials);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data.user);
      toast.success(`Xush kelibsiz, ${res.data.data.user.fullName}!`);
      return res.data.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kirish muvaffaqiyatsiz. Qaytadan urinib ko\'ring.');
      return null;
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const res = await api.post('/users/register', payload);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data.user);
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      return res.data.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Tizimdan chiqildi.');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
