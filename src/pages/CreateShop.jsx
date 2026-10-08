import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Clock, Crosshair, Image, MapPin, Phone, Store, Text } from 'lucide-react';
import api from '../services/api';
import Spinner from '../components/Spinner';

const MapView = lazy(() => import('../components/MapView'));

const CreateShop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    logo: '',
    latitude: null,
    longitude: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePick = (lat, lng) => {
    setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    toast.success('Do\'kon joylashuvi belgilandi');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        latitude: form.latitude != null ? Number(form.latitude) : undefined,
        longitude: form.longitude != null ? Number(form.longitude) : undefined,
      };
      const res = await api.post('/shops', payload);
      toast.success("Do'koningiz yaratildi!");
      navigate(`/shops/${res.data.data.shop.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Do'kon yaratishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container-page max-w-2xl">
      <header className="mb-7">
        <h1 className="page-title">Yangi do'kon ochish</h1>
        <p className="page-subtitle">
          Do'kon ma'lumotlarini to'ldiring — u admin moderatsiyasidan o'tgach platformada e'lon qilinadi.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Yangi do'konlar admin tomonidan tasdiqlanadi. Odatda bu bir necha daqiqa davom etadi.</p>
        </div>

        <div>
          <label htmlFor="name" className="label">
            Do'kon nomi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Store className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              className="input pl-10"
              placeholder="Masalan: Oqtepa Lavash Chilonzor"
              value={form.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="label">
              Telefon raqam
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input pl-10"
                placeholder="+998 90 123 45 67"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="label">
              Manzil
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="address"
                name="address"
                type="text"
                className="input pl-10"
                placeholder="Toshkent sh., Chilonzor 9-mavze"
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="logo" className="label">
            Logo / banner rasmi <span className="font-normal text-slate-400">(URL)</span>
          </label>
          <div className="relative">
            <Image className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="logo"
              name="logo"
              type="url"
              className="input pl-10"
              placeholder="https://..."
              value={form.logo}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="label">Do'kon joylashuvi (xaritadan belgilang)</label>
          <Suspense fallback={<div className="skeleton rounded-xl" style={{ height: '320px' }} />}>
            <MapView
              pickMode
              picked={form.latitude != null && form.longitude != null ? { lat: form.latitude, lng: form.longitude } : null}
              onPick={handlePick}
              height="320px"
            />
          </Suspense>
          {form.latitude != null && form.longitude != null ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <Crosshair className="h-3.5 w-3.5" />
              Belgilangan joy: {form.latitude}, {form.longitude} — mijozlar yaqinini topoladi
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-400">Xaritaga bosib do'kon joyini belgilang — ixtiyoriy.</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="label">
            Tavsif
          </label>
          <div className="relative">
            <Text className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <textarea
              id="description"
              name="description"
              rows={4}
              className="input pl-10"
              placeholder="Do'koningiz va mahsulotlaringiz haqida qisqacha ma'lumot..."
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">
            Bekor qilish
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
            {loading ? <Spinner size="sm" /> : <Store className="h-4 w-4" />}
            {loading ? 'Yaratilmoqda...' : "Do'konni yaratish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateShop;
