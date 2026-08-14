import { useState } from "react";

const ProductFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onSortChange,
  onPriceRangeChange,
  onRatingChange,
  onClearFilters,
  sortBy,
  priceRange,
  rating,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const ratingOptions = [
    { value: 4, label: "4★ & above" },
    { value: 3, label: "3★ & above" },
    { value: 2, label: "2★ & above" },
    { value: 1, label: "1★ & above" },
  ];

  const priceRanges = [
    { value: "0-25", label: "Under $25" },
    { value: "25-50", label: "$25 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-200", label: "$100 - $200" },
    { value: "200-500", label: "$200 - $500" },
  ];

  const hasActiveFilters =
    selectedCategory || sortBy !== "newest" || priceRange || rating;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center lg:hidden"
      >
        <span className="font-semibold text-gray-800">Filters & Sort</span>
        <span className="text-blue-600">{isOpen ? "▲" : "▼"}</span>
      </button>

      <div className={`${isOpen ? "block" : "hidden"} lg:block mt-4 lg:mt-0`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory || ""}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Categories</option>
              {categories &&
                categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy || "newest"}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              value={priceRange || ""}
              onChange={(e) => onPriceRangeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Prices</option>
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={rating || ""}
              onChange={(e) => onRatingChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Ratings</option>
              {ratingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={onClearFilters}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium whitespace-nowrap"
              >
                Clear Filters ✕
              </button>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
            {selectedCategory && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                {selectedCategory}
                <button
                  onClick={() => onCategoryChange("")}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            )}
            {priceRange && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                ${priceRange.replace("-", " - $")}
                <button
                  onClick={() => onPriceRangeChange("")}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            )}
            {rating && (
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                {rating}★ & above
                <button
                  onClick={() => onRatingChange("")}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
