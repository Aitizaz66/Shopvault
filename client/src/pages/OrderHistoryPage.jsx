import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMyOrders } from "../store/slices/orderSlice.js";
import LoadingSpinner from "../components/shared/LoadingSpinner.jsx";
import EmptyState from "../components/shared/EmptyState.jsx";

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container-custom py-16">
        <EmptyState
          title="No Orders Yet"
          message="You haven't placed any orders yet. Start shopping to see your orders here."
          buttonText="Start Shopping"
          buttonLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">
                  Order #{order._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  ${order.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-4">
                {order.orderItems?.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                {order.orderItems?.length > 3 && (
                  <div className="flex items-center text-sm text-gray-500">
                    +{order.orderItems.length - 3} more items
                  </div>
                )}
              </div>
            </div>

            {/* Order Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {order.isPaid ? (
                  <span className="text-green-600">Paid</span>
                ) : (
                  <span className="text-yellow-600">Pending Payment</span>
                )}
              </div>
              <Link
                to={`/order/${order._id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
