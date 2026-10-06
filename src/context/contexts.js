import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);
export const CartContext = createContext(null);
export const FavoritesContext = createContext(null);

const ensure = (ctx, hookName) => {
  if (!ctx) throw new Error(`${hookName} must be used inside its matching Provider`);
  return ctx;
};

export const useAuth = () => ensure(useContext(AuthContext), 'useAuth');
export const useCart = () => ensure(useContext(CartContext), 'useCart');
export const useFavorites = () => ensure(useContext(FavoritesContext), 'useFavorites');
