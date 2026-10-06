import React, { useContext } from 'react';
import { Heart, ShoppingCart, Package, Check, AlertCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  const hasDiscount = product.discountPrice &&
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < Number(product.price);
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - Number(currentPrice) / Number(product.price)) * 100)
    : 0;
  const favorite = isFavorite(product.id);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col justify-between">
      <div>
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-50/50 text-indigo-300">
              <Package className="h-16 w-16 stroke-[1.2]" />
            </div>
          )}

          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPct}% AKSIYA
            </span>
          )}

          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow">Tugagan</span>
            </div>
          )}

          <button
            onClick={() => toggleFavorite(product)}
            className="absolute top-2 right-2 p-2 bg-white/95 rounded-full shadow hover:bg-white transition"
          >
            <Heart className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{product.title}</h3>
          {product.category && (
            <span className="inline-block text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 mb-2">
              {product.category.name}
            </span>
          )}
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-indigo-600">
              {Number(currentPrice).toLocaleString()} so'm
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {Number(product.price).toLocaleString()}
              </span>
            )}
          </div>
          <div className="mt-2 text-xs flex items-center gap-1">
            {product.stockQuantity > 0 ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <Check className="h-3.5 w-3.5" /> Mavjud ({product.stockQuantity} dona)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-500 font-medium">
                <AlertCircle className="h-3.5 w-3.5" /> Tugagan
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-1">
        <button
          onClick={() => addToCart(product)}
          disabled={product.stockQuantity === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm"
        >
          <ShoppingCart className="h-4 w-4" /> Savatga qo'shish
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
