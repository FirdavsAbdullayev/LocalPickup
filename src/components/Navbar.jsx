import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ShoppingCart, Heart, Bell, Shield, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-indigo-600">
            <ShoppingBag className="h-7 w-7" />
            <span>LocalPickup</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/shops" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              Do'konlar
            </Link>
            {user && (
              <>
                <Link to="/cart" className="relative text-gray-500 hover:text-indigo-600 transition">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/favorites" className="relative text-gray-500 hover:text-red-500 transition">
                  <Heart className="h-6 w-6" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user.role === 'SUPER_ADMIN' && (
                  <Link to="/admin" className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition">
                    <Shield className="h-4 w-4" /> Admin
                  </Link>
                )}
                {user.role === 'VENDOR' && (
                  <Link to="/vendor/orders" className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition">
                    <Bell className="h-4 w-4" /> Buyurtmalar
                  </Link>
                )}
                {user.role === 'CUSTOMER' && (
                  <Link to="/my-orders" className="hidden md:block px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
                    Buyurtmalarim
                  </Link>
                )}
                <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">
                    {user.fullName?.split(' ')[0]}
                  </span>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition" title="Chiqish">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
                {/* Mobile menu btn */}
                <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                  {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition hidden md:block">Kirish</Link>
                <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition">
                  Ro'yxat
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && user && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
          <Link to="/shops" onClick={() => setOpen(false)} className="block py-2 text-gray-700 font-medium">Do'konlar</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="block py-2 text-gray-700 font-medium">Savat ({cartItems.length})</Link>
          <Link to="/favorites" onClick={() => setOpen(false)} className="block py-2 text-gray-700 font-medium">Yoqtirganlar ({favorites.length})</Link>
          {user.role === 'CUSTOMER' && <Link to="/my-orders" onClick={() => setOpen(false)} className="block py-2 text-gray-700 font-medium">Buyurtmalarim</Link>}
          {user.role === 'VENDOR' && <Link to="/vendor/orders" onClick={() => setOpen(false)} className="block py-2 text-yellow-700 font-medium">Buyurtmalar paneli</Link>}
          {user.role === 'SUPER_ADMIN' && <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-purple-700 font-medium">Admin panel</Link>}
          <button onClick={handleLogout} className="block py-2 text-red-600 font-medium w-full text-left">Chiqish</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
