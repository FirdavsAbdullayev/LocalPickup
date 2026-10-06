import { AlertCircle, Check, Heart, Package, ShoppingCart } from 'lucide-react';
import { useCart, useFavorites } from '../context/contexts';

const formatPrice = (value) => `${Number(value).toLocaleString('uz-UZ')} so'm`;

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const hasDiscount =
    product.discountPrice && Number(product.discountPrice) > 0 && Number(product.discountPrice) < Number(product.price);

  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - Number(currentPrice) / Number(product.price)) * 100)
    : 0;
  const favorite = isFavorite(product.id);
  const outOfStock = product.stockQuantity === 0;

  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Package className="h-14 w-14" strokeWidth={1.2} />
          </div>
        )}

        {hasDiscount && (
          <span className="badge absolute left-3 top-3 border-rose-600 bg-rose-600 text-white shadow-sm">
            -{discountPct}%
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/45 backdrop-blur-[1px]">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-sm">
              Tugagan
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          aria-label="Yoqtirganlarga qo'shish"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:bg-white active:scale-95"
        >
          <Heart className={`h-4 w-4 ${favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold text-slate-900">{product.title}</h3>

        {product.category?.name && <span className="badge badge-neutral mt-2 w-fit">{product.category.name}</span>}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="price text-lg">{formatPrice(currentPrice)}</span>
          {hasDiscount && <span className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</span>}
        </div>

        <div className="mt-2">
          {outOfStock ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500">
              <AlertCircle className="h-3.5 w-3.5" /> Mavjud emas
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <Check className="h-3.5 w-3.5" /> Mavjud · {product.stockQuantity} dona
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={outOfStock}
          className="btn btn-primary mt-4 w-full"
        >
          <ShoppingCart className="h-4 w-4" />
          Savatga qo'shish
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
