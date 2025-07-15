'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 處理登出
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
              >
                MINITEEN SHOP
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                認識MINITEEN
              </a>
              <a
                href="/seventeen"
                className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                SEVENTEEN
              </a>
              <a
                href="/products"
                className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                週邊商品
              </a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button variant="purple-outline" size="sm">
                🔍 搜尋
              </Button>

              {/* Shopping Cart Button - 只對登入用戶顯示 */}
              {isAuthenticated && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      router.push('/cart');
                    }}
                    className="relative"
                  >
                    🛒
                  </Button>
                  {/* 購物車商品數量標示 */}
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </div>
              )}

              {/* User Auth Section */}
              <div className="hidden md:flex space-x-2">
                {isLoading ? (
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-10 w-20 bg-gray-200 rounded"></div>
                  </div>
                ) : isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* 用戶下拉選單 */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg border z-50">
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm text-gray-500 border-b">
                            {user.email}
                          </div>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            個人資料
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            訂單記錄
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            我的收藏
                          </a>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            登出
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="purple"
                    size="default"
                    onClick={() => setShowAuthModal(true)}
                  >
                    登入/註冊
                  </Button>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button variant="purple-outline" size="sm">
                  ☰
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 點擊外部關閉用戶選單 */}
        {showUserMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          ></div>
        )}
      </header>

      {/* 認證彈窗 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
