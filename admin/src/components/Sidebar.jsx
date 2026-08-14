import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/adminAuthSlice.js";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/reviews", icon: Star, label: "Reviews" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="bg-gray-900 text-white flex flex-col h-screen w-full">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your store</p>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
            onClick={onClose}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout - Fixed at bottom */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
