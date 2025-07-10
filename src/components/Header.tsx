import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-purple-600">
              MINITEEN SHOP
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              認識MINITEEN
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              SEVENTEEN
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              週邊商品
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="搜尋偶像周邊..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-purple-600"
              >
                🔍
              </Button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-700 hover:text-purple-600"
            >
              🛒
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Login/Register */}
            <div className="hidden md:flex space-x-2">
              <Button variant="purple-outline" size="default">
                登入
              </Button>
              <Button variant="purple" size="default">
                註冊
              </Button>
            </div>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="h-0.5 bg-gray-600"></div>
                <div className="h-0.5 bg-gray-600"></div>
                <div className="h-0.5 bg-gray-600"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
