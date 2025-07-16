import express from 'express';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/auth';
import { findUserById, updateUser, toUserResponse } from '../utils/database';
import { UpdateProfileRequest, ChangePasswordRequest } from '../models/User';

const router = express.Router();

/**
 * 獲取個人資料
 * GET /api/profile
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '用戶身份驗證失敗',
      });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用戶不存在',
      });
    }

    res.json({
      success: true,
      message: '獲取個人資料成功',
      data: toUserResponse(user),
    });
  } catch (error) {
    console.error('獲取個人資料錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
    });
  }
});

/**
 * 更新個人資料
 * PUT /api/profile
 */
router.put('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '用戶身份驗證失敗',
      });
    }

    const updateData: UpdateProfileRequest = req.body;

    // 驗證必填欄位 - name（暱稱）如果提供了就不能是空白
    if (updateData.name !== undefined && updateData.name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: '暱稱不能為空白',
      });
    }

    // 真實姓名是選填的，可以為空白，所以不需要驗證

    // 驗證電話格式 (可選) - 如果不是空字串才驗證格式
    if (updateData.phone && updateData.phone.trim().length > 0) {
      // 電話號碼驗證：必須是10位純數字
      const phoneRegex = /^\d{10}$/;

      if (!phoneRegex.test(updateData.phone.trim())) {
        return res.status(400).json({
          success: false,
          message: '電話格式不正確（必須是10位數字）',
        });
      }
    }

    // 驗證生日格式 (可選) - 如果不是空字串才驗證格式
    if (updateData.birthday && updateData.birthday.trim().length > 0) {
      const date = new Date(updateData.birthday.trim());
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: '生日格式不正確（請使用 YYYY-MM-DD 格式）',
        });
      }
    }

    // 只過濾 undefined 和 null，允許空字串（用於清空選填欄位）
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(
        ([, value]) => value !== undefined && value !== null
      )
    );

    const updatedUser = await updateUser(req.user.id, filteredUpdateData);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: '用戶不存在',
      });
    }
    res.json({
      success: true,
      message: '個人資料更新成功',
      data: toUserResponse(updatedUser),
    });
  } catch (error) {
    console.error('更新個人資料錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
    });
  }
});

/**
 * 變更密碼
 * PUT /api/profile/password
 */
router.put('/password', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '用戶身份驗證失敗',
      });
    }

    const { currentPassword, newPassword }: ChangePasswordRequest = req.body;

    // 驗證請求數據
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '請提供目前密碼和新密碼',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密碼長度至少需要 6 個字符',
      });
    }

    // 獲取用戶資料
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用戶不存在',
      });
    }

    // 驗證目前密碼
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '目前密碼不正確',
      });
    }

    // 加密新密碼
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 更新密碼和密碼更新時間
    const updatedUser = await updateUser(req.user.id, {
      password: hashedNewPassword,
      passwordUpdatedAt: new Date().toISOString(),
    });

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: '密碼更新失敗',
      });
    }

    res.json({
      success: true,
      message: '密碼更新成功',
    });
  } catch (error) {
    console.error('變更密碼錯誤:', error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
    });
  }
});

export default router;
