import ProductCard from "./ProductCard.jsx";
import ProductSkeleton from "./ProductSkeleton.jsx";
import EmptyState from "../shared/EmptyState.jsx";

const ProductGrid = ({ products, isLoading, columns = 4 }) => {
  // Determine grid columns based on prop
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  };

  const colClass = gridCols[columns] || gridCols[4];

  // Show loading skeletons
  if (isLoading) {
    return (
      <div className={`grid ${colClass} gap-4 md:gap-6`}>
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state if no products
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No Products Found"
        message="We couldn't find any products matching your criteria."
        buttonText="Clear Filters"
        buttonLink="/products"
      />
    );
  }

  // Show product grid
  return (
    <div className={`grid ${colClass} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
