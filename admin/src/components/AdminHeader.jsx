import { useSelector } from "react-redux";
import { Menu } from "lucide-react";

const AdminHeader = ({ onMenuClick }) => {
  const { userInfo } = useSelector((state) => state.adminAuth);

  return (
    <header className="bg-white shadow-sm px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* ✅ Hamburger - ONLY visible on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
            Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
            Welcome back, {userInfo?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1 right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-base">
            {userInfo?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm font-medium text-gray-800">
              {userInfo?.name}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
