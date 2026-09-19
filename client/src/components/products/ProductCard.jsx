// frontend-customer/src/components/products/ProductCard.jsx
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice.js";
import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart");
      navigate("/login?redirect=/cart");
      return;
    }

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
            <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="absolute top-1.5 right-1.5 bg-yellow-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </span>
          ) : (
            <span className="absolute top-1.5 right-1.5 bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
              In Stock
            </span>
          )}
        </div>

        <div className="p-2.5">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 truncate">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-800 text-xs leading-snug mb-2 line-clamp-2 min-h-[2rem]">
            {product.name}
          </h3>

          {/* ✅ Price on top, button below - ALWAYS stacked */}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-blue-600">
              ${product.price?.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full px-2 py-1.5 rounded-lg font-semibold text-[11px] transition-colors ${
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
