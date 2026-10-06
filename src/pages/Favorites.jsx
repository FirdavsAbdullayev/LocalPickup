import { Heart } from 'lucide-react';
import { useFavorites } from '../context/contexts';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

const Favorites = () => {
  const { favorites } = useFavorites();
  const products = favorites.map((f) => f.product).filter(Boolean);

  return (
    <div className="page container-page">
      <header className="mb-7">
        <h1 className="page-title">Yoqtirilgan mahsulotlar</h1>
        <p className="page-subtitle">{products.length} ta mahsulot saqlangan</p>
      </header>

      {products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Yoqtirilgan mahsulotlar yo'q"
          description="Siz hali birorta mahsulotni yoqtirganlar ro'yxatiga qo'shmadingiz."
          actionLabel="Do'konlarga o'tish"
          actionTo="/shops"
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

export default Favorites;
