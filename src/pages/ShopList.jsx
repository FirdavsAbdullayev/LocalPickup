import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await api.get('/shops');
        setShops(res.data.data.shops);
      } catch (error) {
        console.error("Do'konlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  if (loading) return <div className="text-center py-20 text-lg">Yuklanmoqda...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Barcha do'konlar</h1>
        <Link to="/create-shop" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          + Yangi do'kon
        </Link>
      </div>
      
      {shops.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">
          Hozircha do'konlar mavjud emas
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition">
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {shop.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">
                  {shop.description || "Ma'lumot kiritilmagan"}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="font-medium mr-2">Manzil:</span>
                  {shop.address || "Kiritilmagan"}
                </div>
                <Link to={`/shops/${shop.slug}`} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Do'konga kirish
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList;
