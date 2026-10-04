import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const STATUS_LABELS = {
  pending:   { label: "Kutilmoqda",   color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Tasdiqlandi",  color: "bg-blue-100 text-blue-800" },
  ready:     { label: "Tayyor!",      color: "bg-green-100 text-green-800" },
  completed: { label: "Bajarildi",    color: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Bekor qilindi",color: "bg-red-100 text-red-700" },
};

const MyReservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/reservations/my');
        setReservations(res.data.data.reservations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="text-center py-20">Yuklanmoqda...</div>;

  if (reservations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hali band qilishlar yo'q</h2>
        <p className="text-gray-500 mb-6">Do'konlardan mahsulot tanlab, band qilib ko'ring!</p>
        <Link to="/shops" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">Do'konlar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mening band qilishlarim</h1>
      <div className="space-y-4">
        {reservations.map(res => {
          const st = STATUS_LABELS[res.status] || STATUS_LABELS.pending;
          return (
            <div key={res.id} className="bg-white shadow rounded-lg border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{res.Shop?.name}</h3>
                  <p className="text-sm text-gray-500">{res.Shop?.address}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${st.color}`}>{st.label}</span>
              </div>
              <div className="border-t pt-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Mahsulotlar:</h4>
                <ul className="space-y-1">
                  {res.items?.map(item => (
                    <li key={item.id} className="text-sm text-gray-600 flex justify-between">
                      <span>{item.Product?.title} × {item.quantity}</span>
                      <span className="font-medium">{(Number(item.unit_price) * item.quantity).toLocaleString()} so'm</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <div className="text-sm text-gray-500">
                  ⏰ {new Date(res.pickup_time).toLocaleString('uz-UZ', { dateStyle: 'medium', timeStyle: 'short' })} da olib ketish
                </div>
                <p className="font-bold text-indigo-600 text-lg">{Number(res.total_amount).toLocaleString()} so'm</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyReservations;
