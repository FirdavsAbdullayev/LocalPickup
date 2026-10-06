import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Plus, Store } from 'lucide-react';
import api from '../services/api';
import { SkeletonShopCard } from '../components/SkeletonCard';
import { AuthContext } from '../context/AuthContext';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/shops${search ? `?search=${search}` : ''}`);
        setShops(res.data.data.shops);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchShops, 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Do'konlar</h1>
          <p className="text-gray-500 mt-1">{!loading && `${shops.length} ta do'kon mavjud`}</p>
        </div>
        {user?.role === 'VENDOR' && (
          <Link to="/create-shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm">
            <Plus className="h-5 w-5" /> Yangi do'kon
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Do'kon nomi bo'yicha qidiring..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonShopCard key={i} />)}
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-16 w-16 mx-auto mb-4 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
            <Store className="h-8 w-8 stroke-[1.5]" />
          </div>
          <p className="text-xl font-bold text-gray-700">Do'konlar topilmadi</p>
          <p className="text-gray-400 mt-2 text-sm">Boshqa kalit so'z bilan qidiring</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map(shop => (
            <div key={shop.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden relative">
                {shop.logo ? (
                  <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-300">
                    <Store className="h-12 w-12 stroke-[1.5]" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1">{shop.name}</h2>
                {shop.address && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" /> {shop.address}
                  </p>
                )}
                {shop.description && (
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">{shop.description}</p>
                )}
                <Link
                  to={`/shops/${shop.slug}`}
                  className="block w-full text-center py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition text-sm"
                >
                  Do'konga kirish →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList;
