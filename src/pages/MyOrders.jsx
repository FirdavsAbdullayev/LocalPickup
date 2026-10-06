import React, { useState, useEffect } from 'react';
import { Package, Clock, Flame, CheckCircle2, PackageCheck, XCircle, Store } from 'lucide-react';
import api from '../services/api';
import EmptyState from '../components/EmptyState';

const STATUS_MAP = {
  PENDING:   { label: 'Kutilmoqda',    color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  PREPARING: { label: 'Tayyorlanmoqda', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Flame },
  READY:     { label: 'Tayyor!',        color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  COMPLETED: { label: 'Bajarildi',     color: 'bg-gray-100 text-gray-700 border-gray-200', icon: PackageCheck },
  CANCELLED: { label: 'Bekor qilingan', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!confirm('Rostdan ham bekor qilmoqchimisiz?')) return;
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Yuklanmoqda...</div>;

  if (!orders.length) {
    return <EmptyState icon={Package} title="Sizda hali buyurtmalar yo'q" actionLabel="Xaridni boshlash" actionTo="/shops" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
          <Package className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Mening buyurtmalarim</h1>
      </div>
      
      <div className="space-y-6">
        {orders.map(order => {
          const st = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
          const StatusIcon = st.icon;
          return (
            <div key={order.id} className={`bg-white rounded-2xl border ${st.color.split(' ')[2] || 'border-gray-100'} shadow-sm overflow-hidden`}>
              <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-gray-50 gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Store className="h-5 w-5 text-indigo-600" />
                    {order.shop?.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Sana: {new Date(order.createdAt).toLocaleString('uz-UZ')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${st.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {st.label}
                  </span>
                  <span className="text-xl font-extrabold text-indigo-600">
                    {Number(order.totalAmount).toLocaleString()} so'm
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50">
                <div className="space-y-2">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        {item.product?.image ? (
                          <img src={item.product.image} className="h-8 w-8 rounded-lg object-cover" alt="" />
                        ) : (
                          <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Package className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <span className="font-medium text-gray-700">{item.product?.title} <span className="text-gray-400">× {item.quantity}</span></span>
                      </div>
                      <span className="font-semibold">{(Number(item.unitPrice) * item.quantity).toLocaleString()} so'm</span>
                    </div>
                  ))}
                </div>
                
                {order.pickupTime && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100">
                    <Clock className="h-3.5 w-3.5" />
                    Olib ketish: {new Date(order.pickupTime).toLocaleString('uz-UZ')}
                  </div>
                )}
              </div>

              {['PENDING'].includes(order.status) && (
                <div className="px-6 pb-4 pt-2">
                  <button onClick={() => handleCancel(order.id)} className="text-sm text-red-600 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition font-semibold">
                    Bekor qilish
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
