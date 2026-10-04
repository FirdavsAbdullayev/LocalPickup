import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/users/me');
          setUser(res.data.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data.user);
      toast.success("Tizimga muvaffaqiyatli kirdingiz!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/users/register', userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data.user);
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info("Tizimdan chiqdingiz");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
