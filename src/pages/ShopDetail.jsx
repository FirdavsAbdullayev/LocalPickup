import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, ChevronRight, Clock, MapPin, Package, Phone, Plus, Store } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/contexts';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import { SkeletonCard } from '../components/SkeletonCard';

const MapView = lazy(() => import('../components/MapView'));

const ShopDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [state, setState] = useState({ slug: null, shop: null });

  const fetchShop = useCallback(() => {
    api
      .get(`/shops/slug/${slug}`)
      .then((res) => setState({ slug, shop: res.data?.data?.shop || null }))
      .catch(() => setState({ slug, shop: null }));
  }, [slug]);

  useEffect(() => {
    let active = true;
    const load = () => {
      if (active) fetchShop();
    };
    load();
    const refetchOnFocus = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', refetchOnFocus);
    window.addEventListener('focus', refetchOnFocus);
    return () => {
      active = false;
      document.removeEventListener('visibilitychange', refetchOnFocus);
      window.removeEventListener('focus', refetchOnFocus);
    };
  }, [fetchShop]);

  const loading = state.slug !== slug;
  const shop = loading ? null : state.shop;

  if (loading) {
    return (
      <div className="page container-page">
        <div className="skeleton mb-8 h-48 rounded-2xl" />
        <div className="mb-6 flex items-center gap-3 text-sm text-slate-500">
          <Spinner size="sm" /> Yuklanmoqda...
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="page container-page">
        <EmptyState
          icon={Store}
          title="Do'kon topilmadi"
          description="Bu do'kon o'chirilgan yoki mavjud emas bo'lishi mumkin."
          actionLabel="Barcha do'konlar"
          actionTo="/shops"
        />
      </div>
    );
  }

  const isOwner = user && (user.id === shop.ownerId || user.role === 'SUPER_ADMIN');
  const products = shop.products || [];

  return (
    <div className="page container-page">
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-slate-500">
        <Link to="/shops" className="transition hover:text-brand-600">
          Do'konlar
        </Link>
        <ChevronRight className="h-4 w-4 text-slate-300" />
        <span className="truncate font-medium text-slate-800">{shop.name}</span>
      </nav>

      {/* Shop header */}
      <section className="card overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-slate-900 px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/15">
              {shop.logo ? (
                <img src={shop.logo} alt={shop.name} className="h-full w-full object-cover" />
              ) : (
                <Store className="h-9 w-9 text-white" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{shop.name}</h1>
                {shop.isApproved ? (
                  <span className="badge border-emerald-400/40 bg-emerald-400/15 text-emerald-200">
                    <Check /> Faol
                  </span>
                ) : (
                  <span className="badge border-amber-400/40 bg-amber-400/15 text-amber-200">
                    <Clock className="h-3 w-3" /> Moderatsiyada
                  </span>
                )}
              </div>

              {shop.description && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-100">{shop.description}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-brand-100/90">
                {shop.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {shop.address}
                  </span>
                )}
                {shop.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> {shop.phone}
                  </span>
                )}
              </div>
            </div>

            {isOwner && (
              <div className="flex shrink-0 flex-col gap-2">
                <Link to={`/vendor/products/new?shopId=${shop.id}`} className="btn btn-light">
                  <Plus className="h-4 w-4" /> Mahsulot qo'shish
                </Link>
                <Link
                  to="/vendor/orders"
                  className="btn border border-white/25 bg-white/10 text-white hover:bg-white/20"
                >
                  Buyurtmalar
                </Link>
              </div>
            )}
          </div>
        </div>

        {!shop.isApproved && isOwner && (
          <div className="flex items-start gap-3 border-b border-amber-100 bg-amber-50 px-6 py-4 text-sm text-amber-800 sm:px-8">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Do'koningiz hali moderatsiyada. Admin tasdiqlagach, u barcha xaridorlarga ko'rinadi. Siz
              mahsulot qo'shishni hozir boshlashingiz mumkin.
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 px-6 py-4 text-sm text-slate-500 sm:px-8">
          <span className="flex items-center gap-1.5">
            <Package className="h-4 w-4 text-brand-500" />
            <strong className="text-slate-800">{products.length}</strong> ta mahsulot
          </span>
        </div>
      </section>

      {Number.isFinite(shop.latitude) && Number.isFinite(shop.longitude) && (
        <section className="card mt-8 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <MapPin className="h-4 w-4 text-brand-600" /> Do'kon joylashuvi
            </h3>
            {shop.address && <span className="truncate text-sm text-slate-500">{shop.address}</span>}
          </div>
          <Suspense fallback={<div className="skeleton rounded-xl" style={{ height: '280px' }} />}>
            <MapView
              markers={[{ id: shop.id, lat: shop.latitude, lng: shop.longitude, title: shop.name }]}
              center={[shop.latitude, shop.longitude]}
              zoom={15}
              height="280px"
            />
          </Suspense>
        </section>
      )}

      {/* Products */}
      <div className="mb-6 mt-10 flex items-end justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Mahsulotlar</h2>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Hozircha mahsulotlar yo'q"
          description={
            isOwner
              ? "Birinchi mahsulotingizni qo'shing va do'koningizni jonlantiring."
              : "Tez orada mahsulotlar qo'shiladi."
          }
          actionLabel={isOwner ? "Mahsulot qo'shish" : undefined}
          actionTo={isOwner ? `/vendor/products/new?shopId=${shop.id}` : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopDetail;
