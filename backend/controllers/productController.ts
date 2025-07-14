import { Request, Response } from 'express';
import {
  getFilteredProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from '../utils/productDatabase';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilter,
} from '../models/Product';

// 獲取商品列表
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      category,
      inStock,
      isNew,
      minPrice,
      maxPrice,
      search,
      page = '1',
      limit = '12',
    } = req.query;

    const filter: ProductFilter = {};

    if (category) filter.category = category as any;
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    if (isNew !== undefined) filter.isNew = isNew === 'true';
    if (minPrice) filter.minPrice = Number(minPrice);
    if (maxPrice) filter.maxPrice = Number(maxPrice);
    if (search) filter.search = search as string;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 12;

    const result = getFilteredProducts(filter, pageNum, limitNum);

    res.status(200).json({
      success: true,
      message: '商品列表獲取成功',
      data: result,
    });
  } catch (error) {
    console.error('獲取商品列表失敗:', error);
    res.status(500).json({
      success: false,
      message: '獲取商品列表失敗',
      error: error instanceof Error ? error.message : '未知錯誤',
    });
  }
};

// 根據ID獲取單一商品
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: '商品ID為必填項目',
      });
      return;
    }

    const product = findProductById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: '商品不存在',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '商品獲取成功',
      data: { product },
    });
  } catch (error) {
    console.error('獲取商品失敗:', error);
    res.status(500).json({
      success: false,
      message: '獲取商品失敗',
      error: error instanceof Error ? error.message : '未知錯誤',
    });
  }
};

// 建立新商品
export const createNewProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productData: CreateProductRequest = req.body;

    // 基本驗證
    if (
      !productData.name ||
      !productData.price ||
      !productData.category ||
      !productData.image ||
      productData.stockCount === undefined
    ) {
      res.status(400).json({
        success: false,
        message: '缺少必要的商品資訊',
      });
      return;
    }

    // 價格驗證
    if (productData.price <= 0) {
      res.status(400).json({
        success: false,
        message: '商品價格必須大於0',
      });
      return;
    }

    // 庫存驗證
    if (productData.stockCount < 0) {
      res.status(400).json({
        success: false,
        message: '庫存數量不能為負數',
      });
      return;
    }

    const newProduct = createProduct(productData);

    res.status(201).json({
      success: true,
      message: '商品建立成功',
      data: { product: newProduct },
    });
  } catch (error) {
    console.error('建立商品失敗:', error);
    res.status(500).json({
      success: false,
      message: '建立商品失敗',
      error: error instanceof Error ? error.message : '未知錯誤',
    });
  }
};

// 更新商品
export const updateExistingProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateProductRequest = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: '商品ID為必填項目',
      });
      return;
    }

    // 價格驗證
    if (updateData.price !== undefined && updateData.price <= 0) {
      res.status(400).json({
        success: false,
        message: '商品價格必須大於0',
      });
      return;
    }

    // 庫存驗證
    if (updateData.stockCount !== undefined && updateData.stockCount < 0) {
      res.status(400).json({
        success: false,
        message: '庫存數量不能為負數',
      });
      return;
    }

    const updatedProduct = updateProduct(id, updateData);

    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: '商品不存在',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '商品更新成功',
      data: { product: updatedProduct },
    });
  } catch (error) {
    console.error('更新商品失敗:', error);
    res.status(500).json({
      success: false,
      message: '更新商品失敗',
      error: error instanceof Error ? error.message : '未知錯誤',
    });
  }
};

// 刪除商品
export const removeProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: '商品ID為必填項目',
      });
      return;
    }

    const deleted = deleteProduct(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: '商品不存在',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '商品刪除成功',
    });
  } catch (error) {
    console.error('刪除商品失敗:', error);
    res.status(500).json({
      success: false,
      message: '刪除商品失敗',
      error: error instanceof Error ? error.message : '未知錯誤',
    });
  }
};

// 獲取商品統計資料
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = getProductStats();

    res.status(200).json({
      success: true,
      message: '統計資料獲取成功',
      data: stats,
    });
  } catch (error) {
    console.error('獲取統計資料失敗:', error);
    res.status(500).json({
      success: false,
      message: '獲取統計資料失敗',
      error: error instanceof Error ? error.message : '未知錯誤',
    });
  }
};
