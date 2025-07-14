import { Request, Response } from 'express';
import {
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  calculateCartSummary,
} from '../utils/cartDatabase';
import { AddToCartRequest, UpdateCartItemRequest } from '../models/Cart';

// 獲取用戶購物車
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '用戶未認證',
      });
      return;
    }

    const cart = getUserCart(userId);
    const summary = calculateCartSummary(cart);

    res.status(200).json({
      success: true,
      message: '購物車獲取成功',
      data: {
        cart,
        items: summary.items,
        totalItems: summary.totalItems,
        totalAmount: summary.totalAmount,
      },
    });
  } catch (error) {
    console.error('獲取購物車失敗:', error);
    res.status(500).json({
      success: false,
      message: '獲取購物車失敗',
      error: error instanceof Error ? error.message : '未知錯誤',
    });
  }
};

// 加入商品到購物車
export const addToCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '用戶未認證',
      });
      return;
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: '請求體為空',
      });
      return;
    }

    const { productId, quantity }: AddToCartRequest = req.body;

    if (!productId || !quantity || quantity <= 0) {
      res.status(400).json({
        success: false,
        message: '商品ID和數量為必填項目',
      });
      return;
    }

    const cart = addToCart(userId, productId, quantity);
    const summary = calculateCartSummary(cart);

    res.status(200).json({
      success: true,
      message: '商品已加入購物車',
      data: {
        cart,
        items: summary.items,
        totalItems: summary.totalItems,
        totalAmount: summary.totalAmount,
      },
    });
  } catch (error) {
    console.error('加入購物車失敗:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '加入購物車失敗',
    });
  }
};

// 更新購物車商品數量
export const updateCartItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { quantity }: UpdateCartItemRequest = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '用戶未認證',
      });
      return;
    }

    if (!productId || quantity === undefined || quantity < 0) {
      res.status(400).json({
        success: false,
        message: '商品ID和數量為必填項目',
      });
      return;
    }

    const cart = updateCartItemQuantity(userId, productId, quantity);
    const summary = calculateCartSummary(cart);

    res.status(200).json({
      success: true,
      message: '購物車已更新',
      data: {
        cart,
        items: summary.items,
        totalItems: summary.totalItems,
        totalAmount: summary.totalAmount,
      },
    });
  } catch (error) {
    console.error('更新購物車失敗:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '更新購物車失敗',
    });
  }
};

// 從購物車移除商品
export const removeFromCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '用戶未認證',
      });
      return;
    }

    if (!productId) {
      res.status(400).json({
        success: false,
        message: '商品ID為必填項目',
      });
      return;
    }

    const cart = removeFromCart(userId, productId);
    const summary = calculateCartSummary(cart);

    res.status(200).json({
      success: true,
      message: '商品已移除',
      data: {
        cart,
        items: summary.items,
        totalItems: summary.totalItems,
        totalAmount: summary.totalAmount,
      },
    });
  } catch (error) {
    console.error('移除商品失敗:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '移除商品失敗',
    });
  }
};

// 清空購物車
export const clearCartHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '用戶未認證',
      });
      return;
    }

    const cart = clearCart(userId);
    const summary = calculateCartSummary(cart);

    res.status(200).json({
      success: true,
      message: '購物車已清空',
      data: {
        cart,
        items: summary.items,
        totalItems: summary.totalItems,
        totalAmount: summary.totalAmount,
      },
    });
  } catch (error) {
    console.error('清空購物車失敗:', error);
    res.status(500).json({
      success: false,
      message: '清空購物車失敗',
      error: error instanceof Error ? error.message : '未知錯誤',
    });
  }
};
