// 商品類別類型
export type ProductCategory =
  | 'accessory'
  | 'stationery'
  | 'lifestyle';

// 商品資料介面
export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 商品建立請求
export interface CreateProductRequest {
  name: string;
  price: number;
  category: ProductCategory;
  image: string;
  stockCount: number;
  isNew?: boolean;
}

// 商品更新請求
export interface UpdateProductRequest {
  name?: string;
  price?: number;
  category?: ProductCategory;
  image?: string;
  inStock?: boolean;
  stockCount?: number;
  isNew?: boolean;
}

// 商品查詢篩選
export interface ProductFilter {
  category?: ProductCategory;
  inStock?: boolean;
  isNew?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// 商品分頁結果
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 商品類別資訊
export const PRODUCT_CATEGORIES = {
  photocard: { name: '小卡', icon: '📷', color: 'bg-pink-100' },
  lightstick: { name: '應援棒', icon: '💡', color: 'bg-yellow-100' },
  clothing: { name: '服飾', icon: '👕', color: 'bg-blue-100' },
  accessory: { name: '配件', icon: '💎', color: 'bg-green-100' },
  stationery: { name: '文具', icon: '✏️', color: 'bg-orange-100' },
  lifestyle: { name: '生活用品', icon: '🏠', color: 'bg-red-100' },
} as const;
