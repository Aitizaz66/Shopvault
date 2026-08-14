import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviews, deleteReview } from "../store/slices/adminStatsSlice.js";
import { Star, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const ReviewsPage = () => {
  const dispatch = useDispatch();
  const { reviews, isLoading } = useSelector((state) => state.adminStats);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getReviews());
  }, [dispatch]);

  const handleDelete = async (productId, reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await dispatch(deleteReview(productId, reviewId)).unwrap();
        toast.success("Review deleted successfully");
        dispatch(getReviews());
      } catch (error) {
        toast.error(error || "Failed to delete review");
      }
    }
  };

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews?.filter((r) => r.rating >= parseInt(filter));

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reviews</h1>
        <p className="text-gray-500 mt-1">Manage customer reviews</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilter(rating.toString())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === rating.toString()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {rating}★ & up
            </button>
          ))}
        </div>

        {!filteredReviews || filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">
                        {review.name}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {review.productName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-500 ml-1">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(review.productId, review._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
