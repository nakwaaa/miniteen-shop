'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

export default function SeventeenPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube');
        const data = await response.json();

        if (response.ok) {
          setVideos(data.videos);
        } else {
          setError(data.error || 'Failed to fetch videos');
        }
      } catch {
        setError('Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 封面區域 */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="/SEVENTEEN.png"
          alt="SEVENTEEN"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl font-bold mb-4 tracking-wider">
              SEVENTEEN
            </h1>
            <p className="text-xl font-medium tracking-widest">세븐틴</p>
            <div className="mt-6 text-lg">
              <p className="font-semibold">
                &quot;Say the name, SEVENTEEN&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 內容區域 */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto text-gray-800">
            {/* 團體介紹 */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-purple-600 mb-6">
                關於 SEVENTEEN
              </h2>
              <p className="text-lg leading-relaxed mb-6">
                SEVENTEEN（韓語：세븐틴）為韓國Pledis娛樂於2015年推出的十三人男子團體，團體有「Hiphop
                Team」、「Vocal Team」、「Performance Team」三個小分隊。
              </p>
              <p className="text-lg leading-relaxed mb-6">
                團體名字「SEVENTEEN」寓意為「13名成員+3個分隊+1個整體」，問候語（打招呼口號）為「Say
                the name,
                SEVENTEEN」，同時左手比1，右手比7，並將兩手向前伸再彎曲交疊。
              </p>
            </div>

            {/* 粉絲名稱與應援色 */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-purple-600 mb-6">
                粉絲名稱與應援色
              </h3>
              <p className="text-lg leading-relaxed mb-6">
                2016年2月14日，公開官方粉絲名稱「CARAT克拉（캐럿）」取自於鑽石的質量單位，比喻SEVENTEEN是像鑽石一樣閃耀的存在，隨著CARAT的數量增加SEVENTEEN的價值也越高。
              </p>
              <p className="text-lg leading-relaxed mb-6">
                2016年10月4日，公開官方應援色為「玫瑰石英粉」（彩通13-1520）與「寧靜藍」（彩通15-3919）。玫瑰石英粉是暖和且柔軟的，而寧靜藍則是沉靜、平穩的，用來描述SEVENTEEN的溫暖及清澈。
              </p>

              {/* 應援色展示 */}
              <div className="flex justify-center mt-12 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-3xl">
                  <Image
                    src="/seventeen-official-colors.jpg"
                    alt="SEVENTEEN 官方應援色"
                    width={800}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 成員介紹 */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-purple-600 mb-6">
                成員編號
              </h3>
              <p className="text-lg leading-relaxed mb-6">
                SEVENTEEN成員按照年紀排序，有各自的編號，按照順序為S.COUPS、JEONGHAN、JOSHUA、JUN、HOSHI、WONWOO、WOOZI、THE
                8、MINGYU、DK、SEUNGKWAN、VERNON、DINO。
              </p>
              <p className="text-lg leading-relaxed mb-6">
                其中，1997年生的三位成員裡THE
                8的藝名中含有8，並且其喜歡數字8，所以將原本的年齡順序DK、MINGYU、THE
                8換成了應援順序THE
                8、MINGYU、DK，此編號方便參加需要直播的音樂放送等節目時，能夠快速點名，確認成員是否到位，除此之外歌曲應援詞包含成員名字的部分，也都使用這個順序。
              </p>

              {/* 成員列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {[
                  'S.COUPS',
                  'JEONGHAN',
                  'JOSHUA',
                  'JUN',
                  'HOSHI',
                  'WONWOO',
                  'WOOZI',
                  'THE 8',
                  'MINGYU',
                  'DK',
                  'SEUNGKWAN',
                  'VERNON',
                  'DINO',
                ].map((member, index) => (
                  <div
                    key={member}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {member}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 小分隊介紹 */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-purple-600 mb-6">
                三個小分隊
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-purple-600 mb-3">
                    Hiphop Team
                  </h4>
                  <p className="text-gray-700">
                    負責團體的說唱部分，展現強烈的節奏感和魅力
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-purple-600 mb-3">
                    Vocal Team
                  </h4>
                  <p className="text-gray-700">
                    負責團體的主唱部分，展現美妙的歌聲和和聲
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-purple-600 mb-3">
                    Performance Team
                  </h4>
                  <p className="text-gray-700">
                    負責團體的表演部分，展現精湛的舞蹈實力
                  </p>
                </div>
              </div>
            </div>

            {/* Spotify 音樂播放器 */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-purple-600 mb-6">
                收聽 SEVENTEEN 音樂
              </h3>
              <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/artist/7nqOGRxlXj7N2JYbgNEjYH?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>

            {/* YouTube 最新影片 */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-purple-600 mb-6">
                最新影片
              </h3>

              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="mt-2 text-gray-600">載入中...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">載入影片時發生錯誤: {error}</p>
                </div>
              )}

              {!loading && !error && videos.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">本週暫無新影片</p>
                </div>
              )}

              {!loading && !error && videos.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="aspect-video relative group">
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                            {/* 懸停時的播放按鈕覆蓋 */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                <svg
                                  className="w-8 h-8 text-white ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                              {video.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {new Date(video.publishedAt).toLocaleDateString(
                                'zh-TW'
                              )}
                            </p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* 官方頻道連結 */}
                  <div className="text-center mt-8">
                    <a
                      href="https://www.youtube.com/@pledis17"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.186a2.995 2.995 0 0 0-2.11-2.11C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.388.539a2.995 2.995 0 0 0-2.11 2.11C0 8.07 0 12 0 12s0 3.93.502 5.814a2.995 2.995 0 0 0 2.11 2.11C4.495 20.454 12 20.454 12 20.454s7.505 0 9.388-.539a2.995 2.995 0 0 0 2.11-2.11C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.546 15.569V8.431L15.818 12l-6.272 3.569z" />
                      </svg>
                      查看更多 SEVENTEEN 官方 YT 影片
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
