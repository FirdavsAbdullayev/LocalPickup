import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const AddProduct = () => {
  const [searchParams] = useSearchParams();
  const shopId = searchParams.get('shopId');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shopId: shopId || '',
    categoryId: '',
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    image: '',
    stockQuantity: 1,
  });

  useEffect(() => {
    api.get('/products/categories').then(res => setCategories(res.data.data.categories || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shopId) {
      toast.error('Do\'kon tanlanmagan!');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stockQuantity: Number(form.stockQuantity),
        categoryId: form.categoryId || undefined,
      };
      await api.post('/products', payload);
      toast.success('Mahsulot muvaffaqiyatli qo\'shildi!');
      navigate(`/shops`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Mahsulot qo\'shishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Yangi mahsulot qo'shish</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mahsulot nomi *</label>
          <input
            name="title"
            type="text"
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Masalan: Lavash Max"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Narx (so'm) *</label>
            <input
              name="price"
              type="number"
              required
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              placeholder="35000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Chegirma narxi (so'm)</label>
            <input
              name="discountPrice"
              type="number"
              value={form.discountPrice}
              onChange={e => setForm({ ...form, discountPrice: e.target.value })}
              placeholder="30000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Rasm URL</label>
          <input
            name="image"
            type="url"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Kategoriya</label>
          <select
            value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">-- Tanlang (ixtiyoriy) --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon || '📦'} {c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Zaxiradagi soni</label>
          <input
            type="number"
            min="0"
            value={form.stockQuantity}
            onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tavsif</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Tarkibi, xususiyatlari..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60 shadow-sm"
        >
          {loading ? 'Saqlanmoqda...' : 'Mahsulotni qo\'shish'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
