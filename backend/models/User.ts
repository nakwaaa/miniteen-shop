// 用戶介面定義
export interface User {
  id: string;
  email: string;
  password: string; // 加密後的密碼
  name: string; // 暱稱/顯示名稱
  realName?: string; // 真實姓名
  phone?: string; // 電話號碼
  birthday?: string; // 生日
  avatar?: string; // 頭像圖片路徑或 base64
  createdAt: string;
  updatedAt: string;
  passwordUpdatedAt: string; // 密碼上次更新時間
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

// 用戶資料更新請求介面
export interface UpdateProfileRequest {
  name?: string; // 暱稱/顯示名稱
  realName?: string;
  phone?: string;
  birthday?: string;
  avatar?: string; // 頭像圖片路徑或 base64
}

// 密碼變更請求介面
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// JWT 載荷介面
export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
