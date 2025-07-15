import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCfkXDY7vwkcJ8ddFGz8KusA'; // SEVENTEEN 官方頻道 ID

export async function GET() {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    // 調用 YouTube API 獲取頻道最新影片（不限制時間）
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        `key=${YOUTUBE_API_KEY}&` +
        `channelId=${CHANNEL_ID}&` +
        `part=snippet&` +
        `order=date&` +
        `type=video&` +
        `maxResults=6`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    // 格式化影片數據
    const videos =
      data.items?.map(
        (item: {
          id: { videoId: string };
          snippet: {
            title: string;
            description: string;
            thumbnails: { medium: { url: string } };
            publishedAt: string;
          };
        }) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        })
      ) || [];

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch videos',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
