import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const CreateShop = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    logo: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Iltimos, avval tizimga kiring!');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/shops', form);
      toast.success('Do\'koningiz muvaffaqiyatli yaratildi!');
      navigate(`/shops/${res.data.data.shop.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Do\'kon yaratishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Yangi do'kon ochish</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Do'kon nomi *</label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Masalan: 'Oqtepa Lavash Chilonzor'"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon raqam</label>
          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            placeholder="+998 90 123 45 67"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Manzil</label>
          <input
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            placeholder="Toshkent sh., Chilonzor 9-mavze"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Logo / Banner rasmi (URL)</label>
          <input
            name="logo"
            type="url"
            value={form.logo}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tavsif</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Do'koningiz va mahsulotlaringiz haqida qisqacha ma'lumot..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60 shadow-sm"
        >
          {loading ? 'Yaratilmoqda...' : 'Do\'konni yaratish'}
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
