import { Link } from 'react-router-dom';
import { MapPin, ShoppingBag } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="container-page flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
      <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <ShoppingBag className="h-4 w-4" />
        </span>
        LocalPickup
      </Link>

      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <MapPin className="h-4 w-4 text-brand-500" />
        O'zbekistondagi mahalliy do'konlar uchun local pickup platformasi
      </p>

      <p className="text-sm text-slate-400">
        © {CURRENT_YEAR} LocalPickup
      </p>
    </div>
  </footer>
);

export default Footer;
