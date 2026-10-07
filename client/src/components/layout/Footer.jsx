import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const { categories = [] } = useSelector((state) => state.products) || {};

  // Make sure categories is an array before using slice
  const displayCategories = Array.isArray(categories)
    ? categories.slice(0, 6)
    : [];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* ===== MAIN FOOTER ===== */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ===== COLUMN 1: Brand ===== */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-blue-500">SHOP</span>
              <span className="text-2xl font-bold text-white">VAULT</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your premium destination for quality products. Shop with
              confidence and style.
            </p>

          </div>

          {/* ===== COLUMN 2: Quick Links ===== */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-blue-500 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-blue-500 transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="hover:text-blue-500 transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-blue-500 transition-colors"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== COLUMN 3: Categories ===== */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Categories
            </h3>
            {displayCategories.length > 0 ? (
              <ul className="space-y-2">
                {displayCategories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={`/products?category=${encodeURIComponent(category)}`}
                      className="hover:text-blue-500 transition-colors"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No categories available</p>
            )}
            <li className="mt-2 list-none">
              <Link
                to="/products"
                className="text-blue-500 hover:text-blue-400 transition-colors text-sm font-medium"
              >
                View All →
              </Link>
            </li>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Need help?</h3>
            <p className="text-sm text-gray-400 mb-4">Find answers about checkout and your orders.</p>
            <Link to="/faq" className="text-blue-400 hover:underline">Read our FAQ</Link>
            <br /><Link to="/contact" className="text-blue-400 hover:underline">Contact support</Link>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} ShopVault. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link to="/faq" className="hover:text-blue-500 transition-colors">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
