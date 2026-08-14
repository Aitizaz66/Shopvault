import { Link } from "react-router-dom";
import QuantitySelector from "./QuantitySelector.jsx";
import { formatPrice } from "../../utils/helpers.js";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      onRemove(item.product);
    } else {
      onUpdateQuantity(item.product, newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-0">
      {/* Product Image */}
      <Link to={`/product/${item.product}`} className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.product}`}>
          <h3 className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
            {item.name}
          </h3>
        </Link>
        <p className="text-sm font-bold text-blue-600 mt-1">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex-shrink-0">
        <QuantitySelector
          quantity={item.quantity}
          onQuantityChange={handleQuantityChange}
          maxStock={item.stock}
        />
      </div>

      {/* Item Total & Remove */}
      <div className="text-right flex-shrink-0 min-w-[80px]">
        <p className="text-sm font-bold text-gray-800">
          {formatPrice(item.price * item.quantity)}
        </p>
        <button
          onClick={() => onRemove(item.product)}
          className="text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
