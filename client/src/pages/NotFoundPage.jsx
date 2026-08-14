import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="container-custom py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="text-7xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Home
          </Link>
          <Link
            to="/products"
            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Browse Products
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <Link to="/products" className="text-blue-600 hover:underline">
            Products
          </Link>
          <Link to="/cart" className="text-blue-600 hover:underline">
            Cart
          </Link>
          <Link to="/contact" className="text-blue-600 hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
