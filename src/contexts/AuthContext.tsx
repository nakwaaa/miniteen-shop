'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  authApi,
  tokenManager,
  User,
  LoginRequest,
  RegisterRequest,
} from '@/lib/api';
import { toast } from 'sonner';

// 認證狀態類型
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// 認證操作類型
interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// Context類型
interface AuthContextType extends AuthState, AuthActions {}

// 建立Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider組件
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // 登入函數
  const login = async (credentials: LoginRequest): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.login(credentials);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // 保存token
        tokenManager.setToken(token);

        // 更新狀態
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        // 顯示成功 toast
        toast.success(`歡迎回來，${user.name}！`, {
          description: '登入成功',
          duration: 3000,
        });
      } else {
        throw new Error(response.message || '登入失敗');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      // 顯示錯誤 toast
      const errorMessage =
        error instanceof Error ? error.message : '登入失敗，請稍後再試';
      toast.error('登入失敗', {
        description: errorMessage,
        duration: 4000,
      });

      throw error;
    }
  };

  // 註冊函數
  const register = async (userData: RegisterRequest): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.register(userData);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // 保存token
        tokenManager.setToken(token);

        // 更新狀態
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });

        // 顯示成功 toast
        toast.success(`歡迎加入，${user.name}！`, {
          description: '註冊成功，已自動登入',
          duration: 3000,
        });
      } else {
        throw new Error(response.message || '註冊失敗');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      // 顯示錯誤 toast
      const errorMessage =
        error instanceof Error ? error.message : '註冊失敗，請稍後再試';
      toast.error('註冊失敗', {
        description: errorMessage,
        duration: 4000,
      });

      throw error;
    }
  };

  // 登出函數
  const logout = (): void => {
    const currentUser = authState.user;

    tokenManager.removeToken();
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    // 顯示登出 toast
    toast.info('已成功登出', {
      description: currentUser
        ? `再見，${currentUser.name}！`
        : '期待您再次光臨',
      duration: 2000,
    });
  };

  // 檢查認證狀態
  const checkAuth = async (): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      if (!tokenManager.hasToken()) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      // 獲取用戶資料
      const profileResponse = await authApi.getProfile();

      if (profileResponse.success && profileResponse.data) {
        setAuthState({
          user: profileResponse.data.user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        logout();
      }
    } catch (error) {
      console.error('認證檢查失敗:', error);
      logout();
    }
  };

  // 組件掛載時檢查認證狀態
  useEffect(() => {
    checkAuth();
  }, []);

  // Context值
  const contextValue: AuthContextType = {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// 自定義Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
