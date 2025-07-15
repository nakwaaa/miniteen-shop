'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { productApi, Product, formatPrice } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 獲取熱門商品資料（前8樣）
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProducts({}, 1, 8); // 只取前8個商品
        if (response.success && response.data) {
          setFeaturedProducts(response.data.products);
        }
      } catch (error) {
        console.error('獲取熱門商品失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // 處理加入購物車
  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      // 可以顯示登入提示或導向登入頁面
      return;
    }

    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('加入購物車失敗:', error);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <section
        className="relative min-h-[600px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/MINITEEEN.JPG')",
        }}
      ></section>

      {/* SEVENTEEN Characters Introduction */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-6 text-gray-800">
            和 MINITEEN 一起展開冒險！
          </h3>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              每個角色都有獨特的魅力，快來探索屬於你的MINITEEN世界！
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {/* choitcherry */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/choitcherry.jpg"
                  alt="choitcherry"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">choitcherry</p>
            </div>

            {/* jjongtoram */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/jjongtoram.jpg"
                  alt="jjongtoram"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">jjongtoram</p>
            </div>

            {/* shuasumi */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/shuasumi.jpeg"
                  alt="shuasumi"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">shuasumi</p>
            </div>

            {/* OCL */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/OCL.jpg"
                  alt="OCL"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">OCL</p>
            </div>

            {/* tamtam */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/tamtam.jpeg"
                  alt="tamtam"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">tamtam</p>
            </div>

            {/* foxdungee */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/foxdungee.jpeg"
                  alt="foxdungee"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">foxdungee</p>
            </div>

            {/* ppyopuli */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/ppyopuli.jpg"
                  alt="ppyopuli"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">ppyopuli</p>
            </div>

            {/* Thepalee */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/Thepalee.jpg"
                  alt="Thepalee"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">Thepalee</p>
            </div>

            {/* kimja */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/kimja.jpeg"
                  alt="kimja"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">kimja</p>
            </div>

            {/* DOA */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/DOA.jpg"
                  alt="DOA"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">DOA</p>
            </div>

            {/* bboogyuli */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/bboogyuli.jpeg"
                  alt="bboogyuli"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">bboogyuli</p>
            </div>

            {/* nonver */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/nonver.jpg"
                  alt="nonver"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">nonver</p>
            </div>

            {/* chandalee */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                  src="/MINITEEN/chandalee.jpeg"
                  alt="chandalee"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-800 text-sm">chandalee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            熱門商品
          </h3>

          {loading ? (
            // 載入中的骨架屏
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="mb-4 cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                  </Link>
                  <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">
                      {formatPrice(product.price)}
                    </span>
                    <Button
                      variant="purple"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? '加入購物車' : '缺貨'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 查看更多按鈕 */}
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="purple-outline" size="lg">
                查看更多商品
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">訂閱電子報</h3>
          <p className="text-gray-600 mb-8">獲取最新MINITEEN資訊和獨家優惠</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="輸入您的 email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <Button
              variant="purple"
              className="rounded-l-none rounded-r-lg px-6 py-8"
            >
              訂閱
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
