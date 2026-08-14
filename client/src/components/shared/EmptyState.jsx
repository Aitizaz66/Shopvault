import { Link } from "react-router-dom";

const EmptyState = ({
  title = "Nothing Here",
  message = "There is nothing to display at the moment.",
  buttonText,
  buttonLink,
  icon = "📦",
}) => {
  return (
    <div className="text-center py-12 max-w-md mx-auto">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{message}</p>
      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
