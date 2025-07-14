import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilter,
  ProductsResponse,
} from '../models/Product';

const PRODUCTS_FILE_PATH = path.join(__dirname, '../data/products.json');

// 讀取所有商品
export const readProducts = (): Product[] => {
  try {
    if (!fs.existsSync(PRODUCTS_FILE_PATH)) {
      return [];
    }

    const data = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8');
    return JSON.parse(data) as Product[];
  } catch (error) {
    console.error('讀取商品資料失敗:', error);
    return [];
  }
};

// 寫入商品資料
export const writeProducts = (products: Product[]): void => {
  try {
    const dataDir = path.dirname(PRODUCTS_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(
      PRODUCTS_FILE_PATH,
      JSON.stringify(products, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('寫入商品資料失敗:', error);
    throw new Error('無法儲存商品資料');
  }
};

// 根據ID查找商品
export const findProductById = (id: string): Product | null => {
  const products = readProducts();
  return products.find((product) => product.id === id) || null;
};

// 根據篩選條件獲取商品
export const getFilteredProducts = (
  filter: ProductFilter = {},
  page: number = 1,
  limit: number = 12
): ProductsResponse => {
  let products = readProducts();

  // 應用篩選條件
  if (filter.category) {
    products = products.filter(
      (product) => product.category === filter.category
    );
  }

  if (filter.inStock !== undefined) {
    products = products.filter((product) => product.inStock === filter.inStock);
  }

  if (filter.isNew !== undefined) {
    products = products.filter((product) => product.isNew === filter.isNew);
  }

  if (filter.minPrice !== undefined) {
    products = products.filter((product) => product.price >= filter.minPrice!);
  }

  if (filter.maxPrice !== undefined) {
    products = products.filter((product) => product.price <= filter.maxPrice!);
  }

  if (filter.search) {
    const searchTerm = filter.search.toLowerCase();
    products = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }

  // 計算分頁
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    total,
    page,
    limit,
    totalPages,
  };
};

// 建立新商品
export const createProduct = (productData: CreateProductRequest): Product => {
  const products = readProducts();

  const newProduct: Product = {
    id: `prod_${uuidv4().slice(0, 8)}`,
    ...productData,
    inStock: productData.stockCount > 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.push(newProduct);
  writeProducts(products);

  return newProduct;
};

// 更新商品
export const updateProduct = (
  id: string,
  updateData: UpdateProductRequest
): Product | null => {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  // 更新商品資料
  products[index] = {
    ...products[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  // 如果更新了庫存數量，同時更新庫存狀態
  if (updateData.stockCount !== undefined) {
    products[index].inStock = updateData.stockCount > 0;
  }

  writeProducts(products);
  return products[index];
};

// 刪除商品
export const deleteProduct = (id: string): boolean => {
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return false;
  }

  products.splice(index, 1);
  writeProducts(products);
  return true;
};

// 獲取商品統計資料
export const getProductStats = () => {
  const products = readProducts();

  return {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
    new: products.filter((p) => p.isNew).length,
    categories: {
      accessory: products.filter((p) => p.category === 'accessory').length,
      stationery: products.filter((p) => p.category === 'stationery').length,
      lifestyle: products.filter((p) => p.category === 'lifestyle').length,
    },
  };
};
