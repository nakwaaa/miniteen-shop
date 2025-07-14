import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <section
        className="relative min-h-[600px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/MINITEEEN.JPG')",
        }}
      ></section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            商品分類
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '文具', icon: '💿', color: 'bg-blue-100' },
              { name: '配件', icon: '🎉', color: 'bg-pink-100' },
              { name: '服飾', icon: '⭐', color: 'bg-green-100' },
              { name: '生活用品', icon: '🎁', color: 'bg-yellow-100' },
            ].map((category, index) => (
              <div
                key={index}
                className={`${category.color} p-8 rounded-xl text-center hover:shadow-lg transition-shadow cursor-pointer`}
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {category.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            熱門商品
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: '限定專輯', price: 'NT$ 890', image: '💿' },
              {
                name: '官方寫真集',
                price: 'NT$ 1,290',
                image: '📸',
              },
              {
                name: '應援手燈',
                price: 'NT$ 1,590',
                image: '🔦',
              },
              { name: '海報套組', price: 'NT$ 390', image: '🖼️' },
              { name: '透明卡片', price: 'NT$ 290', image: '🃏' },
              {
                name: '壓克力立牌',
                price: 'NT$ 690',
                image: '🎭',
              },
              { name: '徽章套組', price: 'NT$ 490', image: '📍' },
              { name: '簽名板', price: 'NT$ 1,990', image: '✍️' },
            ].map((product, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="text-6xl text-center mb-4">{product.image}</div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-purple-600">
                    {product.price}
                  </span>
                  <Button variant="purple" size="sm">
                    加入購物車
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-400 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">限時優惠！</h3>
          <p className="text-xl mb-8">
            全館偶像周邊 8 折起，新會員再享額外 9 折
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-orange-500 font-semibold hover:bg-gray-100"
            >
              立即搶購
            </Button>
            <Button
              variant="orange-outline"
              size="lg"
              className="font-semibold"
            >
              查看更多優惠
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">訂閱電子報</h3>
          <p className="text-gray-600 mb-8">獲取最新偶像周邊資訊和獨家優惠</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="輸入您的 email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <Button
              variant="purple"
              className="rounded-l-none rounded-r-lg px-6 py-3"
            >
              訂閱
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
