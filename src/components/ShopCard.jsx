import { Link } from 'react-router-dom';
import { MapPin, Store } from 'lucide-react';

const ShopCard = ({ shop }) => (
  <article className="card card-hover group overflow-hidden">
    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand-50 to-slate-100">
      {shop.logo ? (
        <img
          src={shop.logo}
          alt={shop.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-brand-300">
          <Store className="h-12 w-12" strokeWidth={1.3} />
        </div>
      )}
      {!shop.isApproved && <span className="badge badge-warning absolute left-3 top-3">Moderatsiyada</span>}
    </div>

    <div className="p-5">
      <h3 className="line-clamp-1 text-lg font-bold text-slate-900">{shop.name}</h3>

      {shop.address && (
        <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span className="line-clamp-1">{shop.address}</span>
        </p>
      )}

      {shop.description && <p className="mt-2 line-clamp-2 text-sm text-slate-400">{shop.description}</p>}

      <Link to={`/shops/${shop.slug}`} className="btn btn-outline mt-4 w-full">
        Do'konga kirish
      </Link>
    </div>
  </article>
);

export default ShopCard;
