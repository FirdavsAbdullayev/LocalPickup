import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home as HomeIcon,
  MapPin,
  Package,
  Search,
  Shield,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  Utensils,
} from 'lucide-react';
import api from '../services/api';
import ShopCard from '../components/ShopCard';
import { SkeletonShopCard } from '../components/SkeletonCard';

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: "Do'kon toping",
    desc: "Yaqingizdagi do'konlarni qidiruv orqali yoki kategoriyalar bo'yicha tez toping.",
  },
  {
    step: '02',
    icon: ShoppingCart,
    title: 'Mahsulot tanlang',
    desc: "Narx va aksiyalarni ko'ring, kerakli mahsulotlarni savatga qo'shing.",
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Borib olib keting',
    desc: "Qulay vaqtni belgilang va tayyor buyurtmangizni navbatsiz do'kondan oling.",
  },
];

const CATEGORIES = [
  { name: 'Kiyim-kechak', icon: Shirt, color: 'bg-pink-50 text-pink-600 border-pink-100 hover:border-pink-300' },
  { name: 'Elektronika', icon: Smartphone, color: 'bg-sky-50 text-sky-600 border-sky-100 hover:border-sky-300' },
  { name: 'Oziq-ovqat', icon: Utensils, color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300' },
  { name: 'Sport', icon: Activity, color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300' },
  { name: 'Uy-joy', icon: HomeIcon, color: 'bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300' },
  { name: 'Kitoblar', icon: BookOpen, color: 'bg-violet-50 text-violet-600 border-violet-100 hover:border-violet-300' },
];

const BENEFITS = [
  { icon: Clock, title: 'Vaqt tejang', desc: 'Onlayn band qiling — navbatda turish shart emas.' },
  { icon: MapPin, title: 'Yaqin do\'konlar', desc: "Joylashuvingizga eng yaqin do'konlarni toping." },
  { icon: Shield, title: 'Ishonchli platforma', desc: "Barcha do'konlar moderatsiyadan o'tadi." },
  { icon: Package, title: 'Oson olib ketish', desc: 'Buyurtmani tayyorlashini real vaqtda kuzating.' },
];

const FEATURES = [
  {
    icon: MapPin,
    color: 'bg-brand-100 text-brand-600',
    title: "Yaqin do'konlar",
    desc: "Vaqtingizni tejaydigan mahalliy xarid — do'konni topish oson.",
  },
  {
    icon: Clock,
    color: 'bg-emerald-100 text-emerald-600',
    title: 'Tez va qulay',
    desc: "Band qiling, vaqt belgilang va to'g'ridan-to'g'ri olib keting.",
  },
  {
    icon: Shield,
    color: 'bg-amber-100 text-amber-600',
    title: 'Xavfsiz xarid',
    desc: 'Buyurtmani oldindan to\'lovsiz, do\'konda joyida tasdiqlaysiz.',
  },
];

const Home = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get('/shops')
      .then((res) => {
        if (active) setShops(res.data?.data?.shops || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const featuredShops = shops.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-slate-900 text-white">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="container-page relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              O'zbekistondagi local pickup platformasi
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Yaqin do'kondan onlayn band qil,
              <span className="block text-amber-300">borib ol.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100 sm:text-xl">
              Mahsulotni onlayn band qiling, qulay vaqtda kelib oling. Navbat kutish yo'q — vaqtingiz sizniki.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/shops" className="btn btn-light btn-lg">
                Do'konlarni ko'rish <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="btn btn-lg border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Store className="h-4 w-4" /> Do'kon ochish
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-100/90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Bepul ro'yxatdan o'tish
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Oldindan to'lov shart emas
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Real vaqt buyurtma holati
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured shops */}
      <section className="page container-page">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Do'konlar
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">Platformada eng ko'zga tashlanayotgan do'konlar</p>
          </div>
          <Link to="/shops" className="btn btn-outline hidden sm:inline-flex">
            Barchasi <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <SkeletonShopCard key={i} />
            ))}
          </div>
        ) : featuredShops.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="card px-6 py-12 text-center text-sm text-slate-500">
            Hozircha do'konlar ro'yxati bo'sh.
          </div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link to="/shops" className="btn btn-outline">
            Barcha do'konlar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Qanday ishlaydi?
            </h2>
            <p className="mt-2 text-slate-500">3 oson qadamda mahsulotingizni band qiling</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="card relative p-7">
                  <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {s.step}
                  </span>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page container-page">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Kategoriyalar</h2>
          <p className="mt-2 text-slate-500">Barcha turdagi mahalliy do'konlar bir joyda</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to="/shops"
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 bg-white p-6 transition hover:-translate-y-0.5 ${cat.color}`}
              >
                <Icon className="h-7 w-7" />
                <span className="text-center text-sm font-semibold">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-slate-200 p-7">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-700 to-brand-900 py-16 sm:py-20">
        <div className="container-page mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Do'koningizni ulang va savdoni oshiring
          </h2>
          <p className="mt-3 text-brand-100">
            Minglab mijozlarga yetib boring. Ro'yxatdan o'tish va boshlash — bepul.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn btn-light btn-lg">
              Sotuvchi bo'lish
            </Link>
            <Link
              to="/shops"
              className="btn btn-lg border border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              Mahsulotlarni ko'rish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
