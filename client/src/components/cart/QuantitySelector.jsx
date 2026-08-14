const QuantitySelector = ({
  quantity,
  onQuantityChange,
  min = 1,
  maxStock = 99,
  disabled = false,
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxStock) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= maxStock) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDecrease}
        disabled={quantity <= min || disabled}
        className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        -
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={maxStock}
        disabled={disabled}
        className="w-12 text-center px-1 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />

      <button
        onClick={handleIncrease}
        disabled={quantity >= maxStock || disabled}
        className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
