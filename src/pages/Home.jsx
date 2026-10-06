import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Clock, Shield, ChevronRight, Store, Package,
  Users, Star, Search, ShoppingCart, CheckCircle2,
  Shirt, Smartphone, Utensils, Activity, Home as HomeIcon, BookOpen, Sparkles
} from 'lucide-react';

const STATS = [
  { value: '1,200+', label: "Do'konlar", icon: Store },
  { value: '50,000+', label: 'Mahsulotlar', icon: Package },
  { value: '25,000+', label: 'Foydalanuvchilar', icon: Users },
  { value: '4.9', label: "O'rtacha reyting", icon: Star },
];

const STEPS = [
  { step: '01', icon: Search, title: "Do'kon toping", desc: "Yaqingizdagi do'konlarni qidirish yoki katalog orqali oson toping." },
  { step: '02', icon: ShoppingCart, title: 'Mahsulot tanlang', desc: "Kerakli mahsulotlarni savatga soling. Narx, aksiya va chegirmalarni ko'ring." },
  { step: '03', icon: CheckCircle2, title: 'Borib olib keting', desc: "Qulay vaqt belgilang va do'kondan tayyor mahsulotingizni navbatsiz olib keting." },
];

const CATEGORIES = [
  { name: 'Kiyim-kechak', icon: Shirt, color: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100' },
  { name: 'Elektronika',  icon: Smartphone, color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' },
  { name: 'Oziq-ovqat',   icon: Utensils, color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' },
  { name: 'Sport',        icon: Activity, color: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' },
  { name: 'Uy-joy',       icon: HomeIcon, color: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' },
  { name: 'Kitoblar',     icon: BookOpen, color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100' },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-white/30">
              <Sparkles className="h-4 w-4 text-yellow-300" /> O'zbekistonning #1 Local Pickup platformasi
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Yaqin do'kondan{' '}
              <span className="text-yellow-300">onlayn band qil,</span>
              <br />
              borib ol!
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl leading-relaxed">
              Mahalliy do'konlarda vaqtingizni tejang — mahsulotni onlayn band qiling va qulay vaqtda borib olib keting. Navbat kutish yo'q!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shops"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold text-lg rounded-xl hover:bg-yellow-300 hover:text-indigo-900 transition-all shadow-xl hover:shadow-2xl active:scale-95"
              >
                Do'konlarni ko'rish <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                to="/create-shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500/40 hover:bg-indigo-500/60 border border-white/30 text-white font-bold text-lg rounded-xl transition-all active:scale-95"
              >
                <Store className="h-5 w-5" /> Do'kon ochish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center p-4">
                  <div className="h-12 w-12 mx-auto mb-3 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <div className="text-3xl font-extrabold text-gray-900">{s.value}</div>
                  <p className="text-gray-500 mt-1 font-medium text-sm">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Qanday ishlaydi?</h2>
            <p className="mt-3 text-lg text-gray-500">3 oson qadamda mahsulotingizni band qiling</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s) => {
              const StepIcon = s.icon;
              return (
                <div key={s.step} className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute -top-3 left-8 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {s.step}
                  </div>
                  <div className="h-14 w-14 mb-6 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                    <StepIcon className="h-7 w-7 stroke-[1.8]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Kategoriyalar</h2>
            <p className="mt-3 text-lg text-gray-500">Barcha turdagi do'konlar bir joyda</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to="/shops"
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 ${cat.color} transition-all hover:scale-105 cursor-pointer shadow-sm`}
                >
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center">
                    <CatIcon className="h-7 w-7 stroke-[1.8]" />
                  </div>
                  <span className="text-sm font-semibold text-center">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-20 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, color: 'bg-indigo-100 text-indigo-600', title: 'Yaqin do\'konlar', desc: 'Joylashuvingizga eng yaqin do\'konlarni toping va vaqtingizni tejang.' },
              { icon: Clock, color: 'bg-emerald-100 text-emerald-600', title: 'Tez va qulay', desc: 'Band qiling, vaqt belgilang va to\'g\'ridan-to\'g\'ri olib keting. Navbat yo\'q!' },
              { icon: Shield, color: 'bg-amber-100 text-amber-600', title: 'Ishonchli platforma', desc: 'Barcha do\'konlar tekshirilgan. Xavfsiz va ishonchli xarid.' },
            ].map((f) => (
              <div key={f.title} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-indigo-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${f.color} rounded-2xl mb-5`}>
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-indigo-700 to-purple-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Do'koningizni ulang va savdoni oshiring!
          </h2>
          <p className="text-indigo-200 text-lg mb-8">Minglab mijozlarga yetib boring. Bepul boshlang.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-white text-indigo-700 font-bold text-lg rounded-xl hover:bg-yellow-300 hover:text-indigo-900 transition-all shadow-lg">
              Sotuvchi bo'lish
            </Link>
            <Link to="/shops" className="px-8 py-4 bg-indigo-600 border border-indigo-400 text-white font-bold text-lg rounded-xl hover:bg-indigo-500 transition-all">
              Mahsulotlarni ko'rish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
