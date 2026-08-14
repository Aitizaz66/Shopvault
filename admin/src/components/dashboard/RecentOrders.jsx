import { Link } from "react-router-dom";
import OrderStatusBadge from "../orders/OrderStatusBadge.jsx";

const RecentOrders = ({ orders, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h2>
        <p className="text-gray-500 text-center py-8">No recent orders</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        <Link
          to="/admin/orders"
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order._id}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">
                #{order._id?.slice(-6).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-gray-800">
                ${order.totalPrice?.toFixed(2)}
              </span>
              <OrderStatusBadge status={order.status} />
              <Link
                to={`/admin/orders/${order._id}`}
                className="text-xs text-blue-600 hover:underline"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
