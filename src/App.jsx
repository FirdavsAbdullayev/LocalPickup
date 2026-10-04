import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopList from './pages/ShopList';
import ShopDetail from './pages/ShopDetail';
import CreateShop from './pages/CreateShop';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import MyReservations from './pages/MyReservations';
import ShopReservations from './pages/ShopReservations';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shops" element={<ShopList />} />
            <Route path="/shops/:slug" element={<ShopDetail />} />
            <Route path="/shops/:slug/add-product" element={<AddProduct />} />
            <Route path="/create-shop" element={<CreateShop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="/shop-reservations" element={<ShopReservations />} />
            <Route path="*" element={
              <div className="flex items-center justify-center h-full mt-20">
                <h1 className="text-3xl font-bold text-gray-700">404 - Sahifa topilmadi</h1>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
