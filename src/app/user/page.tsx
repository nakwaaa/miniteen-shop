'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  profileApi,
  uploadApi,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/lib/api';

interface UserProfile {
  name: string; // 暱稱/顯示名稱
  email: string;
  realName: string; // 真實姓名
  phone: string;
  birthday: string;
  avatar: string; // 頭像圖片路徑或 base64
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    name: '',
    email: '',
    realName: '',
    phone: '',
    birthday: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // 載入用戶資料
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const response = await profileApi.getProfile();
          if (response.success && response.data) {
            setProfileData({
              name: response.data.name || '',
              email: response.data.email || '',
              realName: response.data.realName || '',
              phone: response.data.phone || '',
              birthday: response.data.birthday || '',
              avatar: response.data.avatar || '',
            });
          }
        } catch (error) {
          console.error('載入個人資料錯誤:', error);
          // 如果 API 失敗，使用 user context 中的基本資料
          setProfileData({
            name: user.name || '',
            email: user.email || '',
            realName: '',
            phone: '',
            birthday: '',
            avatar: user.avatar || '',
          });
        }
      }
    };

    loadUserProfile();
  }, [user]);

  // 更新個人資料
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // 前端驗證
    if (profileData.name.trim().length === 0) {
      toast.error('暱稱不能為空白');
      return;
    }

    // 真實姓名是選填的，可以為空白

    // 驗證電話格式（如果有填寫）
    if (profileData.phone.trim().length > 0) {
      // 電話號碼驗證：必須是10位純數字
      const phoneRegex = /^\d{10}$/;

      if (!phoneRegex.test(profileData.phone.trim())) {
        toast.error('電話格式不正確（必須是10位數字）');
        return;
      }
    }

    // 驗證生日格式（如果有填寫）
    if (profileData.birthday.trim().length > 0) {
      const date = new Date(profileData.birthday.trim());
      if (isNaN(date.getTime())) {
        toast.error('生日格式不正確（請使用 YYYY-MM-DD 格式）');
        return;
      }
    }

    setLoading(true);

    try {
      const updateData: UpdateProfileRequest = {
        name: profileData.name.trim(),
        realName: profileData.realName, // 真實姓名可以為空白，不需要 trim
        phone: profileData.phone.trim(),
        birthday: profileData.birthday.trim(),
      };

      const response = await profileApi.updateProfile(updateData);

      if (response.success) {
        toast.success('個人資料更新成功！');
        setIsEditingProfile(false);

        // 更新本地狀態
        if (response.data) {
          setProfileData({
            name: response.data.name || '',
            email: response.data.email || '',
            realName: response.data.realName || '',
            phone: response.data.phone || '',
            birthday: response.data.birthday || '',
            avatar: response.data.avatar || '',
          });
        }

        // 短暫延遲後重新載入頁面以確保 Header 同步
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response.message || '更新失敗，請稍後再試');
        console.error('後端驗證失敗:', response);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      if (error instanceof Error && error.message) {
        toast.error(error.message);
      } else {
        toast.error('更新失敗，請稍後再試');
      }
    } finally {
      setLoading(false);
    }
  };

  // 更改密碼
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('新密碼與確認密碼不一致');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('新密碼長度至少需要 6 個字符');
      return;
    }

    setLoading(true);

    try {
      const changePasswordData: ChangePasswordRequest = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      const response = await profileApi.changePassword(changePasswordData);

      if (response.success) {
        toast.success('密碼更新成功！');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);

        // 短暫延遲後重新載入頁面以顯示最新的密碼更新時間
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response.message || '密碼更新失敗，請稍後再試');
      }
    } catch (error) {
      toast.error('密碼更新失敗，請稍後再試');
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 處理頭像上傳
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 檢查檔案類型
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('請上傳 JPG、PNG、GIF 或 WebP 格式的圖片');
      return;
    }

    // 檢查檔案大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('圖片檔案過大，請上傳小於 2MB 的圖片');
      return;
    }

    setUploadingAvatar(true);

    try {
      // 直接上傳文件，不需要轉換為 BASE64
      const response = await uploadApi.uploadAvatar(file);

      if (response.success && response.data) {
        toast.success('頭像更新成功！');

        // 更新本地狀態
        setProfileData((prev) => ({
          ...prev,
          avatar: response.data!.avatar || '',
        }));

        // 短暫延遲後重新載入頁面以確保所有狀態同步
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response.message || '頭像更新失敗');
      }
    } catch (error) {
      console.error('頭像上傳錯誤:', error);
      toast.error('頭像上傳失敗，請稍後再試');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">請先登入</h1>
          <p className="text-gray-600">您需要登入才能查看個人資料</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">個人資料</h1>
          <p className="text-gray-600 mt-2">管理您的個人資訊和帳戶設定</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 側邊欄 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div
                  className="flex 
                items-center justify-center mx-auto"
                >
                  <div className="relative">
                    {profileData.avatar ? (
                      <Image
                        src={profileData.avatar}
                        alt="用戶頭像"
                        width={128}
                        height={128}
                        priority
                        className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center border-4 border-purple-200">
                        <span className="text-3xl font-bold text-purple-600">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}

                    {/* 上傳按鈕 - 右下角圓形圖標 */}
                    <label className="absolute -bottom-0 -right-0 cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                      <div className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-colors duration-200">
                        {uploadingAvatar ? (
                          <svg
                            className="w-4 h-4 text-white animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {profileData.name || '用戶'}
                </h3>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* 主要內容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 個人資料區塊 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  個人資訊
                </h2>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  {isEditingProfile ? '取消編輯' : '編輯資料'}
                </button>
              </div>

              {!isEditingProfile ? (
                // 顯示模式
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        暱稱
                      </label>
                      <p className="text-gray-900">
                        {profileData.name || '未設定'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        真實姓名
                      </label>
                      <p className="text-gray-900">
                        {profileData.realName || '未設定'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電子郵件
                      </label>
                      <p className="text-gray-900">
                        {profileData.email || '未設定'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電話號碼
                      </label>
                      <p className="text-gray-900">
                        {profileData.phone || '未設定'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        生日
                      </label>
                      <p className="text-gray-900">
                        {profileData.birthday || '未設定'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // 編輯模式
                <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        暱稱 *
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        真實姓名
                      </label>
                      <input
                        type="text"
                        value={profileData.realName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            realName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電子郵件 *
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        電話號碼
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="例如：0912-345-678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        生日
                      </label>
                      <input
                        type="date"
                        value={profileData.birthday}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            birthday: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? '更新中...' : '儲存變更'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 密碼變更區塊 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  密碼設定
                </h2>
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  {isChangingPassword ? '取消' : '變更密碼'}
                </button>
              </div>

              {!isChangingPassword ? (
                <div className="p-6">
                  <p className="text-gray-600 mb-6">您的密碼已加密保護</p>
                  {user?.passwordUpdatedAt && (
                    <>
                      <p className="text-sm text-gray-500 mt-1">
                        上次更新密碼：
                        {new Date(user.passwordUpdatedAt).toLocaleString(
                          'zh-TW',
                          {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        帳號建立時間：
                        {user?.createdAt &&
                          new Date(user.createdAt).toLocaleString('zh-TW', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        目前密碼 *
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        新密碼 *
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        密碼長度至少 6 個字符
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        確認新密碼 *
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? '更新中...' : '更新密碼'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                      className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
