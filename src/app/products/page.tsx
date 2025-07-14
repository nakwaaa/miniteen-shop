'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { productApi, Product, ProductFilter, formatPrice } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { value: '', label: '全部' },
    { value: 'accessory', label: '配件' },
    { value: 'stationery', label: '文具' },
    { value: 'lifestyle', label: '生活用品' },
  ];

  // 獲取商品資料
  const fetchProducts = async (category: string = '', page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const filter: ProductFilter = {};
      if (category) {
        filter.category = category;
      }

      const response = await productApi.getProducts(filter, page, 12);

      if (response.success && response.data) {
        setProducts(response.data.products);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.totalPages);
      } else {
        throw new Error(response.message || '獲取商品失敗');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '載入商品時發生錯誤';
      setError(errorMessage);
      toast.error('載入失敗', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // 組件掛載時載入商品
  useEffect(() => {
    fetchProducts(selectedCategory, currentPage);
  }, [selectedCategory, currentPage]);

  // 處理分類篩選
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 重置到第一頁
  };

  // 處理分頁
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滾動到頁面頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 處理加入購物車
  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast.error('請先登入', {
        description: '您需要先登入才能將商品加入購物車，請點擊右上角的登入按鈕',
      });
      return;
    }

    try {
      await addToCart(product, 1);
      // 成功訊息已在 CartContext 中處理
    } catch (error) {
      // 錯誤處理已在 CartContext 中完成
      console.error('加入購物車失敗:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面標題 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">週邊商品</h1>
          <p className="mt-2 text-gray-600">探索所有 MINITEEN 官方週邊商品</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 篩選區域 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={
                  selectedCategory === category.value
                    ? 'purple'
                    : 'purple-outline'
                }
                size="sm"
                onClick={() => handleCategoryChange(category.value)}
                disabled={loading}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 載入狀態 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">載入中...</span>
          </div>
        )}

        {/* 錯誤狀態 */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-lg font-medium">{error}</p>
            </div>
            <Button
              variant="purple"
              onClick={() => fetchProducts(selectedCategory, currentPage)}
            >
              重新載入
            </Button>
          </div>
        )}

        {/* 商品網格 */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">目前沒有符合條件的商品</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                    >
                      {/* 可點擊的商品詳情區域 */}
                      <Link href={`/products/${product.id}`} className="block">
                        {/* 商品圖片區域 */}
                        <div className="relative aspect-square overflow-hidden">
                          {/* 商品圖片 */}
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                // 圖片載入失敗時顯示佔位圖
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback =
                                  target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* 佔位圖 (圖片載入失敗時顯示) */}
                          <div
                            className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 bg-cover bg-center group-hover:scale-105 transition-transform duration-300 flex items-center justify-center"
                            style={{ display: product.image ? 'none' : 'flex' }}
                          >
                            <span className="text-white font-bold text-lg text-center px-4">
                              {product.name.split(' ')[0]}
                            </span>
                          </div>

                          {/* 標籤區域 */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.isNew && (
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                                新品
                              </span>
                            )}
                          </div>

                          {/* 庫存狀態 */}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                              <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium">
                                暫時缺貨
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 商品資訊區域 */}
                        <div className="p-4">
                          {/* 商品名稱 */}
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                            {product.name}
                          </h3>

                          {/* 價格區域 */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-purple-600">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                            {product.inStock && product.stockCount <= 20 && (
                              <span className="text-xs text-orange-600 font-medium">
                                僅剩 {product.stockCount} 件
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* 操作按鈕 */}
                      <div className="p-4 pt-0">
                        <div className="flex gap-2">
                          <Button
                            variant={product.inStock ? 'purple' : 'outline'}
                            className="flex-1"
                            disabled={!product.inStock}
                            onClick={() => handleAddToCart(product)}
                          >
                            {product.inStock ? '加入購物車' : '暫時缺貨'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 分頁控制 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <Button
                  variant="purple-outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  上一頁
                </Button>

                {/* 頁碼 */}
                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, index) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (currentPage <= 3) {
                        pageNum = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + index;
                      } else {
                        pageNum = currentPage - 2 + index;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum
                              ? 'purple'
                              : 'purple-outline'
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="purple-outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  下一頁
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
