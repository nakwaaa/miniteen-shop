import { v4 as uuidv4 } from 'uuid';
import {
  Cart,
  CartItem,
  CartItemWithProduct,
  CartSummary,
} from '../models/Cart';
import { findProductById } from './productDatabase';

// 模擬購物車資料庫（按用戶ID分組）
const cartDatabase: { [userId: string]: Cart } = {};

/**
 * 根據用戶ID獲取購物車
 */
export const getUserCart = (userId: string): Cart => {
  if (!cartDatabase[userId]) {
    // 為新用戶創建空購物車
    cartDatabase[userId] = {
      id: uuidv4(),
      userId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return cartDatabase[userId];
};

/**
 * 將商品加入購物車
 */
export const addToCart = (
  userId: string,
  productId: string,
  quantity: number
): Cart => {
  // 檢查商品是否存在
  const product = findProductById(productId);
  if (!product) {
    throw new Error('商品不存在');
  }

  if (!product.inStock) {
    throw new Error('商品已缺貨');
  }

  if (quantity <= 0) {
    throw new Error('數量必須大於0');
  }

  if (quantity > product.stockCount) {
    throw new Error(`庫存不足，僅剩 ${product.stockCount} 件`);
  }

  const cart = getUserCart(userId);

  // 檢查商品是否已在購物車中
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId === productId
  );

  if (existingItemIndex !== -1) {
    // 商品已存在，更新數量
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    if (newQuantity > product.stockCount) {
      throw new Error(`庫存不足，僅剩 ${product.stockCount} 件`);
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // 新增商品到購物車
    const newItem: CartItem = {
      id: uuidv4(),
      productId,
      quantity,
      addedAt: new Date().toISOString(),
    };
    cart.items.push(newItem);
  }

  cart.updatedAt = new Date().toISOString();
  return cart;
};

/**
 * 更新購物車商品數量
 */
export const updateCartItemQuantity = (
  userId: string,
  productId: string,
  quantity: number
): Cart => {
  const cart = getUserCart(userId);
  const itemIndex = cart.items.findIndex(
    (item) => item.productId === productId
  );

  if (itemIndex === -1) {
    throw new Error('購物車中找不到該商品');
  }

  if (quantity <= 0) {
    // 數量為0時移除商品
    cart.items.splice(itemIndex, 1);
  } else {
    // 檢查庫存
    const product = findProductById(productId);
    if (!product) {
      throw new Error('商品不存在');
    }

    if (quantity > product.stockCount) {
      throw new Error(`庫存不足，僅剩 ${product.stockCount} 件`);
    }

    cart.items[itemIndex].quantity = quantity;
  }

  cart.updatedAt = new Date().toISOString();
  return cart;
};

/**
 * 從購物車移除商品
 */
export const removeFromCart = (userId: string, productId: string): Cart => {
  const cart = getUserCart(userId);
  const itemIndex = cart.items.findIndex(
    (item) => item.productId === productId
  );

  if (itemIndex === -1) {
    throw new Error('購物車中找不到該商品');
  }

  cart.items.splice(itemIndex, 1);
  cart.updatedAt = new Date().toISOString();
  return cart;
};

/**
 * 清空購物車
 */
export const clearCart = (userId: string): Cart => {
  const cart = getUserCart(userId);
  cart.items = [];
  cart.updatedAt = new Date().toISOString();
  return cart;
};

/**
 * 計算購物車摘要（包含商品詳細資訊和總計）
 */
export const calculateCartSummary = (cart: Cart): CartSummary => {
  const items: CartItemWithProduct[] = cart.items.map((item) => {
    const product = findProductById(item.productId);

    if (!product) {
      throw new Error(`商品 ${item.productId} 不存在`);
    }

    return {
      id: item.id,
      productId: item.productId,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        inStock: product.inStock,
        stockCount: product.stockCount,
        isNew: product.isNew,
      },
      quantity: item.quantity,
      addedAt: item.addedAt,
    };
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return {
    items,
    totalItems,
    totalAmount,
  };
};

/**
 * 檢查購物車商品的庫存狀態
 */
export const validateCartStock = (
  cart: Cart
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  for (const item of cart.items) {
    const product = findProductById(item.productId);

    if (!product) {
      errors.push(`商品 ${item.productId} 不存在`);
      continue;
    }

    if (!product.inStock) {
      errors.push(`${product.name} 已缺貨`);
      continue;
    }

    if (item.quantity > product.stockCount) {
      errors.push(`${product.name} 庫存不足，僅剩 ${product.stockCount} 件`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
