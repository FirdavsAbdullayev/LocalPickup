import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/me')
        .then(res => setUser(res.data.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (emailOrCredentials, passwordParam) => {
    try {
      const payload = typeof emailOrCredentials === 'object'
        ? emailOrCredentials
        : { email: emailOrCredentials, password: passwordParam };

      const res = await api.post('/users/login', payload);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data.user);
      toast.success(`Xush kelibsiz, ${res.data.data.user.fullName}!`);
      return res.data.data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kirish muvaffaqiyatsiz.');
      return false;
    }
  };

  const register = async (data) => {
    try {
      const res = await api.post('/users/register', data);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data.user);
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Ro'yxatdan o'tish muvaffaqiyatsiz.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Tizimdan chiqildi.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
