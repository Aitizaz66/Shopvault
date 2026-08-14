const StockBadge = ({ stock }) => {
  if (stock === undefined || stock === null) {
    return null;
  }

  if (stock === 0) {
    return (
      <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
        Only {stock} left
      </span>
    );
  }

  return (
    <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
      In Stock
    </span>
  );
};

export default StockBadge;
