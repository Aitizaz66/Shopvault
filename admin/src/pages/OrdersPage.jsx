import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrders,
  updateOrderStatus,
} from "../store/slices/adminOrderSlice.js";
import OrderTable from "../components/orders/OrderTable.jsx";
import { toast } from "react-hot-toast";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.adminOrders);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error(error || "Failed to update order status");
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders?.filter((order) => order.status === filter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500 mt-1">Manage customer orders</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("Pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "Pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("Processing")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "Processing"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setFilter("Shipped")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "Shipped"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setFilter("Delivered")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "Delivered"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilter("Cancelled")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "Cancelled"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Cancelled
          </button>
        </div>

        <OrderTable
          orders={filteredOrders}
          isLoading={isLoading}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
