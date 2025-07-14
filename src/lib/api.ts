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

// 商品類型定義
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilter {
  category?: string;
  inStock?: boolean;
  isNew?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

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

// 商品API
export const productApi = {
  // 獲取商品列表
  getProducts: async (
    filter: ProductFilter = {},
    page: number = 1,
    limit: number = 12
  ): Promise<ApiResponse<ProductsResponse>> => {
    const params = new URLSearchParams();
    
    // 添加篩選參數
    if (filter.category) params.append('category', filter.category);
    if (filter.inStock !== undefined) params.append('inStock', filter.inStock.toString());
    if (filter.isNew !== undefined) params.append('isNew', filter.isNew.toString());
    if (filter.minPrice !== undefined) params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined) params.append('maxPrice', filter.maxPrice.toString());
    if (filter.search) params.append('search', filter.search);
    
    // 添加分頁參數
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<ProductsResponse>(endpoint);
  },

  // 根據ID獲取商品
  getProductById: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
    return apiRequest<{ product: Product }>(`/api/products/${id}`);
  },

  // 獲取商品統計資料
  getStats: async (): Promise<ApiResponse> => {
    return apiRequest('/api/products/analytics/stats');
  },

  // 建立新商品（需要認證）
  createProduct: async (productData: {
    name: string;
    price: number;
    category: string;
    image: string;
    stockCount: number;
    isNew?: boolean;
  }): Promise<ApiResponse<{ product: Product }>> => {
    const token = tokenManager.getToken();
    return apiRequest<{ product: Product }>('/api/products', {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(productData),
    });
  },

  // 更新商品（需要認證）
  updateProduct: async (
    id: string,
    updateData: Partial<{
      name: string;
      price: number;
      category: string;
      image: string;
      inStock: boolean;
      stockCount: number;
      isNew: boolean;
    }>
  ): Promise<ApiResponse<{ product: Product }>> => {
    const token = tokenManager.getToken();
    return apiRequest<{ product: Product }>(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(updateData),
    });
  },

  // 刪除商品（需要認證）
  deleteProduct: async (id: string): Promise<ApiResponse> => {
    const token = tokenManager.getToken();
    return apiRequest(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },
};

// 工具函數
export const formatPrice = (price: number): string => {
  return `NT$ ${price.toLocaleString()}`;
};
