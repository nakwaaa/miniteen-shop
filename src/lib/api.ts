// API基礎配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 用戶資料類型
export interface User {
  id: string;
  email: string;
  name: string; // 暱稱/顯示名稱
  realName?: string;
  phone?: string;
  birthday?: string;
  avatar?: string; // 頭像圖片路徑或 base64
  createdAt: string;
  updatedAt: string;
  passwordUpdatedAt: string; // 密碼上次更新時間
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

// 個人資料更新請求類型
export interface UpdateProfileRequest {
  name?: string; // 暱稱/顯示名稱
  realName?: string;
  phone?: string;
  birthday?: string;
  avatar?: string; // 頭像圖片路徑或 base64
}

// 密碼變更請求類型
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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

  // 處理 headers
  const headers = new Headers();

  // 只在非 FormData 請求時設置 Content-Type
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // 添加其他 headers
  if (options.headers) {
    const optionHeaders = new Headers(options.headers);
    optionHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const config: RequestInit = {
    ...options,
    headers,
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
    if (filter.inStock !== undefined)
      params.append('inStock', filter.inStock.toString());
    if (filter.isNew !== undefined)
      params.append('isNew', filter.isNew.toString());
    if (filter.minPrice !== undefined)
      params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined)
      params.append('maxPrice', filter.maxPrice.toString());
    if (filter.search) params.append('search', filter.search);

    // 添加分頁參數
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;

    return apiRequest<ProductsResponse>(endpoint);
  },

  // 根據ID獲取商品
  getProductById: async (
    id: string
  ): Promise<ApiResponse<{ product: Product }>> => {
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

// 購物車商品項目類型
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

// 購物車類型
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// 購物車響應類型
export interface CartResponse {
  cart: Cart;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// 購物車API
export const cartApi = {
  // 測試認證狀態
  testAuth: async (): Promise<
    ApiResponse<{ user: { id: string; email: string } }>
  > => {
    const token = tokenManager.getToken();
    console.log('測試認證 - Token:', token ? '存在' : '不存在');

    return apiRequest<{ user: { id: string; email: string } }>(
      '/api/cart/test-auth',
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
  },

  // 獲取購物車
  getCart: async (): Promise<ApiResponse<CartResponse>> => {
    const token = tokenManager.getToken();
    return apiRequest<CartResponse>('/api/cart', {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },

  // 加入商品到購物車
  addToCart: async (
    productId: string,
    quantity: number
  ): Promise<ApiResponse<CartResponse>> => {
    const token = tokenManager.getToken();
    const requestBody = { productId, quantity };

    return apiRequest<CartResponse>('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(requestBody),
    });
  },

  // 更新購物車商品數量
  updateCartItem: async (
    productId: string,
    quantity: number
  ): Promise<ApiResponse<CartResponse>> => {
    const token = tokenManager.getToken();
    return apiRequest<CartResponse>(`/api/cart/items/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ quantity }),
    });
  },

  // 從購物車移除商品
  removeFromCart: async (
    productId: string
  ): Promise<ApiResponse<CartResponse>> => {
    const token = tokenManager.getToken();
    return apiRequest<CartResponse>(`/api/cart/items/${productId}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },

  // 清空購物車
  clearCart: async (): Promise<ApiResponse<CartResponse>> => {
    const token = tokenManager.getToken();
    return apiRequest<CartResponse>('/api/cart', {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },
};

// 個人資料 API
export const profileApi = {
  // 獲取個人資料
  getProfile: async (): Promise<ApiResponse<User>> => {
    const token = tokenManager.getToken();
    return apiRequest<User>('/api/profile', {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },

  // 更新個人資料
  updateProfile: async (
    profileData: UpdateProfileRequest
  ): Promise<ApiResponse<User>> => {
    const token = tokenManager.getToken();
    return apiRequest<User>('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(profileData),
    });
  },

  // 變更密碼
  changePassword: async (
    passwordData: ChangePasswordRequest
  ): Promise<ApiResponse<void>> => {
    const token = tokenManager.getToken();
    return apiRequest<void>('/api/profile/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(passwordData),
    });
  },
};

// 上傳 API
export const uploadApi = {
  // 上傳頭像
  uploadAvatar: async (file: File): Promise<ApiResponse<User>> => {
    const token = tokenManager.getToken();

    // 創建 FormData
    const formData = new FormData();
    formData.append('avatar', file);

    return apiRequest<User>('/api/upload/avatar', {
      method: 'POST',
      headers: {
        // 注意：不要設置 Content-Type，讓瀏覽器自動設置以包含 boundary
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
  },
};

// 工具函數
export const formatPrice = (price: number): string => {
  return `NT$ ${price.toLocaleString()}`;
};
