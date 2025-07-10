import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../models/User';

const JWT_SECRET: string =
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const BCRYPT_ROUNDS = 12;

/**
 * 加密密碼
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch {
    throw new Error('密碼加密失敗');
  }
};

/**
 * 驗證密碼
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    throw new Error('密碼驗證失敗');
  }
};

/**
 * 生成 JWT token
 */
export const generateToken = (
  payload: Omit<JwtPayload, 'iat' | 'exp'>
): string => {
  try {
    return jwt.sign(
      payload as Record<string, unknown>,
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
  } catch {
    throw new Error('Token 生成失敗');
  }
};

/**
 * 驗證 JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token 已過期');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('無效的 Token');
    } else {
      throw new Error('Token 驗證失敗');
    }
  }
};

/**
 * 從 Authorization 標頭提取 token
 */
export const extractTokenFromHeader = (
  authHeader: string | undefined
): string => {
  if (!authHeader) {
    throw new Error('缺少 Authorization 標頭');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new Error('Authorization 標頭格式錯誤');
  }

  return parts[1];
};
