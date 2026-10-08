import { useEffect, useState } from 'react';
import {
  Ban,
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Coins,
  Hourglass,
  Megaphone,
  Percent,
  Search,
  Shield,
  Star,
  Store,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/SkeletonCard';
import Spinner from '../../components/Spinner';

const TABS = [
  { key: 'stats', label: 'Statistika', icon: BarChart3 },
  { key: 'shops', label: "Do'konlar", icon: Store },
  { key: 'users', label: 'Foydalanuvchilar', icon: Users },
];

const ROLE_STYLES = {
  SUPER_ADMIN: 'badge border-violet-200 bg-violet-50 text-violet-700',
  VENDOR: 'badge-brand',
  CUSTOMER: 'badge-neutral',
};

const PLAN_META = {
  FREE: { label: 'Bepul', cls: 'badge-neutral' },
  PRO: { label: 'PRO', cls: 'badge-brand' },
  PREMIUM: { label: 'PREMIUM', cls: 'badge border-violet-200 bg-violet-50 text-violet-700' },
};

const formatPrice = (value) => `${Number(value).toLocaleString('uz-UZ')} so'm`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [shops, setShops] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.get('/admin/stats'), api.get('/admin/users'), api.get('/admin/shops')])
      .then(([statsRes, usersRes, shopsRes]) => {
        if (!active) return;
        setStats(statsRes.data?.data?.stats || null);
        setUsers(usersRes.data?.data?.users || []);
        setShops(shopsRes.data?.data?.shops || []);
      })
      .catch((err) => {
        if (active) toast.error(err.response?.data?.message || "Ma'lumotlarni yuklashda xatolik");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const approveShop = async (shopId) => {
    setBusyId(shopId);
    try {
      await api.patch(`/admin/shops/${shopId}/approve`);
      setShops((prev) => prev.map((s) => (s.id === shopId ? { ...s, isApproved: true } : s)));
      toast.success("Do'kon tasdiqlandi");
    } catch (err) {
      toast.error(err.response?.data?.message || "Do'konni tasdiqlashda xatolik");
    } finally {
      setBusyId(null);
    }
  };

  const deleteShop = async (shopId) => {
    if (!window.confirm("Do'konni o'chirib tashlamoqchimisiz?")) return;
    setBusyId(shopId);
    try {
      await api.delete(`/admin/shops/${shopId}`);
      setShops((prev) => prev.filter((s) => s.id !== shopId));
      toast.info("Do'kon o'chirildi");
    } catch (err) {
      toast.error(err.response?.data?.message || "Do'konni o'chirishda xatolik");
    } finally {
      setBusyId(null);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setBusyId(userId);
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: nextStatus });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)));
      toast.success(nextStatus === 'ACTIVE' ? 'Foydalanuvchi faollashtirildi' : 'Foydalanuvchi bloklandi');
    } catch (err) {
      toast.error(err.response?.data?.message || "Statusni o'zgartirishda xatolik");
    } finally {
      setBusyId(null);
    }
  };

  const toggleFeatured = async (shopId, currently) => {
    setBusyId(shopId);
    try {
      await api.patch(`/admin/shops/${shopId}/featured`, { featured: !currently, days: 30 });
      setShops((prev) =>
        prev.map((s) =>
          s.id === shopId
            ? {
                ...s,
                isFeatured: !currently,
                featuredUntil: !currently ? new Date(Date.now() + 30 * 86400000).toISOString() : null,
              }
            : s
        )
      );
      toast.success(!currently ? 'Reklama (Featured) 30 kunga yoqildi' : 'Reklama (Featured) o\'chirildi');
    } catch (err) {
      toast.error(err.response?.data?.message || "Featured statusini o'zgartirishda xatolik");
    } finally {
      setBusyId(null);
    }
  };

  const setPlan = async (shopId, plan) => {
    setBusyId(shopId);
    try {
      await api.patch(`/admin/shops/${shopId}/plan`, { plan });
      setShops((prev) => prev.map((s) => (s.id === shopId ? { ...s, plan } : s)));
      toast.success('Tarif (SaaS plan) yangilandi');
    } catch (err) {
      toast.error(err.response?.data?.message || "Tarifni o'zgartirishda xatolik");
    } finally {
      setBusyId(null);
    }
  };

  const setCommission = async (shopId, currentRate) => {
    const currentPercent = Math.round(Number(currentRate || 0) * 100);
    const raw = window.prompt(
      `Komissiya stavkasi (%) — 0 dan 25 gacha. Joriy: ${currentPercent}%`,
      String(currentPercent)
    );
    if (raw == null || raw.trim() === '') return;
    const rate = Number(raw) / 100;
    if (!Number.isFinite(rate) || rate < 0 || rate > 0.25) {
      toast.error("Komissiya 0% - 25% oralig'ida bo'lishi kerak");
      return;
    }
    setBusyId(shopId);
    try {
      await api.patch(`/admin/shops/${shopId}/commission`, { commissionRate: rate });
      setShops((prev) => prev.map((s) => (s.id === shopId ? { ...s, commissionRate: rate } : s)));
      toast.success('Komissiya stavkasi yangilandi');
    } catch (err) {
      toast.error(err.response?.data?.message || "Komissiyani o'zgartirishda xatolik");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <PageLoader />;

  const filteredUsers = users.filter((u) => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page container-page">
      <header className="mb-7 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Shield className="h-6 w-6" />
        </span>
        <div>
          <h1 className="page-title">Super Admin panel</h1>
          <p className="page-subtitle">Platforma statistikasi, do'konlar moderatsiyasi va foydalanuvchilar</p>
        </div>
      </header>

      <div className="mb-7 flex gap-1 overflow-x-auto border-b border-slate-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            { label: 'Foydalanuvchilar', value: stats?.totalUsers ?? 0, icon: Users, color: 'from-sky-500 to-sky-600' },
            { label: "Faol do'konlar", value: stats?.totalShops ?? 0, icon: Store, color: 'from-emerald-500 to-emerald-600' },
            { label: 'Buyurtmalar', value: stats?.totalOrders ?? 0, icon: ClipboardList, color: 'from-brand-500 to-brand-600' },
            { label: 'Kutilayotgan buyurtmalar', value: stats?.pendingOrders ?? 0, icon: Clock, color: 'from-amber-500 to-amber-600' },
            { label: 'Kutilayotgan do\'konlar', value: stats?.pendingShops ?? 0, icon: Hourglass, color: 'from-violet-500 to-violet-600' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`rounded-2xl bg-gradient-to-br ${s.color} p-5 text-white shadow-sm`}>
                <div className="mb-3 w-fit rounded-xl bg-white/20 p-2">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="mt-1 text-xs text-white/85">{s.label}</div>
              </div>
            );
          })}

          <div className="col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-brand-900 p-6 text-white shadow-sm">
              <div className="mb-3 w-fit rounded-xl bg-white/15 p-2">
                <Coins className="h-5 w-5" />
              </div>
              <div className="text-3xl font-extrabold">{formatPrice(stats?.gmv || 0)}</div>
              <div className="mt-1 text-sm text-white/75">
                Platforma umumiy tovar aylanmasi — GMV (bekor qilinganlar hisoblanmaydi)
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-6 text-white shadow-sm">
              <div className="mb-3 w-fit rounded-xl bg-white/20 p-2">
                <Percent className="h-5 w-5" />
              </div>
              <div className="text-3xl font-extrabold">{formatPrice(stats?.platformRevenue || 0)}</div>
              <div className="mt-1 text-sm text-white/75">
                Platforma komissiya daromadi (2-5% tranzaksiya haqi)
              </div>
            </div>
          </div>

          {/* Traction: MoM growth + retention */}
          <div className="col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-4">
            {[
              { key: 'shops', label: "Do'konlar oʻsishi (MoM)", icon: Store },
              { key: 'users', label: 'Foydalanuvchilar oʻsishi (MoM)', icon: Users },
              { key: 'orders', label: 'Buyurtmalar oʻsishi (MoM)', icon: ClipboardList },
            ].map((g) => {
              const Icon = g.icon;
              const data = stats?.growth?.[g.key];
              const pct = data?.growthPct ?? 0;
              const TrendIcon = pct > 0 ? TrendingUp : pct < 0 ? TrendingDown : null;
              return (
                <div key={g.key} className="card p-5">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{g.label}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2 text-xl font-extrabold text-slate-900">
                    {data?.current ?? 0}
                    <span className={`text-sm font-bold ${pct > 0 ? 'text-emerald-600' : pct < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                      {TrendIcon ? <TrendIcon className="mr-0.5 inline h-3.5 w-3.5" /> : null}
                      {pct > 0 ? '+' : ''}{pct}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    O'tgan oy: {data?.previous ?? 0} · Joriy oy: {data?.current ?? 0}
                  </p>
                </div>
              );
            })}

            <div className="card border-emerald-100 bg-emerald-50/50 p-5">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Retention (qayta xaridor)</span>
              </div>
              <div className="mt-2 text-xl font-extrabold text-slate-900">{stats?.retention?.repeatRate ?? 0}%</div>
              <p className="mt-1 text-xs text-slate-500">
                {stats?.retention?.repeatBuyers ?? 0} / {stats?.retention?.totalBuyers ?? 0} xaridor 2+ marta buyurtma bergan
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shops moderation */}
      {activeTab === 'shops' && (
        <div className="space-y-4">
          {shops.length === 0 ? (
            <EmptyState icon={Store} title="Do'konlar topilmadi" description="Hozircha ro'yxatdan o'tgan do'kon yo'q." />
          ) : (
            shops.map((shop) => (
              <article key={shop.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-slate-900">{shop.name}</h2>
                    {shop.isApproved ? (
                      <span className="badge badge-success">
                        <Check className="h-3 w-3" /> Tasdiqlangan
                      </span>
                    ) : (
                      <span className="badge badge-warning">
                        <Clock className="h-3 w-3" /> Kutilmoqda
                      </span>
                    )}
                    <span className={`badge ${PLAN_META[shop.plan]?.cls || 'badge-neutral'}`}>
                      {PLAN_META[shop.plan]?.label || shop.plan}
                    </span>
                    {shop.isFeatured && (
                      <span className="badge badge-brand">
                        <Star className="h-3 w-3" /> Reklama
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Egasi: {shop.owner?.fullName || "-"} <span className="text-slate-400">({shop.owner?.email || '-'})</span>
                  </p>
                  {shop.address && <p className="mt-0.5 text-xs text-slate-400">Manzil: {shop.address}</p>}
                  <p className="mt-1 text-xs text-slate-400">
                    Komissiya: {Math.round(Number(shop.commissionRate || 0) * 100)}%
                    {shop.featuredUntil && <> · Featured: {new Date(shop.featuredUntil).toLocaleDateString('uz-UZ')} gacha</>}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={shop.plan || 'FREE'}
                    onChange={(e) => setPlan(shop.id, e.target.value)}
                    disabled={busyId === shop.id}
                    className="input w-auto py-1.5 text-sm"
                    aria-label="SaaS plan"
                  >
                    <option value="FREE">Bepul</option>
                    <option value="PRO">PRO</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setCommission(shop.id, shop.commissionRate)}
                    disabled={busyId === shop.id}
                    className="btn btn-outline btn-sm"
                  >
                    {busyId === shop.id ? <Spinner size="sm" /> : <Percent className="h-3.5 w-3.5" />}
                    Komissiya
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(shop.id, shop.isFeatured)}
                    disabled={busyId === shop.id}
                    className={`btn btn-sm ${shop.isFeatured ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {busyId === shop.id ? (
                      <Spinner size="sm" />
                    ) : shop.isFeatured ? (
                      <>
                        <Megaphone className="h-3.5 w-3.5" /> Nofaol
                      </>
                    ) : (
                      <>
                        <Megaphone className="h-3.5 w-3.5" /> Reklama qilish
                      </>
                    )}
                  </button>
                  {!shop.isApproved && (
                    <button
                      type="button"
                      onClick={() => approveShop(shop.id)}
                      disabled={busyId === shop.id}
                      className="btn btn-success btn-sm"
                    >
                      {busyId === shop.id ? <Spinner size="sm" /> : <CheckCircle2 className="h-4 w-4" />}
                      Tasdiqlash
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteShop(shop.id)}
                    disabled={busyId === shop.id}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 className="h-4 w-4" /> O'chirish
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div>
          <div className="relative mb-4 max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              className="input pl-10"
              placeholder="Ism, email yoki telefon bo'yicha qidirish"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              aria-label="Foydalanuvchi qidirish"
            />
          </div>

          <div className="card overflow-x-auto">
            {filteredUsers.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">Foydalanuvchi topilmadi</div>
            ) : (
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Ism', 'Email', 'Telefon', 'Rol', 'Status', 'Amallar'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{u.fullName || '-'}</td>
                      <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                      <td className="px-5 py-3.5 text-slate-600">{u.phone || '-'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${ROLE_STYLES[u.role] || 'badge-neutral'}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id, u.status)}
                          disabled={busyId === u.id}
                          className={`btn btn-sm ${
                            u.status === 'ACTIVE' ? 'btn-danger' : 'btn-outline text-emerald-600'
                          }`}
                        >
                          {busyId === u.id ? (
                            <Spinner size="sm" />
                          ) : u.status === 'ACTIVE' ? (
                            <>
                              <Ban className="h-3.5 w-3.5" /> Bloklash
                            </>
                          ) : (
                            <>
                              <Check className="h-3.5 w-3.5" /> Faollashtirish
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
