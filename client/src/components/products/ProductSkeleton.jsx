const ProductSkeleton = () => {
  return (
    <div className="card animate-pulse">
      {/* Image Placeholder */}
      <div className="bg-gray-200 aspect-square rounded-t-xl"></div>

      {/* Content Placeholder */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>

        {/* Product Name */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
