import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Plus, ChevronRight, Store, Package, Clock } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const ShopDetail = () => {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchShop = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/shops/slug/${slug}`);
        setShop(res.data.data.shop);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [slug]);

  const isOwner = user && shop && user.id === shop.ownerId;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-48 bg-gray-200 rounded-2xl animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!shop) {
    return <EmptyState icon={Store} title="Do'kon topilmadi" actionLabel="Barcha do'konlar" actionTo="/shops" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/20">
            {shop.logo ? (
              <img src={shop.logo} alt={shop.name} className="h-full w-full object-cover" />
            ) : (
              <Store className="h-10 w-10 text-white" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-extrabold">{shop.name}</h1>
              {!shop.isApproved && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 text-amber-950 rounded-full text-xs font-bold shadow-sm">
                  <Clock className="h-3.5 w-3.5" /> Ko'rib chiqilmoqda
                </span>
              )}
            </div>
            {shop.description && <p className="text-indigo-100 mt-2 mb-3 max-w-2xl">{shop.description}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-indigo-200">
              {shop.address && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{shop.address}</span>}
              {shop.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{shop.phone}</span>}
            </div>
          </div>
          {isOwner && (
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link
                to={`/vendor/products/new?shopId=${shop.id}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition text-sm shadow-sm"
              >
                <Plus className="h-4 w-4" /> Mahsulot qo'shish
              </Link>
              <Link
                to="/vendor/orders"
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700/80 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-sm border border-indigo-400/30"
              >
                Buyurtmalar <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Mahsulotlar
          <span className="ml-2 text-sm font-normal text-gray-400">{shop.products?.length || 0} ta</span>
        </h2>
      </div>

      {!shop.products?.length ? (
        <EmptyState
          icon={Package}
          title="Hozircha mahsulotlar yo'q"
          description={isOwner ? "Birinchi mahsulotingizni qo'shing!" : "Tez orada mahsulotlar qo'shiladi."}
          actionLabel={isOwner ? "+ Mahsulot qo'shish" : undefined}
          actionTo={isOwner ? `/vendor/products/new?shopId=${shop.id}` : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shop.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopDetail;
