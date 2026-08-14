const RatingStars = ({ rating, size = "md", interactive = false }) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const starSize = sizeClasses[size] || sizeClasses.md;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStar = (type, index) => {
    const baseClass = `${starSize} transition-colors`;

    if (type === "full") {
      return (
        <span key={`full-${index}`} className={`${baseClass} text-yellow-400`}>
          ★
        </span>
      );
    }

    if (type === "half") {
      return (
        <span key="half" className={`${baseClass} text-yellow-400 relative`}>
          <span className="absolute left-0">★</span>
          <span className="absolute left-0 text-gray-300">★</span>
          <span className="relative w-1/2 overflow-hidden inline-block">★</span>
        </span>
      );
    }

    if (type === "empty") {
      return (
        <span key={`empty-${index}`} className={`${baseClass} text-gray-300`}>
          ★
        </span>
      );
    }
  };

  if (interactive) {
    // For interactive mode, just show a single star
    return <span className={starSize}>★</span>;
  }

  const stars = [];

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(renderStar("full", i));
  }

  // Add half star
  if (hasHalfStar) {
    stars.push(renderStar("half"));
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(renderStar("empty", i));
  }

  return <div className="flex items-center space-x-0.5">{stars}</div>;
};

export default RatingStars;
