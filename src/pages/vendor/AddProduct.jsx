import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Image, Package, Percent, Store, Tag, Warehouse } from 'lucide-react';
import api from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { PageLoader } from '../../components/SkeletonCard';
import Spinner from '../../components/Spinner';

const AddProduct = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    shopId: searchParams.get('shopId') || '',
    categoryId: '',
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    image: '',
    stockQuantity: 1,
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [shopsRes, categoriesRes] = await Promise.all([
          api.get('/shops/my-shops'),
          api.get('/products/categories'),
        ]);
        if (!active) return;
        const myShops = shopsRes.data.data.shops || [];
        setShops(myShops);
        setCategories(categoriesRes.data.data.categories || []);
        setForm((prev) => ({
          ...prev,
          shopId: prev.shopId || myShops[0]?.id || '',
        }));
      } catch {
        if (active) toast.error("Ma'lumotlarni yuklashda xatolik");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const selectedShop = useMemo(() => shops.find((s) => s.id === form.shopId), [shops, form.shopId]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shopId) {
      toast.error("Avval do'kon tanlang!");
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/products', {
        shopId: form.shopId,
        categoryId: form.categoryId || undefined,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        image: form.image,
        stockQuantity: Number(form.stockQuantity),
      });
      toast.success("Mahsulot qo'shildi!");
      if (selectedShop) navigate(`/shops/${selectedShop.slug}`);
      else navigate('/vendor/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || "Mahsulot qo'shishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  if (!shops.length) {
    return (
      <div className="page container-page">
        <EmptyState
          icon={Store}
          title="Sizda hali do'kon yo'q"
          description="Mahsulot qo'shish uchun avval o'z do'koningizni yarating."
          actionLabel="Do'kon ochish"
          actionTo="/create-shop"
        />
      </div>
    );
  }

  return (
    <div className="page container-page max-w-2xl">
      <header className="mb-7">
        <h1 className="page-title">Yangi mahsulot qo'shish</h1>
        <p className="page-subtitle">Ma'lumotlarni to'ldiring va do'koningizning katalogini to'ldiring</p>
      </header>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
        <div>
          <label htmlFor="shopId" className="label">
            Do'kon <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Store className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              id="shopId"
              required
              className="input appearance-none pl-10"
              value={form.shopId}
              onChange={set('shopId')}
            >
              {shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                  {!s.isApproved ? ' (moderatsiyada)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="label">
            Mahsulot nomi <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="title"
              type="text"
              required
              minLength={2}
              className="input pl-10"
              placeholder="Masalan: Lavash Max"
              value={form.title}
              onChange={set('title')}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="label">
              Narx (so'm) <span className="text-rose-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              min="1"
              required
              className="input"
              placeholder="35000"
              value={form.price}
              onChange={set('price')}
            />
          </div>

          <div>
            <label htmlFor="discountPrice" className="label">
              Chegirma narxi (so'm)
            </label>
            <div className="relative">
              <Percent className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="discountPrice"
                type="number"
                min="1"
                className="input pl-10"
                placeholder="Ixtiyoriy"
                value={form.discountPrice}
                onChange={set('discountPrice')}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId" className="label">
              Kategoriya
            </label>
            <select
              id="categoryId"
              className="input"
              value={form.categoryId}
              onChange={set('categoryId')}
            >
              <option value="">Tanlanmagan (Boshqa)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ''}
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stockQuantity" className="label">
              Zaxiradagi soni
            </label>
            <div className="relative">
              <Warehouse className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="stockQuantity"
                type="number"
                min="0"
                className="input pl-10"
                value={form.stockQuantity}
                onChange={set('stockQuantity')}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="image" className="label">
            Rasm URL
          </label>
          <div className="relative">
            <Image className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="image"
              type="url"
              className="input pl-10"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={set('image')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            Tavsif
          </label>
          <textarea
            id="description"
            rows={3}
            className="input"
            placeholder="Tarkibi, xususiyatlari..."
            value={form.description}
            onChange={set('description')}
          />
        </div>

        {form.discountPrice && Number(form.discountPrice) > 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <strong className="font-semibold">Aksiya:</strong> mahsulot do'konda chegirma belgisi bilan
            ko'rsatiladi va eski narx ustiga chiziladi.
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Link to="/vendor/orders" className="btn btn-outline">
            Bekor qilish
          </Link>
          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
            {submitting ? <Spinner size="sm" /> : <Package className="h-4 w-4" />}
            {submitting ? 'Saqlanmoqda...' : "Mahsulotni qo'shish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
