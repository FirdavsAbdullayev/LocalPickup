import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  Flame,
  PackageCheck,
  Plus,
  Store,
  User,
  XCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/SkeletonCard';
import Spinner from '../../components/Spinner';

const STATUS_MAP = {
  PENDING: {
    label: 'Yangi',
    className: 'badge-warning',
    next: 'PREPARING',
    nextLabel: 'Tayyorlash',
    nextIcon: Flame,
  },
  PREPARING: {
    label: 'Tayyorlanmoqda',
    className: 'badge-info',
    next: 'READY',
    nextLabel: 'Tayyor qilish',
    nextIcon: CheckCircle2,
  },
  READY: {
    label: 'Tayyor',
    className: 'badge-success',
    next: 'COMPLETED',
    nextLabel: 'Topshirildi',
    nextIcon: PackageCheck,
  },
  COMPLETED: { label: 'Bajarildi', className: 'badge-neutral', next: null },
  CANCELLED: { label: 'Bekor qilindi', className: 'badge-danger', next: null },
};

const TABS = ['ALL', 'PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
const TERMINAL = ['COMPLETED', 'CANCELLED'];

const formatPrice = (value) => `${Number(value).toLocaleString('uz-UZ')} so'm`;
const formatDate = (value) => new Date(value).toLocaleString('uz-UZ');

const VendorDashboard = () => {
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoadedFor, setOrdersLoadedFor] = useState(null);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/shops/my-shops')
      .then((res) => {
        if (!active) return;
        const myShops = res.data.data.shops || [];
        setShops(myShops);
        setSelectedShopId((prev) => prev || myShops[0]?.id || '');
      })
      .catch(() => {
        if (active) toast.error("Do'konlarni yuklashda xatolik");
      })
      .finally(() => {
        if (active) setShopsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedShopId) return;
    let active = true;

    const loadOrders = async () => {
      try {
        const res = await api.get(`/orders/shop/${selectedShopId}`);
        if (active) {
          setOrders(res.data.data.orders || []);
          setOrdersLoadedFor(selectedShopId);
        }
      } catch {
        if (active) {
          setOrders([]);
          setOrdersLoadedFor(selectedShopId);
        }
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [selectedShopId]);

  const loading = shopsLoading || ordersLoadedFor !== selectedShopId;

  const selectedShop = useMemo(
    () => shops.find((s) => s.id === selectedShopId),
    [shops, selectedShopId]
  );

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success('Status yangilandi');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Statusni yangilashda xatolik');
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => {
    return TABS.reduce((acc, tab) => {
      acc[tab] = tab === 'ALL' ? orders.length : orders.filter((o) => o.status === tab).length;
      return acc;
    }, {});
  }, [orders]);

  const filteredOrders = activeTab === 'ALL' ? orders : orders.filter((o) => o.status === activeTab);

  if (shopsLoading && !shops.length) return <PageLoader />;

  if (!shops.length) {
    return (
      <div className="page container-page">
        <EmptyState
          icon={Store}
          title="Sizda hali do'kon yo'q"
          description="Buyurtmalarni boshqarish uchun avval yangi do'kon oching."
          actionLabel="Do'kon ochish"
          actionTo="/create-shop"
        />
      </div>
    );
  }

  return (
    <div className="page container-page max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-3">
            Buyurtmalar paneli
            {counts.PENDING > 0 && (
              <span className="badge badge-danger animate-pulse">{counts.PENDING} ta yangi</span>
            )}
          </h1>
          <p className="page-subtitle">Mijozlar buyurtmalarini real vaqtda boshqaring</p>
        </div>

        <div className="flex gap-2">
          <Link to={`/vendor/products/new?shopId=${selectedShopId}`} className="btn btn-outline">
            <Plus className="h-4 w-4" /> Mahsulot
          </Link>
          <Link to="/create-shop" className="btn btn-primary">
            <Store className="h-4 w-4" /> Yangi do'kon
          </Link>
        </div>
      </header>

      {shops.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {shops.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedShopId(s.id)}
              className={`chip ${selectedShopId === s.id ? 'chip-active' : ''}`}
            >
              <Store className="h-4 w-4" />
              {s.name}
            </button>
          ))}
        </div>
      )}

      {selectedShop && !selectedShop.isApproved && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Do'koningiz hali moderatsiyada. Buyurtmalarni qabul qilish mumkin, lekin do'kon xaridorlarga
            ko'rinmaguncha yangi buyurtma kelmasligi mumkin.
          </p>
        </div>
      )}

      {/* Status tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const active = activeTab === tab;
          const TabIcon = tab === 'ALL' ? ClipboardList : STATUS_MAP[tab]?.icon || Bell;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`chip whitespace-nowrap ${active ? 'chip-active' : ''}`}
            >
              <TabIcon className="h-4 w-4" />
              {tab === 'ALL' ? 'Barchasi' : STATUS_MAP[tab]?.label}
              {counts[tab] > 0 && (
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {counts[tab]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <PageLoader />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Buyurtmalar yo'q"
          description="Ushbu holatda hozircha buyurtma mavjud emas."
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const st = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
            const NextIcon = st.nextIcon;
            const busy = updatingId === order.id;

            return (
              <article key={order.id} className="card overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <User className="h-4 w-4" />
                      </span>
                      <h2 className="font-bold text-slate-900">{order.customer?.fullName || 'Xaridor'}</h2>
                      <span className={`badge ${st.className}`}>{st.label}</span>
                    </div>

                    <div className="mt-1.5 space-y-1 pl-10 text-sm text-slate-500">
                      <p>{order.customer?.phone || order.customer?.email}</p>
                      {order.pickupTime && (
                        <p className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3.5 w-3.5 text-brand-500" />
                          Olib ketish: {formatDate(order.pickupTime)}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xl font-extrabold text-brand-700">{formatPrice(order.totalAmount)}</p>
                </div>

                <div className="bg-slate-50/70 px-5 py-4 sm:px-6">
                  <ul className="mb-4 space-y-1.5 rounded-xl border border-slate-100 bg-white p-3 text-sm">
                    {order.items?.map((item) => (
                      <li key={item.id} className="flex justify-between gap-3">
                        <span className="truncate text-slate-700">
                          {item.product?.title} <span className="text-slate-400">× {item.quantity}</span>
                        </span>
                        <span className="shrink-0 font-semibold text-slate-800">
                          {formatPrice(Number(item.unitPrice) * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {st.next && (
                      <button
                        type="button"
                        onClick={() => updateStatus(order.id, st.next)}
                        disabled={busy}
                        className="btn btn-primary btn-sm"
                      >
                        {busy ? <Spinner size="sm" /> : <NextIcon className="h-4 w-4" />}
                        {st.nextLabel}
                      </button>
                    )}

                    {!TERMINAL.includes(order.status) && (
                      <button
                        type="button"
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        disabled={busy}
                        className="btn btn-danger btn-sm"
                      >
                        <XCircle className="h-4 w-4" /> Bekor qilish
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
