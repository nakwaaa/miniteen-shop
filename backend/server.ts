import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

// 導入路由
import authRoutes from './routes/auth';
import productRoutes from './routes/products';

const app = express();
const PORT = process.env.PORT || 3001;

// 中間件設定
app.use(helmet()); // 安全性標頭
app.use(morgan('combined')); // 請求記錄
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
); // 跨域設定
app.use(express.json({ limit: '10mb' })); // JSON 解析
app.use(express.urlencoded({ extended: true })); // URL 編碼解析

// 路由設定
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// 健康檢查端點
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MINITEEN SHOP 後端伺服器運行正常',
    timestamp: new Date().toISOString(),
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '找不到請求的端點',
  });
});

// 全域錯誤處理
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // next: express.NextFunction
  ) => {
    console.error('伺服器錯誤:', err.stack);
    res.status(500).json({
      success: false,
      message: '伺服器內部錯誤',
    });
  }
);

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 MINITEEN SHOP 後端伺服器運行在端口 ${PORT}`);
  console.log(`📊 環境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 健康檢查: http://localhost:${PORT}/api/health`);
});

export default app;
