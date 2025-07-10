'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const { login, register } = useAuth();

  // 重置表單
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    });
  };

  // 切換模式
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  // 關閉彈窗
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 表單輸入處理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 基本驗證
    if (!formData.email.trim() || !formData.password.trim()) {
      return;
    }

    if (mode === 'register') {
      if (!formData.name.trim()) {
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      } else {
        await register({
          email: formData.email.trim(),
          password: formData.password,
          name: formData.name.trim(),
        });
      }

      // 成功後關閉彈窗
      handleClose();
    } catch (error) {
      // 錯誤處理已由 AuthContext 中的 toast 處理
      console.error('認證錯誤:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={handleClose}
      ></div>

      {/* 彈窗內容 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* 關閉按鈕 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>

          {/* 表單內容 */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {mode === 'login' ? '登入帳號' : '註冊新帳號'}
            </h2>

            {/* 表單 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 暱稱 (僅註冊時顯示) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    暱稱
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="請輸入暱稱"
                    disabled={isLoading}
                    required
                  />
                </div>
              )}

              {/* 電子郵件 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電子郵件
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="請輸入您的電子郵件"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* 密碼 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  密碼
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="請輸入密碼"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* 確認密碼 (僅註冊時顯示) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    確認密碼
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="請再次輸入密碼"
                    disabled={isLoading}
                    required
                  />
                </div>
              )}

              {/* 提交按鈕 */}
              <Button
                type="submit"
                variant="purple"
                className="w-full py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    處理中...
                  </div>
                ) : mode === 'login' ? (
                  '登入'
                ) : (
                  '註冊'
                )}
              </Button>
            </form>

            {/* 模式切換 */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {mode === 'login' ? '還沒有帳號？' : '已經有帳號了？'}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
                  disabled={isLoading}
                >
                  {mode === 'login' ? '立即註冊' : '立即登入'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
