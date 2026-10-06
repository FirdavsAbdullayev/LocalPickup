import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  Shield, BarChart3, Store, Users, ClipboardList,
  Clock, Hourglass, Coins, CheckCircle2, Trash2, Ban, Check
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/shops'),
    ]).then(([statsRes, usersRes, shopsRes]) => {
      setStats(statsRes.data.data.stats);
      setUsers(usersRes.data.data.users);
      setShops(shopsRes.data.data.shops);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const approveShop = async (shopId) => {
    try {
      await api.patch(`/admin/shops/${shopId}/approve`);
      setShops(prev => prev.map(s => s.id === shopId ? { ...s, isApproved: true } : s));
      toast.success('Do\'kon tasdiqlandi!');
    } catch {
      toast.error('Xatolik');
    }
  };

  const rejectShop = async (shopId) => {
    if (!confirm('Do\'konni rad etmoqchimisiz?')) return;
    try {
      await api.delete(`/admin/shops/${shopId}`);
      setShops(prev => prev.filter(s => s.id !== shopId));
      toast.success('Do\'kon o\'chirildi.');
    } catch {
      toast.error('Xatolik');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      toast.success(`Foydalanuvchi ${newStatus === 'ACTIVE' ? 'faollashtirildi' : 'bloklandi'}`);
    } catch {
      toast.error('Xatolik');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Yuklanmoqda...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
          <Shield className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Super Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-0.5">Platforma statistikasi va do'konlar moderatsiyasi</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {[
          { key: 'stats', label: 'Statistika', icon: BarChart3 },
          { key: 'shops', label: 'Do\'konlar', icon: Store },
          { key: 'users', label: 'Foydalanuvchilar', icon: Users },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition -mb-px border-b-2 ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Foydalanuvchilar', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
            { label: 'Faol do\'konlar', value: stats.totalShops, icon: Store, color: 'from-emerald-500 to-emerald-600' },
            { label: 'Jami buyurtmalar', value: stats.totalOrders, icon: ClipboardList, color: 'from-amber-500 to-amber-600' },
            { label: 'Kutilayotgan', value: stats.pendingOrders, icon: Clock, color: 'from-orange-500 to-orange-600' },
            { label: 'Kutilayotgan do\'konlar', value: stats.pendingShops, icon: Hourglass, color: 'from-purple-500 to-purple-600' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-sm`}>
                <div className="p-2 bg-white/20 rounded-xl w-fit mb-3">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-white/80 mt-1">{s.label}</div>
              </div>
            );
          })}
          <div className="col-span-2 md:col-span-3 lg:col-span-5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-sm mt-2">
            <div className="p-2 bg-white/20 rounded-xl w-fit mb-3">
              <Coins className="h-6 w-6" />
            </div>
            <div className="text-3xl font-extrabold">{Number(stats.gmv).toLocaleString()} so'm</div>
            <div className="text-sm text-white/80 mt-1">Platforma umumiy tovar aylanmasi (GMV)</div>
          </div>
        </div>
      )}

      {activeTab === 'shops' && (
        <div className="space-y-4">
          {shops.map(shop => (
            <div key={shop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-lg">{shop.name}</h3>
                  {shop.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                      <Check className="h-3 w-3" /> Tasdiqlangan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                      <Clock className="h-3 w-3" /> Kutilmoqda
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">Egasi: {shop.owner?.fullName} ({shop.owner?.email})</p>
                {shop.address && <p className="text-xs text-gray-400 mt-0.5">Manzil: {shop.address}</p>}
              </div>
              <div className="flex gap-2">
                {!shop.isApproved && (
                  <button
                    onClick={() => approveShop(shop.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Tasdiqlash
                  </button>
                )}
                <button
                  onClick={() => rejectShop(shop.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-rose-600 border border-rose-200 rounded-xl text-sm font-medium hover:bg-rose-50 transition"
                >
                  <Trash2 className="h-4 w-4" /> O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Ism', 'Email', 'Telefon', 'Rol', 'Status', 'Amallar'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'VENDOR' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>{u.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleUserStatus(u.id, u.status)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        u.status === 'ACTIVE'
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? <><Ban className="h-3.5 w-3.5" /> Bloklash</> : <><Check className="h-3.5 w-3.5" /> Faollashtirish</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
