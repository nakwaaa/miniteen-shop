import express from 'express';
import {
  getCart,
  addToCartHandler,
  updateCartItem,
  removeFromCartHandler,
  clearCartHandler,
} from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 測試認證狀態的端點
router.get('/test-auth', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: '認證成功',
    user: req.user,
  });
});

// 所有購物車路由都需要認證
router.use(authenticateToken);

// GET /api/cart - 獲取用戶購物車
router.get('/', getCart);

// POST /api/cart/add - 加入商品到購物車
router.post('/add', addToCartHandler);

// PUT /api/cart/items/:productId - 更新購物車商品數量
router.put('/items/:productId', updateCartItem);

// DELETE /api/cart/items/:productId - 從購物車移除商品
router.delete('/items/:productId', removeFromCartHandler);

// DELETE /api/cart - 清空購物車
router.delete('/', clearCartHandler);

export default router;
