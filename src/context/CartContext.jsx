import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!user) { setCartItems([]); return; }
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.data.cart);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (product) => {
    if (!user) { toast.error('Iltimos, avval tizimga kiring!'); return; }
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 });
      toast.success("Savatga muvaffaqiyatli qo'shildi");
      fetchCart();
    } catch (e) { toast.error('Xatolik yuz berdi'); }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await api.patch(`/cart/${cartItemId}`, { quantity });
      fetchCart();
    } catch (e) { console.error(e); }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      toast.info('Savatdan olib tashlandi');
      fetchCart();
    } catch (e) { toast.error('Xatolik yuz berdi'); }
  };

  const clearCart = async () => {
    try {
      if (cartItems.length > 0) await api.delete('/cart');
      setCartItems([]);
    } catch (e) { console.error(e); }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
