import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice.js";
import { openCart } from "../../store/slices/uiSlice.js";
import {
  ShoppingCartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${searchTerm.trim()}`);
      setSearchTerm("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsDropdownOpen(false);
    navigate("/");
  };

  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);
  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path
        ? "text-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-blue-600">Shop</span>
              <span className="text-xl font-bold text-gray-800">Vault</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6 ml-8">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link to="/products" className={navLinkClass("/products")}>
              All Products
            </Link>
            <Link to="/cart" className={navLinkClass("/cart")}>
              Cart
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className={navLinkClass("/orders")}>
                  My Orders
                </Link>
                <Link to="/profile" className={navLinkClass("/profile")}>
                  My Account
                </Link>
              </>
            )}
          </div>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-2.5 text-gray-400 hover:text-blue-600"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => dispatch(openCart())}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <UserIcon className="h-6 w-6 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700 hidden xl:inline">
                    {userInfo?.name?.split(" ")[0]}
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => dispatch(openCart())}
              className="relative p-2"
            >
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-1">
            <form onSubmit={handleSearch} className="px-2 mb-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm"
              />
            </form>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
            >
              <HomeIcon className="h-5 w-5" /> Home
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
            >
              <ShoppingBagIcon className="h-5 w-5" /> All Products
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
            >
              <ShoppingCartIcon className="h-5 w-5" /> Cart
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5" /> My Orders
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                >
                  <UserIcon className="h-5 w-5" /> My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2 border rounded-lg text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
