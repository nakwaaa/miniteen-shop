'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// MINITEEN 角色類型定義
interface MiniteenCharacter {
  id: string;
  name: string;
  koreanName?: string;
  image: string;
  description: string;
  tags?: string[];
}

export default function MiniteenPage() {
  const [characters, setCharacters] = useState<MiniteenCharacter[]>([]);
  const [loading, setLoading] = useState(true);

  // 獲取 MINITEEN 角色資料
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/miniteen');
        if (response.ok) {
          const data = await response.json();
          setCharacters(data);
        }
      } catch (error) {
        console.error('獲取 MINITEEN 角色失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-16">
            認識 MINITEEN
          </h1>
          <div className="space-y-16">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-8 animate-pulse"
              >
                <div className="w-32 h-32 bg-gray-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-700 rounded mb-4 w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* 頁面標題 */}
        <h1 className="text-4xl font-bold text-center mb-4">認識 MINITEEN</h1>
        <p className="text-center text-gray-300 mb-16 text-lg">
          探索每個獨特角色的魅力與故事
        </p>

        {/* 角色介紹列表 */}
        <div className="space-y-20">
          {characters.map((character, index) => (
            <div
              key={character.id}
              className={`flex items-center ${
                index % 2 === 1 ? 'flex-row-reverse' : 'gap-8'
              }`}
            >
              {/* 角色圖片 */}
              <div className="flex-shrink-0">
                <div
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 p-1 transition-transform duration-700 ease-in-out hover:[transform:rotateY(360deg)] cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={character.image}
                      alt={character.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* 角色介紹文字 */}
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-purple-400 inline">
                    {character.name}
                  </h2>
                  {character.koreanName && (
                    <span className="text-lg text-purple-300 ml-3">
                      {character.koreanName}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  {character.description}
                </p>
                {character.tags && character.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {character.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
