import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Minus, Package, Plus, ShoppingCart, Store, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth, useCart } from '../context/contexts';
import api from '../services/api';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';

const formatPrice = (value) => `${Number(value).toLocaleString('uz-UZ')} so'm`;

const toLocalInputValue = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
};

const MIN_PICKUP_TIME = toLocalInputValue(new Date(Date.now() + 30 * 60 * 1000));

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const shopGroups = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const shopId = item.product?.shop?.id;
      if (!shopId) return acc;
      if (!acc[shopId]) acc[shopId] = { shop: item.product.shop, items: [] };
      acc[shopId].items.push(item);
      return acc;
    }, {});
  }, [cartItems]);

  const total = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const p = item.product;
        if (!p) return sum;
        return sum + Number(p.discountPrice || p.price) * item.quantity;
      }, 0),
    [cartItems]
  );

  const handleReserve = async () => {
    if (!user) {
      toast.error('Iltimos, avval tizimga kiring!');
      return;
    }
    if (!pickupTime) {
      toast.error('Olib ketish vaqtini tanlang!');
      return;
    }
    if (new Date(pickupTime) < new Date()) {
      toast.error("O'tgan vaqtni tanlab bo'lmaydi!");
      return;
    }

    setSubmitting(true);
    try {
      for (const [shopId, group] of Object.entries(shopGroups)) {
        await api.post('/orders', {
          shopId,
          pickupTime: new Date(pickupTime).toISOString(),
          items: group.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        });
      }
      await clearCart();
      toast.success('Buyurtmangiz qabul qilindi!');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Buyurtma berishda xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page container-page">
        <EmptyState
          icon={ShoppingCart}
          title="Savat bo'sh"
          description="Siz hali savatga hech qanday mahsulot qo'shmadingiz."
          actionLabel="Do'konlarga o'tish"
          actionTo="/shops"
        />
      </div>
    );
  }

  return (
    <div className="page container-page max-w-5xl">
      <header className="mb-7">
        <h1 className="page-title">Savat</h1>
        <p className="page-subtitle">{cartItems.length} ta mahsulot tanlangan</p>
      </header>

      <div className="space-y-5">
        {Object.entries(shopGroups).map(([shopId, group]) => (
          <section key={shopId} className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-brand-50/70 px-5 py-3.5">
              <Store className="h-4 w-4 text-brand-600" />
              <h2 className="text-sm font-bold text-brand-900">{group.shop?.name}</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {group.items.map((item) => {
                const p = item.product;
                if (!p) return null;
                const price = Number(p.discountPrice || p.price);

                return (
                  <div key={item.id} className="flex flex-wrap items-center gap-4 px-5 py-4 sm:flex-nowrap">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-6 w-6 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 font-semibold text-slate-900">{p.title}</p>
                      <p className="mt-0.5 text-sm font-bold text-brand-700">{formatPrice(price)}</p>
                    </div>

                    <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:text-brand-600 disabled:opacity-40"
                        aria-label="Kamaytirish"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition hover:text-brand-600"
                        aria-label="Ko'paytirish"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="w-28 text-right text-sm font-extrabold text-slate-900">
                      {formatPrice(price * item.quantity)}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Olib tashlash"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Summary */}
      <section className="card mt-6 flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:p-7">
        <div className="flex-1">
          <label htmlFor="pickupTime" className="label flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-brand-600" /> Olib ketish vaqti
          </label>
          <input
            id="pickupTime"
            type="datetime-local"
            className="input max-w-sm"
            value={pickupTime}
            min={MIN_PICKUP_TIME}
            onChange={(e) => setPickupTime(e.target.value)}
          />
          <p className="mt-2 text-xs text-slate-400">Eng kamida 30 daqiqadan keyingi vaqtni tanlang.</p>
        </div>

        <div className="lg:w-80">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-sm font-semibold text-slate-600">To'lov summasi</span>
            <span className="text-2xl font-extrabold text-brand-700">{formatPrice(total)}</span>
          </div>

          <button
            type="button"
            onClick={handleReserve}
            disabled={submitting}
            className="btn btn-primary btn-lg btn-block"
          >
            {submitting ? <Spinner size="sm" /> : <CheckCircle2 className="h-5 w-5" />}
            {submitting ? 'Buyurtma berilmoqda...' : 'Buyurtmani tasdiqlash'}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            To'lov do'konda olib ketish paytida amalga oshiriladi.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Cart;
