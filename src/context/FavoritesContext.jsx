import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchFavorites = async () => {
    if (!user) { setFavorites([]); return; }
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data.data.favorites);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchFavorites(); }, [user]);

  const toggleFavorite = async (product) => {
    if (!user) { toast.error('Iltimos, avval tizimga kiring!'); return; }
    try {
      const res = await api.post('/favorites', { productId: product.id });
      if (res.data.message === 'Removed from favorites') {
        toast.info('Yoqtirganlardan olib tashlandi');
      } else {
        toast.success("Yoqtirganlar ro'yxatiga qo'shildi");
      }
      fetchFavorites();
    } catch (e) { toast.error('Xatolik yuz berdi'); }
  };

  const isFavorite = (productId) => favorites.some(f => f.productId === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
