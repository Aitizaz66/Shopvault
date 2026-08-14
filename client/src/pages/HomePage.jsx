import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProducts } from "../store/slices/productSlice.js";
import ProductCard from "../components/products/ProductCard.jsx";

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    categories = [],
    isLoading = false,
  } = useSelector((state) => state.products) || {};

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
  }, [dispatch]);
  const displayProducts = products.slice(0, 8);

  const getCategoryIcon = (category) => {
    const icons = {
      Electronics: "📱",
      Fashion: "👔",
      Beauty: "💄",
      "Home & Living": "🏠",
      Sports: "⚽",
      Books: "📚",
    };
    return icons[category] || "📦";
  };

  return (
    <div>
      {/* ===== HERO SECTION - MODERN ===== */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNGgtMnYyaDJ2LTJ6bTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          {/* Animated Circles */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-6 animate-fade-in">
                🚀 New Collection 2024
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
                Discover Premium
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  Products
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg animate-fade-in-up delay-200">
                Shop the latest trends with secure payments and fast delivery.
                Your style, your way.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Shop Now →
                </Link>
                <Link
                  to="/products"
                  className="border-2 border-white/50 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all hover:border-white backdrop-blur-sm"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Right Content - Featured Image */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-white text-center">
                      <div className="text-4xl mb-2">🎯</div>
                      <p className="text-sm font-medium">Quality</p>
                      <p className="text-xs text-blue-200">Guaranteed</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-white text-center">
                      <div className="text-4xl mb-2">🚚</div>
                      <p className="text-sm font-medium">Fast</p>
                      <p className="text-xs text-blue-200">Delivery</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-white text-center">
                      <div className="text-4xl mb-2">🔒</div>
                      <p className="text-sm font-medium">Secure</p>
                      <p className="text-xs text-blue-200">Payment</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-white text-center">
                      <div className="text-4xl mb-2">💬</div>
                      <p className="text-sm font-medium">24/7</p>
                      <p className="text-xs text-blue-200">Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-500">
                Find exactly what you're looking for
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/products?category=${category}`}
                  className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Shop Now →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== PRODUCTS SECTION ===== */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                New Arrivals
              </h2>
              <p className="text-gray-500">Discover our latest products</p>
            </div>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              View All
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl h-64"></div>
                  <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-gray-500 text-lg">
                No products available yet.
              </p>
              <p className="text-gray-400 text-sm">
                Check back soon for new arrivals!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                🚚
              </div>
              <h3 className="font-semibold text-gray-800">Free Shipping</h3>
              <p className="text-sm text-gray-500">On orders over $50</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                🔒
              </div>
              <h3 className="font-semibold text-gray-800">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure checkout</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-purple-100 transition-colors">
                🔄
              </div>
              <h3 className="font-semibold text-gray-800">Easy Returns</h3>
              <p className="text-sm text-gray-500">30-day return policy</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:bg-orange-100 transition-colors">
                💬
              </div>
              <h3 className="font-semibold text-gray-800">24/7 Support</h3>
              <p className="text-sm text-gray-500">
                Dedicated customer service
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
