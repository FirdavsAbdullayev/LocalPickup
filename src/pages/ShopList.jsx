import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Store } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/contexts';
import ShopCard from '../components/ShopCard';
import EmptyState from '../components/EmptyState';
import { SkeletonShopCard } from '../components/SkeletonCard';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loadedQuery, setLoadedQuery] = useState(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let active = true;

    const fetchShops = async () => {
      try {
        const res = await api.get('/shops', { params: search ? { search } : {} });
        if (active) setShops(res.data?.data?.shops || []);
      } catch {
        if (active) setShops([]);
      } finally {
        if (active) setLoadedQuery(search);
      }
    };

    const timer = setTimeout(fetchShops, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search]);

  const initialLoading = loadedQuery === null;
  const searching = loadedQuery !== search;

  const canCreateShop = user?.role === 'VENDOR' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="page container-page">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Do'konlar</h1>
          <p className="page-subtitle">
            {initialLoading ? 'Yuklanmoqda...' : `${shops.length} ta do'kon topildi`}
          </p>
        </div>
        {canCreateShop && (
          <Link to="/create-shop" className="btn btn-primary">
            <Plus className="h-4 w-4" /> Yangi do'kon
          </Link>
        )}
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

      {initialLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SkeletonShopCard key={i} />
          ))}
        </div>
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
            searching ? 'pointer-events-none opacity-60' : ''
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
