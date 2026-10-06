import React, { useState, useEffect, useContext } from 'react';
import {
  Bell, Flame, CheckCircle2, PackageCheck, XCircle, User, Clock,
  Store, ClipboardList, Check, RotateCcw
} from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import EmptyState from '../../components/EmptyState';

const STATUS_MAP = {
  PENDING:   { label: 'Yangi',          color: 'bg-amber-50 text-amber-800 border-amber-200', icon: Bell, next: 'PREPARING', nextLabel: 'Tayyorlash', nextIcon: Flame },
  PREPARING: { label: 'Tayyorlanmoqda',  color: 'bg-blue-50 text-blue-800 border-blue-200', icon: Flame, next: 'READY', nextLabel: 'Tayyor', nextIcon: CheckCircle2 },
  READY:     { label: 'Tayyor',          color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2, next: 'COMPLETED', nextLabel: 'Bajarildi', nextIcon: PackageCheck },
  COMPLETED: { label: 'Bajarildi',       color: 'bg-gray-100 text-gray-700 border-gray-200', icon: PackageCheck, next: null },
  CANCELLED: { label: 'Bekor qilindi',   color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle, next: null },
};

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    api.get('/shops/my-shops').then(res => {
      const s = res.data.data.shops || [];
      setShops(s);
      if (s.length) setSelectedShop(s[0]);
    }).catch(console.error);
  }, []);

  const fetchOrders = () => {
    if (!selectedShop) return;
    api.get(`/orders/shop/${selectedShop.id}`)
      .then(res => setOrders(res.data.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!selectedShop) return;
    setLoading(true);
    fetchOrders();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [selectedShop]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success('Status yangilandi!');
    } catch {
      toast.error('Statusni yangilashda xatolik');
    }
  };

  const filteredOrders = orders.filter(o => activeTab === 'ALL' ? true : o.status === activeTab);
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;

  if (shops.length === 0) {
    return (
      <EmptyState
        icon={Store}
        title="Sizda hali do'kon yo'q"
        description="Buyurtmalarni boshqarish uchun avval yangi do'kon oching."
        actionLabel="Do'kon ochish"
        actionTo="/create-shop"
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200">
            <Bell className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Buyurtmalar Paneli</h1>
            <p className="text-gray-500 text-sm mt-0.5">Mijozlar buyurtmalarini boshqarish</p>
          </div>
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {pendingCount} ta yangi
            </span>
          )}
        </div>
      </div>

      {shops.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {shops.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedShop(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedShop?.id === s.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Store className="h-4 w-4" />
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['ALL', 'PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map(tab => {
          const TabIcon = tab === 'ALL' ? ClipboardList : STATUS_MAP[tab]?.icon;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {TabIcon && <TabIcon className="h-4 w-4" />}
              {tab === 'ALL' ? 'Barchasi' : STATUS_MAP[tab]?.label}
              {tab !== 'ALL' && orders.filter(o => o.status === tab).length > 0 && (
                <span className="ml-1.5 bg-black/10 px-2 py-0.5 rounded-full text-xs font-bold">
                  {orders.filter(o => o.status === tab).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Yuklanmoqda...</div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Buyurtmalar yo'q"
          description="Mijozlar ushbu holat bo'yicha buyurtma berishmagan."
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const st = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
            const StatusIcon = st.icon;
            const NextIcon = st.nextIcon;
            return (
              <div key={order.id} className={`bg-white rounded-2xl border ${st.color.split(' ')[2] || 'border-gray-100'} shadow-sm overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 border-b border-gray-50">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <User className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-gray-900">{order.customer?.fullName || 'Xaridor'}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${st.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {st.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 pl-11">{order.customer?.phone || order.customer?.email}</p>
                    {order.pickupTime && (
                      <p className="text-xs text-gray-500 mt-1 pl-11 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                        Olib ketish: {new Date(order.pickupTime).toLocaleString('uz-UZ')}
                      </p>
                    )}
                  </div>
                  <p className="text-2xl font-extrabold text-indigo-600">{Number(order.totalAmount).toLocaleString()} so'm</p>
                </div>
                <div className="px-6 py-4 bg-gray-50/40">
                  <div className="bg-white rounded-xl p-3 border border-gray-100 mb-4 space-y-1">
                    {order.items?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span>{item.product?.title} <span className="text-gray-400">× {item.quantity}</span></span>
                        <span className="font-medium">{(Number(item.unitPrice) * item.quantity).toLocaleString()} so'm</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {st?.next && (
                      <button
                        onClick={() => updateStatus(order.id, st.next)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
                      >
                        {NextIcon && <NextIcon className="h-4 w-4" />}
                        {st.nextLabel}
                      </button>
                    )}
                    {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                      <button
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-rose-600 border border-rose-200 rounded-xl text-sm font-medium hover:bg-rose-50 transition"
                      >
                        <XCircle className="h-4 w-4" />
                        Bekor qilish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
