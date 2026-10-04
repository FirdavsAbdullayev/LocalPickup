import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Bell } from 'lucide-react';

const STATUS_LABELS = {
  pending:   { label: "Kutilmoqda",    color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Tasdiqlandi",   color: "bg-blue-100 text-blue-800" },
  ready:     { label: "Tayyor",        color: "bg-green-100 text-green-800" },
  completed: { label: "Bajarildi",     color: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Bekor qilindi", color: "bg-red-100 text-red-700" },
};

const ShopReservations = () => {
  const { user } = useContext(AuthContext);
  const [myShops, setMyShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Do'konlarni yuklash
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await api.get('/shops/my-shops');
        setMyShops(res.data.data.shops);
        if (res.data.data.shops.length > 0) {
          setSelectedShop(res.data.data.shops[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchShops();
  }, []);

  // Tanlangan do'konning rezervatsiyalarini yuklash
  useEffect(() => {
    if (!selectedShop) return;
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/reservations/shop/${selectedShop.id}`);
        setReservations(res.data.data.reservations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [selectedShop]);

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await api.patch(`/reservations/${reservationId}/status`, { status: newStatus });
      setReservations(prev =>
        prev.map(r => r.id === reservationId ? { ...r, status: newStatus } : r)
      );
      const messages = {
        confirmed: "✅ Buyurtma tasdiqlandi! Mijozga xabar ketdi.",
        ready: "🎯 Buyurtma tayyor deb belgilandi!",
        completed: "🎉 Buyurtma bajarildi!",
        cancelled: "❌ Buyurtma bekor qilindi."
      };
      toast.success(messages[newStatus] || "Status yangilandi");
    } catch (err) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const pendingCount = reservations.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Do'kon Buyurtmalari</h1>
        {pendingCount > 0 && (
          <span className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            <Bell className="h-4 w-4" /> {pendingCount} yangi
          </span>
        )}
      </div>

      {/* Do'kon tanlash */}
      {myShops.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {myShops.map(shop => (
            <button
              key={shop.id}
              onClick={() => setSelectedShop(shop)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedShop?.id === shop.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {shop.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">Yuklanmoqda...</div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow border border-gray-100 text-gray-500">
          Hozircha buyurtmalar yo'q. Mijozlar mahsulot band qilganda bu yerda ko'rinadi.
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(res => {
            const st = STATUS_LABELS[res.status] || STATUS_LABELS.pending;
            return (
              <div key={res.id} className={`bg-white shadow rounded-lg border overflow-hidden ${res.status === 'pending' ? 'border-yellow-300' : 'border-gray-100'}`}>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-gray-900">👤 {res.customer?.name}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${st.color}`}>{st.label}</span>
                      {res.status === 'pending' && (
                        <span className="text-xs text-yellow-600 font-semibold animate-pulse">🔔 Javob kutilmoqda!</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">📞 {res.customer?.phone || res.customer?.email}</p>
                    <p className="text-sm text-gray-500">
                      ⏰ Olib ketish: <strong>{new Date(res.pickup_time).toLocaleString('uz-UZ', { dateStyle: 'medium', timeStyle: 'short' })}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{Number(res.total_amount).toLocaleString()} so'm</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(res.createdAt).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' })}</p>
                  </div>
                </div>

                {/* Mahsulotlar */}
                <div className="px-6 pb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Buyurtma tarkibi</h4>
                    {res.items?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700">{item.Product?.title} <span className="text-gray-400">× {item.quantity}</span></span>
                        <span className="font-medium text-gray-900">{(Number(item.unit_price) * item.quantity).toLocaleString()} so'm</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amallar */}
                {res.status !== 'completed' && res.status !== 'cancelled' && (
                  <div className="px-6 pb-5 flex gap-2 flex-wrap">
                    {res.status === 'pending' && (
                      <button onClick={() => handleStatusUpdate(res.id, 'confirmed')} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                        ✅ Tasdiqlash
                      </button>
                    )}
                    {res.status === 'confirmed' && (
                      <button onClick={() => handleStatusUpdate(res.id, 'ready')} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition shadow-sm">
                        🎯 Tayyor (Olib ketsin)
                      </button>
                    )}
                    {res.status === 'ready' && (
                      <button onClick={() => handleStatusUpdate(res.id, 'completed')} className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition shadow-sm">
                        🎉 Bajarildi
                      </button>
                    )}
                    {res.status !== 'cancelled' && (
                      <button onClick={() => handleStatusUpdate(res.id, 'cancelled')} className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md text-sm font-medium hover:bg-red-50 transition">
                        ❌ Bekor qilish
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopReservations;
