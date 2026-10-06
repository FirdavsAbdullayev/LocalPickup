import { useCallback, useEffect, useMemo, useState } from 'react';
import { FavoritesContext, useAuth } from './contexts';
import { toast } from 'react-toastify';
import api from '../services/api';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await api.get('/favorites');
      setFavorites(res.data.data.favorites);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }
      await fetchFavorites();
    };
    load();
  }, [user, fetchFavorites]);

  const toggleFavorite = useCallback(
    async (product) => {
      if (!user) {
        toast.error('Iltimos, avval tizimga kiring!');
        return;
      }
      try {
        const res = await api.post('/favorites', { productId: product.id });
        const removed = res.data.message === 'Removed from favorites';
        setFavorites((prev) =>
          removed
            ? prev.filter((f) => f.productId !== product.id)
            : [...prev, { productId: product.id, product }]
        );
        toast.info(removed ? 'Yoqtirganlardan olib tashlandi' : "Yoqtirganlar ro'yxatiga qo'shildi");
      } catch {
        toast.error('Xatolik yuz berdi');
      }
    },
    [user]
  );

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.productId)), [favorites]);
  const isFavorite = useCallback((productId) => favoriteIds.has(productId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
