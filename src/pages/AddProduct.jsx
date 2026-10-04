import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const AddProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '' // Will set a default category for now
  });

  // Categories placeholder (Ideally, fetch from backend)
  const categories = [
    { id: '11111111-1111-1111-1111-111111111111', name: "Kiyim-kechak" },
    { id: '22222222-2222-2222-2222-222222222222', name: "Elektronika" }
  ];

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await api.get(`/shops/slug/${slug}`);
        const foundShop = res.data.data.shop;
        
        if (foundShop.owner_id !== user?.id && user?.role !== 'super_admin') {
          toast.error("Sizda ushbu do'konga mahsulot qo'shish huquqi yo'q");
          navigate('/');
          return;
        }
        
        setShop(foundShop);
        // Quick hack: Create a dummy category if not exists to avoid foreign key errors
        // In a real app, you'd fetch real categories and let the user select
      } catch (error) {
        toast.error("Do'kon ma'lumotlarini yuklashda xato");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchShop();
    }
  }, [slug, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up empty strings to avoid PostgreSQL type errors (UUID and DECIMAL)
      const productData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        shop_id: shop.id
      };
      
      if (formData.discount_price) {
        productData.discount_price = formData.discount_price;
      }

      await api.post('/products', productData);
      toast.success("Mahsulot muvaffaqiyatli qo'shildi!");
      navigate(`/shops/${slug}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  if (loading) return <div className="text-center py-20">Yuklanmoqda...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mahsulot qo'shish ({shop?.name})</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mahsulot nomi *</label>
            <input type="text" name="title" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tavsif</label>
            <textarea name="description" rows="3" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Asosiy narxi (so'm) *</label>
              <input type="number" name="price" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Chegirma narxi (so'm)</label>
              <input type="number" name="discount_price" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Ixtiyoriy" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <h4 className="text-green-800 font-semibold mb-1">🎁 Aksiya va Chegirmalar</h4>
            <p className="text-sm text-green-700">
              Agar "Chegirma narxi" maydonini to'ldirsangiz, mahsulot do'konda avtomatik tarzda <strong>"Aksiya"</strong> belgisi bilan chiqadi va ustiga chizilgan eski narx ko'rsatiladi.
            </p>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Mahsulotni saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
