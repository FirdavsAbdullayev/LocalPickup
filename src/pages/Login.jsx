import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../context/contexts';
import Spinner from '../components/Spinner';

const dashboardFor = (role) =>
  role === 'SUPER_ADMIN' ? '/admin' : role === 'VENDOR' ? '/vendor/orders' : '/shops';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={location.state?.from || dashboardFor(user.role)} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const loggedInUser = await login(form);
    setSubmitting(false);
    if (loggedInUser) {
      navigate(location.state?.from || dashboardFor(loggedInUser.role), { replace: true });
    }
  };

  return (
    <div className="page container-page flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md animate-fade-up">
        <div className="card p-8 sm:p-10">
          <div className="mb-7 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
              <LockKeyhole className="h-6 w-6" />
            </span>
            <h1 className="page-title">Tizimga kirish</h1>
            <p className="page-subtitle">Hisobingizga kirib, buyurtmalaringizni boshqaring</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email manzil
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input pl-10"
                  placeholder="ism@example.uz"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  type="password"
                  required
                  autoComplete="current-password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg btn-block">
              {submitting ? <Spinner size="sm" /> : <ArrowRight className="h-4 w-4" />}
              {submitting ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
