import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, LocateFixed, Map as MapIcon, Plus, Search, Store } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/contexts';
import ShopCard from '../components/ShopCard';
import EmptyState from '../components/EmptyState';
import { SkeletonShopCard } from '../components/SkeletonCard';

const MapView = lazy(() => import('../components/MapView'));

const RADII = [1, 3, 5];

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loadedQuery, setLoadedQuery] = useState(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [location, setLocation] = useState(null); // { lat, lng }
  const [locStatus, setLocStatus] = useState('idle'); // idle | loading | granted | denied
  const [radius, setRadius] = useState(3);
  const [refresh, setRefresh] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const refetchOnFocus = () => {
      if (document.visibilityState === 'visible') setRefresh((r) => r + 1);
    };
    document.addEventListener('visibilitychange', refetchOnFocus);
    window.addEventListener('focus', refetchOnFocus);
    return () => {
      document.removeEventListener('visibilitychange', refetchOnFocus);
      window.removeEventListener('focus', refetchOnFocus);
    };
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocStatus('denied');
      return;
    }
    setLocStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus('granted');
      },
      () => setLocStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    let active = true;

    const fetchShops = async () => {
      try {
        const params = {};
        if (search) params.search = search;
        if (view === 'map' && locStatus === 'granted' && location) {
          params.lat = location.lat;
          params.lng = location.lng;
          params.radius = radius;
        }
        const res = await api.get('/shops', { params });
        if (active) setShops(res.data?.data?.shops || []);
      } catch {
        if (active) setShops([]);
      } finally {
        if (active) setLoadedQuery(`${view}:${search}:${locStatus}:${radius}`);
      }
    };

    const timer = setTimeout(fetchShops, view === 'map' ? 0 : 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, view, location, locStatus, radius, refresh]);

  const initialLoading = loadedQuery === null;
  const loading = initialLoading || loadedQuery !== `${view}:${search}:${locStatus}:${radius}`;

  const canCreateShop = user?.role === 'VENDOR' || user?.role === 'SUPER_ADMIN';

  const handleView = (v) => {
    setView(v);
    if (v === 'map' && locStatus === 'idle') locate();
  };

  const markers = shops
    .filter((s) => Number.isFinite(s.latitude) && Number.isFinite(s.longitude))
    .map((s) => ({
      id: s.id,
      lat: s.latitude,
      lng: s.longitude,
      title: s.name,
      slug: s.slug,
    }));

  return (
    <div className="page container-page">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Do'konlar</h1>
          <p className="page-subtitle">
            {initialLoading ? 'Yuklanmoqda...' : `${shops.length} ta do'kon topildi`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => handleView('list')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                view === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Ro'yxat
            </button>
            <button
              type="button"
              onClick={() => handleView('map')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                view === 'map' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MapIcon className="h-4 w-4" /> Xarita
            </button>
          </div>
          {canCreateShop && (
            <Link to="/create-shop" className="btn btn-primary">
              <Plus className="h-4 w-4" /> Yangi do'kon
            </Link>
          )}
        </div>
      </header>

      <div className="relative mb-7">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Do'kon nomi bo'yicha qidiring..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input py-3 pl-11 text-[15px]"
          aria-label="Do'kon qidirish"
        />
      </div>

      {view === 'map' && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {locStatus === 'granted' && location && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600">Radius:</span>
              {RADII.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`chip ${radius === r ? 'chip-active' : ''}`}
                >
                  {r} km
                </button>
              ))}
            </div>
          )}
          {locStatus === 'denied' && (
            <button type="button" onClick={locate} className="btn btn-outline btn-sm">
              <LocateFixed className="h-4 w-4" /> Lokatsiyani yoqing
            </button>
          )}
          {locStatus === 'loading' && (
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              Joylashuv aniqlanmoqda...
            </span>
          )}
        </div>
      )}

      {initialLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SkeletonShopCard key={i} />
          ))}
        </div>
      ) : view === 'map' ? (
        locStatus === 'granted' && location ? (
          <Suspense
            fallback={<div className="skeleton rounded-xl" style={{ height: '560px' }} />}
          >
            <MapView
              markers={markers}
              center={[location.lat, location.lng]}
              zoom={13}
              height="560px"
              className={loading ? 'opacity-70' : ''}
            />
          </Suspense>
        ) : (
          <div className="card p-8 text-center">
            <p className="mb-4 text-slate-600">
              Yaqin atrofdagi do'konlarni ko'rish uchun joylashuvni taqdim eting yoki Ro'yxat rejimidan foydalaning.
            </p>
            {locStatus === 'denied' && (
              <button type="button" onClick={locate} className="btn btn-primary">
                <LocateFixed className="h-4 w-4" /> Joylashuvni so'rash
              </button>
            )}
          </div>
        )
      ) : shops.length === 0 ? (
        <EmptyState
          icon={Store}
          title="Do'konlar topilmadi"
          description="Boshqa kalit so'z bilan qidiring yoki yangi do'kon oching."
          actionLabel={canCreateShop ? "Yangi do'kon ochish" : undefined}
          actionTo={canCreateShop ? '/create-shop' : undefined}
        />
      ) : (
        <div
          className={`grid grid-cols-1 gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 ${
            loading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList;