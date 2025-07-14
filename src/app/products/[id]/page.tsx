'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { productApi, Product, formatPrice } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const productId = params.id as string;

  // 分類中文映射
  const categoryMap: { [key: string]: string } = {
    accessory: '配件',
    stationery: '文具',
    lifestyle: '生活用品',
  };

  // 獲取商品詳情
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productApi.getProductById(productId);

      if (response.success && response.data) {
        setProduct(response.data.product);
      } else {
        throw new Error(response.message || '商品不存在');
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
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // 處理數量變更
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && product && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  // 處理加入購物車
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('請先登入', {
        description: '您需要先登入才能將商品加入購物車',
      });
      return;
    }

    if (!product || !product.inStock) {
      return;
    }

    // TODO: 實際的購物車邏輯
    toast.success('已加入購物車', {
      description: `${product.name} x${quantity} 已加入購物車`,
    });
  };

  // 載入狀態
  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="mt-3 text-gray-600">載入中...</span>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error || !product) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 mb-6">
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
            <p className="text-lg font-medium">{error || '商品不存在'}</p>
          </div>
          <div className="space-x-4">
            <Button variant="purple-outline" onClick={() => fetchProduct()}>
              重新載入
            </Button>
            <Button variant="purple" onClick={() => router.back()}>
              返回上頁
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 麵包屑導航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-purple-600">
              首頁
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-purple-600">
              週邊商品
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* 商品圖片區域 */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 圖片載入失敗時顯示佔位圖
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* 佔位圖 */}
                <div
                  className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"
                  style={{ display: product.image ? 'none' : 'flex' }}
                >
                  <span className="text-white font-bold text-2xl text-center px-4">
                    {product.name.split(' ')[0]}
                  </span>
                </div>

                {/* 商品標籤 */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-green-500 text-white text-sm px-3 py-1 rounded">
                      新品
                    </span>
                  )}
                </div>

                {/* 缺貨遮罩 - 覆蓋整個圖片 */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium">
                      暫時缺貨
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 商品資訊區域 */}
            <div className="space-y-6">
              {/* 商品名稱 */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600">
                  分類：{categoryMap[product.category] || product.category}
                </p>
              </div>

              {/* 價格 */}
              <div className="border-b pb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-purple-600">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              {/* 庫存資訊 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">庫存狀態：</span>
                  <span
                    className={
                      product.inStock ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {product.inStock ? '有庫存' : '暫時缺貨'}
                  </span>
                </div>
                {product.inStock && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">剩餘數量：</span>
                    <span className="text-gray-900">
                      {product.stockCount} 件
                    </span>
                  </div>
                )}
              </div>

              {/* 數量選擇 */}
              {product.inStock && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">數量：</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="purple-outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {quantity}
                      </span>
                      <Button
                        variant="purple-outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stockCount}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* 加入購物車按鈕 */}
                  <div className="flex gap-3">
                    <Button
                      variant="purple"
                      size="lg"
                      className="flex-1"
                      onClick={handleAddToCart}
                    >
                      加入購物車
                    </Button>
                    <Button
                      variant="purple-outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => router.push('/products')}
                    >
                      繼續購物
                    </Button>
                  </div>
                </div>
              )}

              {/* 缺貨時的按鈕 */}
              {!product.inStock && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    disabled
                  >
                    商品暫時缺貨
                  </Button>
                  <Button
                    variant="purple"
                    size="lg"
                    className="flex-1"
                    onClick={() => router.push('/products')}
                  >
                    查看其他商品
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
