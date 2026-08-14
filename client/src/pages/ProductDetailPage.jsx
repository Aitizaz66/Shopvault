import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getProductById,
  getProductReviews,
  addReview,
} from "../store/slices/productSlice.js";
import { addToCart } from "../store/slices/cartSlice.js";
import { toast } from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, isLoading, reviews } =
    useSelector((state) => state.products) || {};

  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
      dispatch(getProductReviews(id));
    }
  }, [dispatch, id]);
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

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
        quantity: quantity,
      }),
    );

    toast.success(`${product.name} added to cart!`);
    navigate("/cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      navigate("/login");
      return;
    }

    try {
      await dispatch(
        addReview({
          productId: id,
          reviewData: { rating, comment },
        }),
      ).unwrap();

      toast.success("Review added successfully!");
      setComment("");
      setRating(5);
      setIsReviewing(false);
      // Refresh reviews
      dispatch(getProductReviews(id));
    } catch (error) {
      toast.error(error || "Failed to add review");
    }
  };
  // Generate star rating display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    if (hasHalfStar) {
      stars.push("½");
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push("☆");
    }
    return stars.join("");
  };
  if (isLoading) {
    return (
      <div className="container-custom py-16">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-xl h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Product Not Found
        </h2>
        <Link to="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const productReviews = reviews?.data || [];
  const averageRating = reviews?.rating || 0;
  const totalReviews = reviews?.numReviews || 0;
  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {/* Thumbnails - if multiple images */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 cursor-pointer"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-yellow-400 text-xl">
              {renderStars(averageRating || 0)}
            </span>
            <span className="text-sm text-gray-500">
              ({totalReviews || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-blue-600 mb-4">
            ${product.price.toFixed(2)}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Category */}
          <div className="mb-4">
            <span className="text-sm text-gray-500">Category: </span>
            <Link
              to={`/products?category=${product.category}`}
              className="text-blue-600 hover:underline"
            >
              {product.category}
            </Link>
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {product.stock === 0 ? (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-yellow-600 font-semibold">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="text-green-600 font-semibold">In Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <label className="font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
              product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {product.stock === 0
              ? "Out of Stock"
              : `Add to Cart - $${product.price.toFixed(2)}`}
          </button>

          {/* Trust Badges */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-gray-50 rounded-lg p-2">
              <span className="block text-2xl">🚚</span>
              Free Shipping
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <span className="block text-2xl">🔒</span>
              Secure Checkout
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <span className="block text-2xl">↩️</span>
              30-Day Returns
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Customer Reviews
        </h2>

        {/* Write Review Button */}
        {isAuthenticated && !isReviewing && (
          <button
            onClick={() => setIsReviewing(true)}
            className="mb-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        )}

        {/* Review Form */}
        {isReviewing && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-gray-50 rounded-xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>

            {/* Rating Stars */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with this product..."
                required
              ></textarea>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setIsReviewing(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {productReviews.length > 0 ? (
          <div className="space-y-4">
            {productReviews.map((review, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {review.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.name}
                      </p>
                      <span className="text-yellow-400 text-sm">
                        {renderStars(review.rating)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
