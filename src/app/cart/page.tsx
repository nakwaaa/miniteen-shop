'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const {
    items: cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
    error,
  } = useCart();

  // 分類中文映射
  const categoryMap: { [key: string]: string } = {
    accessory: '配件',
    stationery: '文具',
    lifestyle: '生活用品',
  };

  // 計算總計
  const calculateTotals = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shippingFee = subtotal >= 1000 ? 0 : 80;
    const totalAmount = subtotal + shippingFee;
    return { totalItems, subtotal, shippingFee, totalAmount };
  };

  // 處理數量更新
  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('更新數量失敗:', error);
    }
  };

  // 處理移除商品
  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('移除商品失敗:', error);
    }
  };

  // 處理清空購物車
  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('清空購物車失敗:', error);
    }
  };

  const { totalItems, subtotal, shippingFee, totalAmount } = calculateTotals();

  // 載入狀態
  if (isLoading && cartItems.length === 0) {
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
  if (error) {
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
            <p className="text-lg font-medium">{error}</p>
          </div>
          <Link href="/products">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              返回商品頁面
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 未登入狀態
  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">請先登入</h1>
          <p className="text-gray-600 mb-8">您需要先登入才能查看購物車</p>
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              返回首頁
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 空購物車狀態
  if (cartItems.length === 0) {
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
              <span className="text-gray-900">購物車</span>
            </nav>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M16 19a2 2 0 11-4 0 2 2 0 014 0zM10 19a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              您的購物車是空的
            </h1>
            <p className="text-gray-600 mb-8">
              還沒有選購任何商品，快去看看我們的週邊商品吧！
            </p>
            <Link href="/products">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                繼續購物
              </Button>
            </Link>
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
            <span className="text-gray-900">購物車</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* 購物車商品列表 */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* 標題 */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">
                    購物車 ({totalItems} 件商品)
                  </h1>
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    disabled={isLoading}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    清空購物車
                  </Button>
                </div>
              </div>

              {/* 商品列表 */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="px-6 py-6">
                    <div className="flex items-start space-x-4">
                      {/* 商品圖片 */}
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback =
                                  target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* 佔位圖 */}
                          <div
                            className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"
                            style={{
                              display: item.product.image ? 'none' : 'flex',
                            }}
                          >
                            <span className="text-white font-bold text-xs text-center px-1">
                              {item.product.name.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 商品資訊 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              分類：
                              {categoryMap[item.product.category] ||
                                item.product.category}
                            </p>
                            <p className="text-lg font-semibold text-purple-600">
                              {formatPrice(item.product.price)}
                            </p>
                          </div>

                          {/* 操作區域 */}
                          <div className="flex items-center space-x-4 ml-4">
                            {/* 數量調整 */}
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={isLoading || item.quantity <= 1}
                                className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  isLoading ||
                                  item.quantity >= item.product.stockCount
                                }
                                className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* 小計 */}
                            <div className="text-right min-w-[100px]">
                              <p className="text-lg font-semibold text-gray-900">
                                {formatPrice(
                                  item.product.price * item.quantity
                                )}
                              </p>
                            </div>

                            {/* 移除按鈕 */}
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              disabled={isLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                              title="移除商品"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* 庫存提示 */}
                        {item.product.stockCount <= 5 && (
                          <p className="text-sm text-orange-600 mt-2">
                            僅剩 {item.product.stockCount} 件
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 結帳摘要 */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                訂單摘要
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">商品小計</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">運費</span>
                  <span className="text-gray-900">
                    {shippingFee === 0 ? '免運費' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      總計
                    </span>
                    <span className="text-xl font-bold text-purple-600">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                  disabled={isLoading}
                >
                  前往結帳
                </Button>
              </div>

              {/* 繼續購物 */}
              <div className="mt-2">
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span>繼續購物</span>
                  </Button>
                </Link>
              </div>

              {/* 優惠資訊 */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    滿 NT$ 1,000 享免運費
                  </span>
                </div>
                {subtotal < 1000 && (
                  <p className="text-xs text-green-700 mt-1">
                    再購買 {formatPrice(1000 - subtotal)} 即可享免運費
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
