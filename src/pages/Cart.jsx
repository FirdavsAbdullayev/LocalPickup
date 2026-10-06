import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, Calendar, Store, Package, CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);

  // Group items by shop
  const shopGroups = cartItems.reduce((acc, item) => {
    const shopId = item.product?.shop?.id;
    if (!shopId) return acc;
    if (!acc[shopId]) acc[shopId] = { shop: item.product.shop, items: [] };
    acc[shopId].items.push(item);
    return acc;
  }, {});

  const total = cartItems.reduce((sum, item) => {
    const p = item.product;
    if (!p) return sum;
    const price = Number(p.discountPrice || p.price);
    return sum + price * item.quantity;
  }, 0);

  const handleReserve = async () => {
    if (!user) { toast.error('Iltimos, avval tizimga kiring!'); return; }
    if (!pickupTime) { toast.error('Olib ketish vaqtini tanlang!'); return; }
    if (new Date(pickupTime) < new Date()) { toast.error("O'tgan vaqtni tanlab bo'lmaydi!"); return; }

    setLoading(true);
    try {
      for (const [shopId, group] of Object.entries(shopGroups)) {
        const payload = {
          shopId,
          pickupTime,
          items: group.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        };
        await api.post('/orders', payload);
      }
      await clearCart();
      toast.success('Buyurtma muvaffaqiyatli yaratildi!');
      navigate('/my-orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Savat bo'sh"
        description="Siz hali savatga hech qanday mahsulot qo'shmadingiz."
        actionLabel="Do'konlarga o'tish"
        actionTo="/shops"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
          <ShoppingCart className="h-7 w-7" />
        </div>
        Savat
      </h1>

      <div className="space-y-6">
        {Object.entries(shopGroups).map(([shopId, group]) => (
          <div key={shopId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-indigo-50/70 border-b border-indigo-100 flex items-center gap-2">
              <Store className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-indigo-900">
                {group.shop?.name}
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {group.items.map(item => {
                const p = item.product;
                if (!p) return null;
                const price = Number(p.discountPrice || p.price);
                return (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4 flex-wrap sm:flex-nowrap">
                    <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-7 w-7 text-gray-400 stroke-[1.5]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-semibold text-gray-900 line-clamp-1">{p.title}</p>
                      <p className="text-indigo-600 font-bold">{price.toLocaleString()} so'm</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="h-8 w-8 bg-white rounded flex items-center justify-center shadow-sm hover:bg-gray-100">
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 bg-white rounded flex items-center justify-center shadow-sm hover:bg-gray-100">
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="w-full sm:w-28 text-right font-bold text-gray-800">
                      {(price * item.quantity).toLocaleString()} so'm
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-lg transition ml-auto sm:ml-0">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-indigo-600" /> Olib ketish vaqti
          </label>
          <input
            type="datetime-local"
            value={pickupTime}
            min={new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16)}
            onChange={e => setPickupTime(e.target.value)}
            className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <p className="text-xs text-gray-400 mt-2">Eng kamida 30 daqiqadan keyingi vaqtni tanlang.</p>
        </div>

        <div className="md:w-72 flex flex-col justify-end">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <span className="text-lg font-semibold text-gray-700">Jami:</span>
            <span className="text-3xl font-extrabold text-indigo-600">{total.toLocaleString()} so'm</span>
          </div>

          <button
            onClick={handleReserve}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:opacity-60 text-base active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            {loading ? 'Jarayonda...' : 'Buyurtmani tasdiqlash'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
