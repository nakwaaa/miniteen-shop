// API基礎配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 用戶資料類型
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// 認證響應類型
export interface AuthResponse {
  user: User;
  token: string;
}

// 註冊請求類型
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// 登入請求類型
export interface LoginRequest {
  email: string;
  password: string;
}

// API響應類型
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// API錯誤類
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// 通用API請求函數
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.message || '請求失敗', response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : '網路錯誤');
  }
}

// Token管理
export const tokenManager = {
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },

  hasToken: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};

// 認證API
export const authApi = {
  // 用戶註冊
  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 用戶登入
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 獲取用戶資料（需要token）
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const token = tokenManager.getToken();
    return apiRequest<{ user: User }>('/api/auth/profile', {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },

  // 驗證token
  verifyToken: async (): Promise<ApiResponse> => {
    const token = tokenManager.getToken();
    return apiRequest('/api/auth/verify', {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },
};
