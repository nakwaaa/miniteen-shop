// 用戶介面定義
export interface User {
  id: string;
  email: string;
  password: string; // 加密後的密碼
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// 用戶註冊請求介面
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// 用戶登入請求介面
export interface LoginRequest {
  email: string;
  password: string;
}

// 用戶回應介面 (不包含密碼)
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// JWT 載荷介面
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
