import express from 'express';
import {
  getProducts,
  getProductById,
  createNewProduct,
  updateExistingProduct,
  removeProduct,
  getStats,
} from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 公開路由 - 不需要認證
// GET /api/products - 獲取商品列表（支持篩選和分頁）
router.get('/', getProducts);

// GET /api/products/analytics/stats - 獲取商品統計資料（必須在 /:id 之前）
router.get('/analytics/stats', getStats);

// GET /api/products/:id - 根據ID獲取商品詳情
router.get('/:id', getProductById);

// 需要認證的路由
// POST /api/products - 建立新商品（需要認證）
router.post('/', authenticateToken, createNewProduct);

// PUT /api/products/:id - 更新商品（需要認證）
router.put('/:id', authenticateToken, updateExistingProduct);

// DELETE /api/products/:id - 刪除商品（需要認證）
router.delete('/:id', authenticateToken, removeProduct);

export default router;
