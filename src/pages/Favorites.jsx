import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import { CartContext } from '../context/CartContext';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const { addToCart } = useContext(CartContext);

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sevimli mahsulotlar yo'q</h2>
        <p className="text-gray-500 mb-6">Siz hali birorta ham mahsulotga layk bosmadingiz.</p>
        <Link to="/shops" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700">
          Do'konlarni ko'rish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Sizning sevimli mahsulotlaringiz ❤️</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {favorites.map(product => {
          const hasDiscount = product.discount_price && Number(product.discount_price) > 0 && Number(product.discount_price) < Number(product.price);
          const currentPrice = hasDiscount ? product.discount_price : product.price;

          return (
            <div key={product.id} className="bg-white shadow rounded-lg p-4 border border-gray-100 flex flex-col justify-between relative group">
              <button 
                onClick={() => toggleFavorite(product)}
                className="absolute top-2 left-2 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition shadow-sm"
              >
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </button>
              
              <div>
                <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition">
                  Rasm
                </div>
                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.title}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-indigo-600 font-bold text-lg">{Number(currentPrice).toLocaleString()} so'm</span>
                </div>
              </div>
              <button 
                onClick={() => addToCart({ ...product, currentPrice })}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 font-medium transition shadow-sm active:scale-95"
              >
                Savatga qo'shish
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;
