import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Shield, ChevronRight, ShoppingBag, Store, Users, Star } from 'lucide-react';

const STATS = [
  { value: '1,200+', label: "Do'konlar", icon: '🏪' },
  { value: '50,000+', label: 'Mahsulotlar', icon: '📦' },
  { value: '25,000+', label: 'Foydalanuvchilar', icon: '👥' },
  { value: '4.9★', label: "O'rtacha reyting", icon: '⭐' },
];

const STEPS = [
  { step: '01', icon: '🔍', title: "Do'kon toping", desc: "Yaqingizdagi do'konlarni xarita yoki qidirish orqali toping." },
  { step: '02', icon: '🛒', title: 'Mahsulot tanlang', desc: "Kerakli mahsulotlarni savatga soling. Narx, aksiya va chegirmalarni ko'ring." },
  { step: '03', icon: '🏪', title: 'Borib olib keting', desc: "Qulay vaqt belgilang va do'kondan tayyor mahsulotingizni olib keting." },
];

const CATEGORIES = [
  { name: 'Kiyim-kechak', icon: '👗', color: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100' },
  { name: 'Elektronika',  icon: '📱', color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' },
  { name: 'Oziq-ovqat',   icon: '🥗', color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' },
  { name: 'Sport',        icon: '⚽', color: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' },
  { name: 'Uy-joy',       icon: '🏠', color: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100' },
  { name: 'Kitoblar',     icon: '📚', color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100' },
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
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
              🇺🇿 O'zbekistoning #1 Local Pickup platformasi
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Yaqin do'kondan{' '}
              <span className="text-yellow-300">onlayn band qil,</span>
              <br />
              borib ol!
            </h1>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl leading-relaxed">
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
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border border-white/30 hover:bg-white/20 transition-all"
              >
                Do'kon ochish →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-3xl md:text-4xl font-extrabold text-indigo-600">{s.value}</p>
                <p className="text-gray-500 mt-1 font-medium text-sm">{s.label}</p>
              </div>
            ))}
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
            {STEPS.map((s) => (
              <div key={s.step} className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow card-hover">
                <div className="absolute -top-4 left-8 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  {s.step}
                </div>
                <div className="text-5xl mb-5">{s.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
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
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to="/shops"
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 ${cat.color} transition-all hover:scale-105 cursor-pointer`}
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-20 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, color: 'bg-indigo-100 text-indigo-600', title: 'Yaqin do\'konlar', desc: 'Joylashuvingizga eng yaqin do\'konlarni toping va vaqtingizni tejang.' },
              { icon: Clock, color: 'bg-green-100 text-green-600', title: 'Tez va qulay', desc: 'Band qiling, vaqt belgilang va to\'g\'ridan-to\'g\'ri olib keting. Navbat yo\'q!' },
              { icon: Shield, color: 'bg-yellow-100 text-yellow-600', title: 'Ishonchli platforma', desc: 'Barcha do\'konlar tekshirilgan. Xavfsiz band qiling.' },
            ].map((f) => (
              <div key={f.title} className="text-center p-8 bg-white rounded-2xl shadow-sm border border-indigo-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${f.color} rounded-2xl mb-5`}>
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
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
              Bepul ro'yxatdan o'tish
            </Link>
            <Link to="/shops" className="px-8 py-4 bg-transparent text-white font-semibold text-lg rounded-xl border-2 border-white/40 hover:bg-white/10 transition-all">
              Do'konlarni ko'rish
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-8 w-8 text-indigo-400" />
                <span className="text-2xl font-bold text-white">LocalPickup</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                O'zbekistondagi kichik va o'rta chakana do'konlarni raqamlashtiruvchi platforma.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Sahifalar</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shops" className="hover:text-white transition">Do'konlar</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Kirish</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Ro'yxatdan o'tish</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Aloqa</h4>
              <ul className="space-y-2 text-sm">
                <li>📍 Toshkent, O'zbekiston</li>
                <li>📞 +998 90 000 00 00</li>
                <li>✉️ info@localpickup.uz</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} LocalPickup. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
