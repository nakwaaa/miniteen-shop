import fs from 'fs/promises';
import path from 'path';
import { User, UserResponse } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const DB_DIR = path.join(process.cwd(), 'backend', 'data');
const USERS_FILE = path.join(DB_DIR, 'users.json');

/**
 * 確保資料庫目錄和檔案存在
 */
const ensureDbExists = async (): Promise<void> => {
  try {
    await fs.access(DB_DIR);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
  }

  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
  }
};

/**
 * 讀取所有用戶
 */
export const getAllUsers = async (): Promise<User[]> => {
  await ensureDbExists();
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data) as User[];
  } catch (error) {
    console.error('讀取用戶資料失敗:', error);
    return [];
  }
};

/**
 * 根據 email 查找用戶
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const users = await getAllUsers();
  return (
    users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
};

/**
 * 根據 ID 查找用戶
 */
export const findUserById = async (id: string): Promise<User | null> => {
  const users = await getAllUsers();
  return users.find((user) => user.id === id) || null;
};

/**
 * 建立新用戶
 */
export const createUser = async (
  userData: Omit<
    User,
    'id' | 'createdAt' | 'updatedAt' | 'passwordUpdatedAt' | 'isActive'
  >
): Promise<User> => {
  const users = await getAllUsers();

  // 檢查 email 是否已存在
  const existingUser = users.find(
    (user) => user.email.toLowerCase() === userData.email.toLowerCase()
  );
  if (existingUser) {
    throw new Error('該電子郵件已被註冊');
  }

  const currentTime = new Date().toISOString();

  const newUser: User = {
    id: uuidv4(),
    ...userData,
    createdAt: currentTime,
    updatedAt: currentTime,
    passwordUpdatedAt: currentTime, // 初始密碼設定時間
    isActive: true,
  };

  users.push(newUser);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

  return newUser;
};

/**
 * 更新用戶資料
 */
export const updateUser = async (
  id: string,
  updateData: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<User | null> => {
  const users = await getAllUsers();
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  return users[userIndex];
};

/**
 * 將 User 轉換為 UserResponse (移除密碼等敏感資訊)
 */
export const toUserResponse = (user: User): UserResponse => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userResponse } = user;
  return userResponse;
};
