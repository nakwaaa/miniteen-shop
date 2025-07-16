import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth';
import { findUserById, updateUser, toUserResponse } from '../utils/database';

const router = express.Router();

// 擴展 Request 類型以包含 user 屬性
interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    email: string;
  };
}

// 配置 multer 存儲
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 使用 process.cwd() 獲取項目根目錄
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'avatars');

    // 確保目錄存在
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // 生成唯一檔名：user-{userId}-{timestamp}.{extension}
    const userId = (req as AuthenticatedRequest).user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `user-${userId}-${timestamp}${ext}`;
    cb(null, filename);
  },
});

// 文件過濾器
const fileFilter = (
  req: AuthenticatedRequest,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // 檢查檔案類型
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('只允許上傳 JPG、PNG、GIF 或 WebP 格式的圖片'));
  }
};

// 配置 multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: fileFilter,
});

// 刪除舊頭像文件的輔助函數
const deleteOldAvatar = (avatarPath: string) => {
  try {
    if (avatarPath && !avatarPath.startsWith('data:')) {
      // 只刪除文件路徑，不刪除 BASE64 數據
      const fullPath = path.join(process.cwd(), 'public', avatarPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log('舊頭像已刪除:', fullPath);
      }
    }
  } catch (error) {
    console.error('刪除舊頭像失敗:', error);
  }
};

/**
 * 上傳頭像
 * POST /api/upload/avatar
 */
router.post(
  '/avatar',
  authenticateToken,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '用戶身份驗證失敗',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '請選擇要上傳的圖片文件',
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

      // 刪除舊頭像（如果存在）
      if (user.avatar) {
        deleteOldAvatar(user.avatar);
      }

      // 生成新的頭像路徑
      const avatarPath = `/uploads/avatars/${req.file.filename}`;

      // 更新用戶頭像
      const updatedUser = await updateUser(req.user.id, {
        avatar: avatarPath,
      });

      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: '頭像更新失敗',
        });
      }

      res.json({
        success: true,
        message: '頭像更新成功',
        data: toUserResponse(updatedUser),
      });
    } catch (error) {
      console.error('頭像上傳錯誤:', error);

      // 如果是 multer 錯誤，提供更詳細的錯誤訊息
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: '圖片檔案過大，請上傳小於 2MB 的圖片',
          });
        }
      }

      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '伺服器錯誤',
      });
    }
  }
);

export default router;
