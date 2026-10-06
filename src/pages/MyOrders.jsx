import { useEffect, useState } from 'react';
import { CalendarClock, Package, Store, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import EmptyState from '../components/EmptyState';
import { PageLoader } from '../components/SkeletonCard';
import Spinner from '../components/Spinner';

const ORDER_STATUS = {
  PENDING: { label: 'Kutilmoqda', className: 'badge-warning' },
  PREPARING: { label: 'Tayyorlanmoqda', className: 'badge-info' },
  READY: { label: 'Tayyor!', className: 'badge-success' },
  COMPLETED: { label: 'Bajarildi', className: 'badge-neutral' },
  CANCELLED: { label: 'Bekor qilingan', className: 'badge-danger' },
};

const formatPrice = (value) => `${Number(value).toLocaleString('uz-UZ')} so'm`;
const formatDate = (value) => new Date(value).toLocaleString('uz-UZ');

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/orders/my')
      .then((res) => {
        if (active) setOrders(res.data.data.orders || []);
      })
      .catch(() => {
        if (active) toast.error('Buyurtmalarni yuklashda xatolik');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Rostdan ham bekor qilmoqchimisiz?')) return;
    setCancellingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o)));
      toast.info('Buyurtma bekor qilindi');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bekor qilib bo\'lmadi');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <PageLoader />;

  if (!orders.length) {
    return (
      <div className="page container-page">
        <EmptyState
          icon={Package}
          title="Sizda hali buyurtmalar yo'q"
          description="Do'konlardan mahsulot tanlab, birinchi buyurtmangizni bering."
          actionLabel="Xaridni boshlash"
          actionTo="/shops"
        />
      </div>
    );
  }

  return (
    <div className="page container-page max-w-4xl">
      <header className="mb-7">
        <h1 className="page-title">Mening buyurtmalarim</h1>
        <p className="page-subtitle">{orders.length} ta buyurtma</p>
      </header>

      <div className="space-y-5">
        {orders.map((order) => {
          const st = ORDER_STATUS[order.status] || ORDER_STATUS.PENDING;

          return (
            <article key={order.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <h2 className="flex items-center gap-2 font-bold text-slate-900">
                    <Store className="h-4 w-4 text-brand-600" />
                    <span className="truncate">{order.shop?.name}</span>
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">Buyurtma: {formatDate(order.createdAt)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`badge ${st.className}`}>{st.label}</span>
                  <span className="text-lg font-extrabold text-brand-700">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              <div className="bg-slate-50/70 px-5 py-4 sm:px-6">
                <ul className="space-y-2.5">
                  {order.items?.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex min-w-0 items-center gap-3">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt=""
                            className="h-9 w-9 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200">
                            <Package className="h-4 w-4 text-slate-500" />
                          </div>
                        )}
                        <span className="truncate text-slate-700">
                          {item.product?.title}{' '}
                          <span className="text-slate-400">× {item.quantity}</span>
                        </span>
                      </div>
                      <span className="shrink-0 font-semibold text-slate-800">
                        {formatPrice(Number(item.unitPrice) * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                {order.pickupTime && (
                  <div className="mt-4 flex items-center gap-1.5 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Olib ketish: {formatDate(order.pickupTime)}
                  </div>
                )}
              </div>

              {order.status === 'PENDING' && (
                <div className="flex justify-end px-5 py-3.5 sm:px-6">
                  <button
                    type="button"
                    onClick={() => handleCancel(order.id)}
                    disabled={cancellingId === order.id}
                    className="btn btn-danger btn-sm"
                  >
                    {cancellingId === order.id ? <Spinner size="sm" /> : <XCircle className="h-4 w-4" />}
                    Bekor qilish
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
