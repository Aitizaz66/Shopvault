import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/helpers.js";

const CartSummary = ({
  items,
  subtotal,
  shipping,
  tax,
  total,
  onCheckout,
  isAuthenticated,
}) => {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">{formatPrice(tax)}</span>
        </div>

        <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {items.length === 0 ? "Cart is Empty" : "Proceed to Checkout →"}
      </button>

      {/* Login Message */}
      {!isAuthenticated && items.length > 0 && (
        <p className="text-xs text-gray-500 text-center mt-3">
          🔒 Login required to complete your order
        </p>
      )}

      {/* Continue Shopping */}
      <Link
        to="/products"
        className="block text-center text-sm text-blue-600 hover:underline mt-4"
      >
        ← Continue Shopping
      </Link>
    </div>
  );
};

export default CartSummary;
