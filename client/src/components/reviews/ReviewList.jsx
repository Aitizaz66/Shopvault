import RatingStars from "./RatingStars.jsx";
import { formatDate, getInitials } from "../../utils/helpers.js";

const ReviewList = ({ reviews, averageRating, totalReviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
        <div className="text-3xl font-bold text-gray-800">
          {averageRating ? averageRating.toFixed(1) : "0.0"}
        </div>
        <div>
          <RatingStars rating={averageRating || 0} />
          <p className="text-sm text-gray-500">
            Based on {totalReviews || reviews.length} reviews
          </p>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {getInitials(review.name)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{review.name}</p>
                  <RatingStars rating={review.rating} size="sm" />
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {formatDate(review.createdAt)}
              </span>
            </div>
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
