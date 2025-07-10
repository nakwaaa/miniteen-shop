import { Router } from 'express';
import { register, login, getProfile, verifyTokenEndpoint } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    用戶註冊
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    用戶登入
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile
 * @desc    獲取用戶個人資料
 * @access  Private (需要 JWT token)
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   GET /api/auth/verify
 * @desc    驗證 JWT token 有效性
 * @access  Private (需要 JWT token)
 */
router.get('/verify', authenticateToken, verifyTokenEndpoint);

export default router; 