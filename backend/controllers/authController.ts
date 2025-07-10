import { Request, Response } from 'express';
import { RegisterRequest, LoginRequest } from '../models/User';
import { createUser, findUserByEmail, findUserById, toUserResponse } from '../utils/database';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';

/**
 * 用戶註冊
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // 驗證必填欄位
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        message: '電子郵件、密碼和姓名都是必填欄位'
      });
      return;
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: '請輸入有效的電子郵件地址'
      });
      return;
    }

    // 驗證密碼強度 (至少8個字符)
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: '密碼長度至少需要8個字符'
      });
      return;
    }

    // 驗證姓名長度
    if (name.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: '姓名長度至少需要2個字符'
      });
      return;
    }

    // 檢查電子郵件是否已被註冊
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: '該電子郵件已被註冊'
      });
      return;
    }

    // 加密密碼
    const hashedPassword = await hashPassword(password);

    // 建立新用戶
    const newUser = await createUser({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim()
    });

    // 生成 JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email
    });

    // 回傳成功回應
    res.status(201).json({
      success: true,
      message: '用戶註冊成功',
      data: {
        user: toUserResponse(newUser),
        token
      }
    });
  } catch (error) {
    console.error('用戶註冊錯誤:', error);
    
    let message = '註冊失敗，請稍後再試';
    if (error instanceof Error) {
      message = error.message;
    }

    res.status(500).json({
      success: false,
      message
    });
  }
};

/**
 * 用戶登入
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // 驗證必填欄位
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: '電子郵件和密碼都是必填欄位'
      });
      return;
    }

    // 查找用戶
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: '電子郵件或密碼錯誤'
      });
      return;
    }

    // 檢查用戶是否為啟用狀態
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: '您的帳號已被停用，請聯繫客服'
      });
      return;
    }

    // 驗證密碼
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: '電子郵件或密碼錯誤'
      });
      return;
    }

    // 生成 JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    // 回傳成功回應
    res.status(200).json({
      success: true,
      message: '登入成功',
      data: {
        user: toUserResponse(user),
        token
      }
    });
  } catch (error) {
    console.error('用戶登入錯誤:', error);
    
    let message = '登入失敗，請稍後再試';
    if (error instanceof Error) {
      message = error.message;
    }

    res.status(500).json({
      success: false,
      message
    });
  }
};

/**
 * 獲取用戶個人資料
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // 由於通過了身份驗證中間件，req.user 一定存在
    const userId = req.user!.id;

    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: '用戶不存在'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: '獲取用戶資料成功',
      data: {
        user: toUserResponse(user)
      }
    });
  } catch (error) {
    console.error('獲取用戶資料錯誤:', error);
    
    res.status(500).json({
      success: false,
      message: '獲取用戶資料失敗'
    });
  }
};

/**
 * 驗證 token 有效性
 */
export const verifyTokenEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    // 如果能到達這裡，說明 token 已經通過驗證
    res.status(200).json({
      success: true,
      message: 'Token 有效',
      data: {
        user: {
          id: req.user!.id,
          email: req.user!.email
        }
      }
    });
  } catch (error) {
    console.error('Token 驗證錯誤:', error);
    
    res.status(500).json({
      success: false,
      message: 'Token 驗證失敗'
    });
  }
}; 