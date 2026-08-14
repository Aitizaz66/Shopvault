import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeCart } from "../../store/slices/uiSlice.js";
import CartItem from "./CartItem.jsx";
import { formatPrice } from "../../utils/helpers.js";

const MiniCart = ({
  isOpen,
  items,
  subtotal,
  shipping,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isAuthenticated,
}) => {
  const dispatch = useDispatch();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleClose = () => {
    dispatch(closeCart());
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Cart ({itemCount})
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
              <Link
                to="/products"
                onClick={handleClose}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <CartItem
                  key={item.product}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-3 hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout →
            </button>

            {!isAuthenticated && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Login required to complete your order
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCart;
