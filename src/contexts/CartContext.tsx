'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { cartApi, Product, CartItem } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// 購物車狀態類型
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

// 購物車操作類型
interface CartActions {
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  clearError: () => void;
}

// Context類型
interface CartContextType extends CartState, CartActions {}

// 建立Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider Props
interface CartProviderProps {
  children: ReactNode;
}

// Cart Provider組件
export function CartProvider({ children }: CartProviderProps) {
  const { isAuthenticated, user } = useAuth();
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalAmount: 0,
    isLoading: false,
    error: null,
  });

  // 計算購物車總計
  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    return { totalItems, totalAmount };
  };

  // 清除錯誤
  const clearError = () => {
    setCartState((prev) => ({ ...prev, error: null }));
  };

  // 載入購物車
  const loadCart = async (): Promise<void> => {
    if (!isAuthenticated) {
      setCartState({
        items: [],
        totalItems: 0,
        totalAmount: 0,
        isLoading: false,
        error: null,
      });
      return;
    }

    setCartState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await cartApi.getCart();

      if (response.success && response.data) {
        const items = response.data.items || [];
        const { totalItems, totalAmount } = calculateTotals(items);

        setCartState({
          items,
          totalItems,
          totalAmount,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message || '載入購物車失敗');
      }
    } catch (error) {
      console.error('載入購物車失敗:', error);
      const errorMessage =
        error instanceof Error ? error.message : '載入購物車失敗';

      setCartState({
        items: [],
        totalItems: 0,
        totalAmount: 0,
        isLoading: false,
        error: errorMessage,
      });

      toast.error('載入購物車失敗', {
        description: errorMessage,
      });
    }
  };

  // 加入購物車
  const addToCart = async (
    product: Product,
    quantity: number = 1
  ): Promise<void> => {
    if (!isAuthenticated) {
      toast.error('請先登入', {
        description: '您需要先登入才能將商品加入購物車',
      });
      return;
    }

    if (!product.inStock) {
      toast.error('商品缺貨', {
        description: '此商品目前暫時缺貨',
      });
      return;
    }

    setCartState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await cartApi.addToCart(product.id, quantity);

      if (response.success && response.data) {
        const items = response.data.items || [];
        const { totalItems, totalAmount } = calculateTotals(items);

        setCartState({
          items,
          totalItems,
          totalAmount,
          isLoading: false,
          error: null,
        });

        toast.success('已加入購物車', {
          description: `${product.name} x${quantity} 已加入購物車`,
        });
      } else {
        throw new Error(response.message || '加入購物車失敗');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '加入購物車失敗';

      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error('加入購物車失敗', {
        description: errorMessage,
      });

      throw error;
    }
  };

  // 更新數量
  const updateQuantity = async (
    productId: string,
    quantity: number
  ): Promise<void> => {
    if (!isAuthenticated) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setCartState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await cartApi.updateCartItem(productId, quantity);

      if (response.success && response.data) {
        const items = response.data.items || [];
        const { totalItems, totalAmount } = calculateTotals(items);

        setCartState({
          items,
          totalItems,
          totalAmount,
          isLoading: false,
          error: null,
        });

        toast.success('購物車已更新');
      } else {
        throw new Error(response.message || '更新失敗');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新失敗';

      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error('更新失敗', {
        description: errorMessage,
      });

      throw error;
    }
  };

  // 移除商品
  const removeFromCart = async (productId: string): Promise<void> => {
    if (!isAuthenticated) return;

    setCartState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await cartApi.removeFromCart(productId);

      if (response.success && response.data) {
        const items = response.data.items || [];
        const { totalItems, totalAmount } = calculateTotals(items);

        setCartState({
          items,
          totalItems,
          totalAmount,
          isLoading: false,
          error: null,
        });

        toast.success('商品已移除');
      } else {
        throw new Error(response.message || '移除失敗');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '移除失敗';

      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error('移除失敗', {
        description: errorMessage,
      });

      throw error;
    }
  };

  // 清空購物車
  const clearCart = async (): Promise<void> => {
    if (!isAuthenticated) return;

    setCartState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await cartApi.clearCart();

      if (response.success && response.data) {
        setCartState({
          items: [],
          totalItems: 0,
          totalAmount: 0,
          isLoading: false,
          error: null,
        });

        toast.success('購物車已清空');
      } else {
        throw new Error(response.message || '清空失敗');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '清空失敗';

      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast.error('清空失敗', {
        description: errorMessage,
      });

      throw error;
    }
  };

  // 當認證狀態改變時重新載入購物車
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, user?.id]);

  // Context值
  const contextValue: CartContextType = {
    items: cartState.items,
    totalItems: cartState.totalItems,
    totalAmount: cartState.totalAmount,
    isLoading: cartState.isLoading,
    error: cartState.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
    clearError,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

// 自定義Hook
export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
