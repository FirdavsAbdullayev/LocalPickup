import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Trash2, Clock } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.currentPrice) * item.quantity), 0);
  };

  // Savatdagi mahsulotlarni shop bo'yicha guruhlash
  const groupedByShop = cartItems.reduce((groups, item) => {
    const shopId = item.shop?.id || item.shop_id;
    if (!groups[shopId]) {
      groups[shopId] = { shop: item.shop, items: [] };
    }
    groups[shopId].items.push(item);
    return groups;
  }, {});

  const handleReserve = async () => {
    if (!user) {
      toast.error("Band qilish uchun tizimga kirishingiz kerak!");
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      toast.error("Faqat mijozlar mahsulot band qila oladi!");
      return;
    }
    if (!pickupTime) {
      toast.warning("Iltimos, olib ketish vaqtini belgilang!");
      return;
    }

    setLoading(true);
    try {
      const shopIds = Object.keys(groupedByShop);

      // Har bir do'kon uchun alohida rezervatsiya yaratish
      for (const shopId of shopIds) {
        const group = groupedByShop[shopId];
        const reservationData = {
          shop_id: shopId,
          pickup_time: pickupTime,
          items: group.items.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        };
        await api.post('/reservations', reservationData);
      }

      clearCart();
      toast.success("🎉 Buyurtmangiz muvaffaqiyatli qabul qilindi! Do'kon egasiga xabar ketdi.");
      navigate('/my-reservations');
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Savatingiz bo'sh</h2>
        <p className="text-gray-500 mb-6">O'zingizga kerakli narsalarni band qilish uchun do'konlarni ko'zdan kechiring.</p>
        <Link to="/shops" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
          Do'konlarga o'tish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Savatingiz</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mahsulotlar ro'yxati */}
        <div className="lg:w-2/3 space-y-4">
          {Object.values(groupedByShop).map((group) => (
            <div key={group.shop?.id} className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100">
                <h3 className="font-semibold text-indigo-700">🏪 {group.shop?.name || "Do'kon"}</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {group.items.map((item) => (
                  <li key={item.id} className="p-5 flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                      Rasm
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-1">Soni: {item.quantity} ta</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {(Number(item.currentPrice) * item.quantity).toLocaleString()} so'm
                      </p>
                      <p className="text-xs text-gray-400">{Number(item.currentPrice).toLocaleString()} × {item.quantity}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-full transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Xulosa va Band qilish paneli */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow rounded-lg border border-gray-100 p-6 sticky top-24 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Buyurtma xulosasi</h2>

            {/* Olib ketish vaqti */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Clock className="h-4 w-4 text-indigo-500" />
                Olib ketish vaqti *
              </label>
              <input
                type="datetime-local"
                value={pickupTime}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">Do'konga qachon bormoqchisiz?</p>
            </div>
            
            {/* Hisob */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mahsulotlar</span>
                <span>{cartItems.length} xil</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t">
                <span>Jami summa</span>
                <span className="text-indigo-600 text-xl">{calculateTotal().toLocaleString()} so'm</span>
              </div>
            </div>

            {/* Tugmalar */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={handleReserve}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold shadow-sm transition active:scale-95 ${
                  loading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? "Yuborilmoqda..." : "✅ Band qilish (Reserve)"}
              </button>
              <button 
                onClick={clearCart}
                className="w-full py-2.5 px-4 rounded-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition"
              >
                Savatni tozalash
              </button>
            </div>

            {!user && (
              <p className="text-xs text-center text-red-500 bg-red-50 p-2 rounded-md">
                Band qilish uchun <Link to="/login" className="underline font-semibold">tizimga kiring</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
