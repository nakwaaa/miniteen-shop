# MINITEEN SHOP 後端 API

這是一個使用 Express.js 和 TypeScript 建立的 RESTful API，提供用戶身份驗證功能。

## 功能特色

- 🔐 JWT 身份驗證
- 🔒 bcrypt 密碼加密
- 📝 用戶註冊和登入
- 👤 用戶資料管理
- 🛡️ 安全性中間件 (helmet, cors)
- 📁 檔案系統資料庫 (JSON)
- ⚡ TypeScript 支援
- 🔄 即時重載 (nodemon)

## 安裝和運行

### 1. 安裝依賴

```bash
npm install
```

### 2. 運行後端伺服器

```bash
# 僅運行後端 (開發模式)
npm run server

# 同時運行前端和後端
npm run dev:full

# 生產模式
npm run build:backend
npm run server:prod
```

### 3. 伺服器資訊

- 後端 API 地址: `http://localhost:3001`
- 健康檢查: `http://localhost:3001/api/health`
- 前端地址: `http://localhost:3000`

## API 端點

### 身份驗證

#### 用戶註冊

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "用戶姓名"
}
```

**回應:**

```json
{
  "success": true,
  "message": "用戶註冊成功",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "用戶姓名",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

#### 用戶登入

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**回應:**

```json
{
  "success": true,
  "message": "登入成功",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "用戶姓名",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

#### 獲取用戶資料

```http
GET /api/auth/profile
Authorization: Bearer your_jwt_token_here
```

**回應:**

```json
{
  "success": true,
  "message": "獲取用戶資料成功",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "用戶姓名",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    }
  }
}
```

#### 驗證 Token

```http
GET /api/auth/verify
Authorization: Bearer your_jwt_token_here
```

**回應:**

```json
{
  "success": true,
  "message": "Token 有效",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}
```

## 錯誤處理

所有錯誤回應都遵循以下格式：

```json
{
  "success": false,
  "message": "錯誤描述"
}
```

常見 HTTP 狀態碼：

- `200` - 成功
- `201` - 建立成功
- `400` - 請求錯誤
- `401` - 未授權
- `404` - 找不到資源
- `409` - 資源衝突
- `500` - 伺服器錯誤

## 資料庫

目前使用檔案系統作為簡單的資料庫：

- 用戶資料存儲在 `backend/data/users.json`
- 資料會自動建立和更新
- 密碼使用 bcrypt 加密 (12 rounds)

## 安全性

- JWT token 有效期為 24 小時
- 密碼最少 8 個字符
- 電子郵件格式驗證
- CORS 設定限制來源
- Helmet 安全性標頭
- bcrypt 密碼哈希

## 環境變數

在 `nodemon.json` 中已設定預設值，生產環境建議使用 `.env` 檔案：

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secure-secret-key
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://your-frontend-domain.com
```

## 測試

可以使用以下工具測試 API：

- Postman
- curl
- Thunder Client (VS Code 擴充)
- REST Client (VS Code 擴充)

### curl 範例：

```bash
# 註冊
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"測試用戶"}'

# 登入
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 獲取資料 (需要 token)
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer your_token_here"
```
