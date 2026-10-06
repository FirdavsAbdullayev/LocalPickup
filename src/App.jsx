import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import EmptyState from './components/EmptyState';

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
  <div className="page container-page">
    <EmptyState
      icon={FileQuestion}
      title="404 — Sahifa topilmadi"
      description="Siz qidirgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin."
      actionLabel="Bosh sahifaga qaytish"
      actionTo="/"
    />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <div className="flex min-h-screen flex-col bg-slate-50">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shops" element={<ShopList />} />
                  <Route path="/shops/:slug" element={<ShopDetail />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

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

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/my-reservations" element={<Navigate to="/my-orders" replace />} />
                  <Route path="/shop-reservations" element={<Navigate to="/vendor/orders" replace />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
            </div>

            <ToastContainer position="top-right" autoClose={3000} newestOnTop theme="colored" limit={3} />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
