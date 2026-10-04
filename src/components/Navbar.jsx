import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ShoppingCart, Heart, Bell } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LocalPickup</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/shops" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Do'konlar
            </Link>
            
            <Link to="/favorites" className="relative p-2 text-gray-600 hover:text-red-500 transition-colors">
              <Heart className="h-6 w-6" />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2 ml-4 border-l pl-4 border-gray-200">
                {user.role === 'shop_owner' && (
                  <Link to="/shop-reservations" className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition border border-yellow-200">
                    <Bell className="h-4 w-4" />
                    Buyurtmalar
                  </Link>
                )}
                {user.role === 'customer' && (
                  <Link to="/my-reservations" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
                    Bandlarim
                  </Link>
                )}
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-5 w-5 mr-1 text-gray-400" />
                  {user.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Chiqish
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Kirish
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
