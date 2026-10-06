import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, LockKeyhole, Phone, ShoppingBag, Store, UserRound } from 'lucide-react';
import { useAuth } from '../context/contexts';
import Spinner from '../components/Spinner';

const ROLES = [
  {
    value: 'CUSTOMER',
    title: 'Xaridor',
    description: "Do'konlarni ko'rish va mahsulot band qilish",
    icon: UserRound,
  },
  {
    value: 'VENDOR',
    title: "Do'kon egasi",
    description: "Do'kon ochish va buyurtmalarni boshqarish",
    icon: Store,
  },
];

const Register = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'CUSTOMER' });
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const created = await register(form);
    setSubmitting(false);
    if (created) navigate(created.role === 'VENDOR' ? '/create-shop' : '/shops', { replace: true });
  };

  return (
    <div className="page container-page flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md animate-fade-up">
        <div className="card p-8 sm:p-10">
          <div className="mb-7 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
              <ShoppingBag className="h-6 w-6" />
            </span>
            <h1 className="page-title">Ro'yxatdan o'tish</h1>
            <p className="page-subtitle">Bir daqiqada hisob yarating va boshlang</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-1.5 sm:grid-cols-2">
              {ROLES.map((r) => {
                const active = form.role === r.value;
                const Icon = r.icon;
                return (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setForm((prev) => ({ ...prev, role: r.value }))}
                    className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
                      active ? 'bg-white shadow-sm ring-1 ring-brand-200' : 'hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`mt-0.5 h-4 w-4 ${active ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span>
                      <span className={`block text-sm font-semibold ${active ? 'text-slate-900' : 'text-slate-600'}`}>
                        {r.title}
                      </span>
                      <span className="block text-xs leading-snug text-slate-400">{r.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div>
              <label htmlFor="fullName" className="label">
                Ism familiya
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                minLength={2}
                autoComplete="name"
                className="input"
                placeholder="Aliyev Vali"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email manzil
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input pl-10"
                  placeholder="ism@example.uz"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Telefon raqam{' '}
                <span className="font-normal text-slate-400">(ixtiyoriy)</span>
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="input pl-10"
                  placeholder="+998 90 123 45 67"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Parol
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input pl-10"
                  placeholder="Kamida 6 ta belgi"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg btn-block">
              {submitting ? <Spinner size="sm" /> : <ArrowRight className="h-4 w-4" />}
              {submitting ? 'Yaratilmoqda...' : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
