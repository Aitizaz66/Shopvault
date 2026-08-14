// frontend-customer/src/components/products/ProductCard.jsx
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice.js";
import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error("Sorry, this product is out of stock!");
      return;
    }

    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: 1,
      }),
    );

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x400?text=No+Image";
            }}
          />
          {product.stock === 0 ? (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Only {product.stock} left
            </span>
          ) : (
            <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              In Stock
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-blue-600">
              ${product.price?.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {product.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
