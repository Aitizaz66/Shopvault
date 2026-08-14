const TopProducts = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 mt-1"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Top Products
        </h2>
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-500">No product data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h2>
      <div className="space-y-3">
        {products.slice(0, 5).map((product, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
              #{index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {product.name || "Unknown Product"}
              </p>
              <p className="text-xs text-gray-500">
                {product.totalSold || 0} units sold
              </p>
            </div>
            <div className="text-sm font-semibold text-blue-600">
              ${(product.totalSold * (product.price || 0)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
