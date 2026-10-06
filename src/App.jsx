import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopList from './pages/ShopList';
import ShopDetail from './pages/ShopDetail';
import CreateShop from './pages/CreateShop';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import MyOrders from './pages/MyOrders';
import VendorDashboard from './pages/vendor/VendorDashboard';
import AddProduct from './pages/vendor/AddProduct';
import AdminDashboard from './pages/admin/AdminDashboard';

import { FileQuestion } from 'lucide-react';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div className="h-20 w-20 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
      <FileQuestion className="h-10 w-10 stroke-[1.5]" />
    </div>
    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">404</h1>
    <p className="text-gray-500 text-lg">Sahifa topilmadi</p>
    <a href="/" className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-sm text-sm">
      Bosh sahifaga qaytish
    </a>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
              <div>
                <Navbar />
                <main>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/shops" element={<ShopList />} />
                    <Route path="/shops/:slug" element={<ShopDetail />} />

                    {/* Authenticated Customer / User Routes */}
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/favorites"
                      element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-orders"
                      element={
                        <ProtectedRoute>
                          <MyOrders />
                        </ProtectedRoute>
                      }
                    />

                    {/* Vendor Routes (Vendor & Super Admin) */}
                    <Route
                      path="/create-shop"
                      element={
                        <ProtectedRoute allowedRoles={['VENDOR', 'SUPER_ADMIN']}>
                          <CreateShop />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/vendor/orders"
                      element={
                        <ProtectedRoute allowedRoles={['VENDOR', 'SUPER_ADMIN']}>
                          <VendorDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/vendor/products/new"
                      element={
                        <ProtectedRoute allowedRoles={['VENDOR', 'SUPER_ADMIN']}>
                          <AddProduct />
                        </ProtectedRoute>
                      }
                    />

                    {/* Super Admin Only Route */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Backward-compatibility aliases */}
                    <Route path="/my-reservations" element={<Navigate to="/my-orders" replace />} />
                    <Route path="/shop-reservations" element={<Navigate to="/vendor/orders" replace />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>

              <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-400 mt-12">
                © {new Date().getFullYear()} LocalPickup Platform. Barcha huquqlar himoyalangan.
              </footer>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
