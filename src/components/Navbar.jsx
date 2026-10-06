import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, LayoutDashboard, LogOut, Menu, ShoppingBag, ShoppingCart, Store, User, X } from 'lucide-react';
import { useAuth, useCart, useFavorites } from '../context/contexts';

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const dashboardHref =
    user?.role === 'SUPER_ADMIN' ? '/admin' : user?.role === 'VENDOR' ? '/vendor/orders' : '/my-orders';

  const dashboardLabel =
    user?.role === 'SUPER_ADMIN' ? 'Admin panel' : user?.role === 'VENDOR' ? 'Sotuvchi paneli' : 'Buyurtmalarim';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="text-lg">
              Local<span className="text-brand-600">Pickup</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <Link to="/shops" className={navLinkClass({ isActive: location.pathname.startsWith('/shops') })}>
              Do'konlar
            </Link>
            {user && (
              <>
                <Link to="/favorites" className={navLinkClass({ isActive: location.pathname === '/favorites' })}>
                  Yoqtirganlar
                </Link>
                <Link to="/my-orders" className={navLinkClass({ isActive: location.pathname === '/my-orders' })}>
                  Buyurtmalarim
                </Link>
              </>
            )}
            {user && user.role !== 'CUSTOMER' && (
              <Link
                to={dashboardHref}
                className={navLinkClass({ isActive: location.pathname.startsWith('/vendor') || location.pathname === '/admin' })}
              >
                {dashboardLabel}
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/favorites"
                className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-rose-500 sm:flex"
                aria-label="Yoqtirganlar"
              >
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-brand-600"
                aria-label="Savat"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 md:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {user.fullName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                </span>
                <span className="max-w-[10rem] truncate text-sm font-semibold text-slate-700">
                  {user.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  title="Chiqish"
                  aria-label="Chiqish"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn btn-ghost">
                Kirish
              </Link>
              <Link to="/register" className="btn btn-primary">
                Ro'yxatdan o'tish
              </Link>
            </div>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-label="Menyu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200/80 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/shops" onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Do'konlar
            </Link>

            {user ? (
              <>
                <Link to="/favorites" onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Yoqtirganlar ({favorites.length})
                </Link>
                <Link to="/cart" onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Savat ({cartCount})
                </Link>
                <Link to="/my-orders" onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Buyurtmalarim
                </Link>
                {user.role !== 'CUSTOMER' && (
                  <Link
                    to={dashboardHref}
                    onClick={close}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    <LayoutDashboard className="h-4 w-4" /> {dashboardLabel}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" /> Chiqish
                </button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
                <Link to="/login" onClick={close} className="btn btn-outline btn-block">
                  Kirish
                </Link>
                <Link to="/register" onClick={close} className="btn btn-primary btn-block">
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-2 border-t border-slate-100 px-3 pt-3 text-sm text-slate-500">
                <Store className="h-4 w-4 text-slate-400" />
                {user.fullName}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
