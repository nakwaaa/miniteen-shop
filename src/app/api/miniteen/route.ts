import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 讀取 miniteen.json 檔案
    const filePath = path.join(
      process.cwd(),
      'backend',
      'data',
      'miniteen.json'
    );
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const characters = JSON.parse(fileContents);

    return NextResponse.json(characters);
  } catch (error) {
    console.error('讀取 MINITEEN 資料失敗:', error);
    return NextResponse.json(
      { error: '無法載入 MINITEEN 角色資料' },
      { status: 500 }
    );
  }
}
