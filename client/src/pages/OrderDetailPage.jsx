import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById, clearOrder } from "../store/slices/orderSlice.js";
import LoadingSpinner from "../components/shared/LoadingSpinner.jsx";

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, isLoading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(getOrderById(id));
    return () => dispatch(clearOrder());
  }, [dispatch, id]);

  if (isLoading || !order) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container-custom py-8 max-w-3xl">
      <Link to="/orders" className="text-blue-600 hover:underline text-sm">
        ← Back to Orders
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-6">
        Order #{order._id.slice(-6).toUpperCase()}
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <p className="text-sm text-gray-500 mb-1">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm">
          Status:{" "}
          <span className="font-semibold">{order.status || "Pending"}</span>
        </p>
        <p className="text-sm">
          Payment: {order.isPaid ? "Paid" : "Pending Payment"}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Items</h2>
        <div className="space-y-4">
          {order.orderItems?.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <p className="text-sm font-semibold">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="font-semibold text-gray-800 mb-2">Shipping</h2>
        <p className="text-sm text-gray-600">
          {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
          {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
        </p>
        <p className="text-right font-bold text-lg mt-4">
          Total: ${order.totalPrice?.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderDetailPage;
