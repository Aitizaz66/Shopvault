import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { getOrderById } from "../store/slices/orderSlice.js";

const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { currentOrder, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (!orderId) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="text-6xl mb-4">X</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Order Not Found
        </h1>
        <p className="text-gray-500 mb-6">No order information available.</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse text-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="text-6xl mb-4">X</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Order Not Found
        </h1>
        <p className="text-gray-500 mb-6">We could not find your order.</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-800">Order Confirmed</h1>
          <p className="text-gray-500 mt-2">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          {/* ✅ ADD THIS - Cash on Delivery message */}
          <p className="text-sm text-green-600 font-semibold mt-2">
            💵 Cash on Delivery - Pay when your order arrives
          </p>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                Order #{currentOrder._id?.slice(-6).toUpperCase()}
              </span>
              <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-full">
                {currentOrder.status || "Pending"}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Order Date */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order Date</span>
              <span className="text-gray-800 font-medium">
                {new Date(currentOrder.createdAt).toLocaleDateString()} at{" "}
                {new Date(currentOrder.createdAt).toLocaleTimeString()}
              </span>
            </div>

            {/* ✅ CHANGED: Payment Status to Payment Method */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment Method</span>
              <span className="text-green-600 font-medium">
                Cash on Delivery
              </span>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Shipping Address
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p>{currentOrder.shippingAddress?.address}</p>
                <p>
                  {currentOrder.shippingAddress?.city},{" "}
                  {currentOrder.shippingAddress?.postalCode}
                </p>
                <p>{currentOrder.shippingAddress?.country}</p>
                <p className="mt-2 text-blue-600">
                  📞 {currentOrder.shippingAddress?.phoneCode}{" "}
                  {currentOrder.shippingAddress?.phone}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Order Items
              </h3>
              <div className="space-y-2">
                {currentOrder.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-800">
                  ${currentOrder.itemsPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-800">
                  ${currentOrder.shippingPrice?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-800">
                  ${currentOrder.taxPrice?.toFixed(2)}
                </span>
              </div>
              {/* ✅ CHANGED: Total label */}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span className="text-gray-800">Total (Pay on Delivery)</span>
                <span className="text-green-600">
                  ${currentOrder.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-500">
              <p>A confirmation email has been sent to your email address.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="block text-2xl">🔒</span>
            Secure Payment
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="block text-2xl">🚚</span>
            Free Shipping
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="block text-2xl">💬</span>
            24/7 Support
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
