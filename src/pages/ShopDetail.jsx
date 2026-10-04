import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { Heart } from 'lucide-react';

const ShopDetail = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await api.get(`/shops/slug/${slug}`);
        setShop(res.data.data.shop);
      } catch (error) {
        console.error("Do'konni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Yuklanmoqda...</div>;
  if (!shop) return <div className="text-center py-20 text-red-500 font-bold">Do'kon topilmadi!</div>;

  const isOwner = user && (user.id === shop.owner_id || user.role === 'super_admin');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-100 relative">
        {isOwner && (
          <div className="absolute top-6 right-6">
            <Link to={`/shops/${shop.slug}/add-product`} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm">
              + Mahsulot qo'shish
            </Link>
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2 w-3/4">{shop.name}</h1>
        <p className="text-gray-600 text-lg mb-4 w-3/4">{shop.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="bg-gray-50 px-3 py-1 rounded">📞 {shop.phone || 'Kiritilmagan'}</div>
          <div className="bg-gray-50 px-3 py-1 rounded">📍 {shop.address || 'Kiritilmagan'}</div>
          <div className="bg-gray-50 px-3 py-1 rounded">👤 Egasi: {shop.owner?.name}</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mahsulotlar</h2>
      
      {!shop.Products || shop.Products.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow text-gray-500">
          Bu do'konda hali mahsulotlar yo'q
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shop.Products.map(product => {
            const hasDiscount = product.discount_price && Number(product.discount_price) > 0 && Number(product.discount_price) < Number(product.price);
            const currentPrice = hasDiscount ? product.discount_price : product.price;
            
            return (
              <div key={product.id} className="bg-white shadow rounded-lg p-4 border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                <button 
                  onClick={() => toggleFavorite(product)}
                  className="absolute top-2 left-2 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition shadow-sm"
                >
                  <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                
                {hasDiscount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 animate-pulse shadow-sm">
                    AKSIYA 🔥
                  </div>
                )}
                <div>
                  <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition">
                    Rasm yo'q
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-1" title={product.title}>{product.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="mt-2">
                    {hasDiscount ? (
                      <div>
                        <span className="text-gray-400 line-through text-sm mr-2">{Number(product.price).toLocaleString()} so'm</span>
                        <span className="text-red-600 font-bold text-lg">{Number(product.discount_price).toLocaleString()} so'm</span>
                      </div>
                    ) : (
                      <span className="text-indigo-600 font-bold text-lg">{Number(product.price).toLocaleString()} so'm</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => addToCart({ ...product, currentPrice, shop })}
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 font-medium transition shadow-sm active:scale-95"
                >
                  Savatga qo'shish
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopDetail;
