import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';
import { findUserById } from '../utils/database';
import { JwtPayload } from '../models/User';

// 擴展 Request 介面以包含用戶資訊
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

/**
 * JWT 驗證中間件
 * 驗證請求中的 JWT token 並將用戶資訊添加到 request 對象中
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 從 Authorization 標頭提取 token
    const token = extractTokenFromHeader(req.headers.authorization);
    
    // 驗證 token
    const decoded: JwtPayload = verifyToken(token);
    
    // 檢查用戶是否存在
    const user = await findUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: '用戶不存在' 
      });
      return;
    }

    // 檢查用戶是否為啟用狀態
    if (!user.isActive) {
      res.status(401).json({ 
        success: false, 
        message: '用戶帳號已被停用' 
      });
      return;
    }

    // 將用戶資訊添加到 request 對象
    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('JWT 驗證失敗:', error);
    
    let message = '身份驗證失敗';
    if (error instanceof Error) {
      message = error.message;
    }

    res.status(401).json({ 
      success: false, 
      message 
    });
  }
};

/**
 * 可選的 JWT 驗證中間件
 * 如果提供了 token 則驗證，但不強制要求 token
 */
export const optionalAuthenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    // 如果沒有提供 Authorization 標頭，則跳過驗證
    if (!authHeader) {
      next();
      return;
    }

    // 有 token 的話就驗證
    const token = extractTokenFromHeader(authHeader);
    const decoded: JwtPayload = verifyToken(token);
    
    const user = await findUserById(decoded.userId);
    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email
      };
    }

    next();
  } catch (error) {
    // 可選驗證失敗時不阻止請求，但記錄錯誤
    console.warn('可選 JWT 驗證失敗:', error);
    next();
  }
}; 