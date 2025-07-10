export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="text-xl font-bold mb-4">MINITEEN SHOP</h4>
            <p className="text-gray-300 mb-4">
              SEVENTEEN官娃周邊販售平台
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                📘
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                📷
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                🐦
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4">快速連結</h5>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  關於我們
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  聯絡我們
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  常見問題
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  退換貨政策
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-semibold mb-4">購物服務</h5>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  購物指南
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  配送資訊
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  付款方式
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  會員權益
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-semibold mb-4">聯絡資訊</h5>
            <div className="space-y-2 text-gray-300">
              <p>📞 客服專線：0800-123-456</p>
              <p>📧 Email：service@miniteen.shop</p>
              <p>🕒 服務時間：週一至週五 9:00-18:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 MINITEEN SHOP. 版權所有.</p>
        </div>
      </div>
    </footer>
  );
}
