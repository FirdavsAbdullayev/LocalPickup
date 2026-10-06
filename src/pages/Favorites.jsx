import React, { useContext } from 'react';
import { Heart } from 'lucide-react';
import { FavoritesContext } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);

  const products = favorites.map(f => f.product).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-red-50 text-red-500 rounded-xl border border-red-100">
          <Heart className="h-7 w-7 fill-red-500 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Yoqtirilgan mahsulotlar</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} ta mahsulot saqlangan</p>
        </div>
      </div>

      {!products.length ? (
        <EmptyState
          icon={Heart}
          title="Yoqtirilgan mahsulotlar yo'q"
          description="Siz hali birorta mahsulotni yoqtirganlar ro'yxatiga qo'shmadingiz."
          actionLabel="Do'konlarga o'tish"
          actionTo="/shops"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
