import { useCallback, useEffect, useState } from 'react';
import { CartContext, useAuth } from './contexts';
import { toast } from 'react-toastify';
import api from '../services/api';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.data.cart);
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }
      await fetchCart();
    };
    load();
  }, [user, fetchCart]);

  const addToCart = useCallback(
    async (product) => {
      if (!user) {
        toast.error('Iltimos, avval tizimga kiring!');
        return false;
      }
      try {
        await api.post('/cart', { productId: product.id, quantity: 1 });
        toast.success("Savatga qo'shildi");
        await fetchCart();
        return true;
      } catch {
        toast.error("Savatga qo'shib bo'lmadi. Qaytadan urinib ko'ring.");
        return false;
      }
    },
    [user, fetchCart]
  );

  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      try {
        await api.patch(`/cart/${cartItemId}`, { quantity });
        setCartItems((prev) => prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i)));
      } catch {
        toast.error('Miqdorni o\'zgartirib bo\'lmadi');
      }
    },
    []
  );

  const removeFromCart = useCallback(
    async (cartItemId) => {
      try {
        await api.delete(`/cart/${cartItemId}`);
        setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
        toast.info('Savatdan olib tashlandi');
      } catch {
        toast.error('Olib tashlab bo\'lmadi');
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    try {
      await api.delete('/cart');
    } catch {
      // Savat allaqachon bo'sh bo'lishi mumkin — xatosiz davom etamiz
    } finally {
      setCartItems([]);
    }
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
