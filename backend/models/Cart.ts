// 購物車商品項目介面
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: string;
}

// 購物車介面
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// 加入購物車請求類型
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

// 更新購物車項目請求類型
export interface UpdateCartItemRequest {
  quantity: number;
}

// 購物車響應類型（包含商品詳細資訊）
export interface CartItemWithProduct {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    inStock: boolean;
    stockCount: number;
    isNew?: boolean;
  };
  quantity: number;
  addedAt: string;
}

// 購物車摘要資訊
export interface CartSummary {
  items: CartItemWithProduct[];
  totalItems: number;
  totalAmount: number;
}
