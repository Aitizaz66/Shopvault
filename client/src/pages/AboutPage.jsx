import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          About ShopVault
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your trusted destination for quality products, secure shopping, and
          exceptional service.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At ShopVault, we believe that shopping should be simple, secure, and
            enjoyable. Our mission is to provide customers with access to
            high-quality products at competitive prices, backed by exceptional
            customer service.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We curate our selection carefully, ensuring that every product meets
            our standards for quality, value, and reliability. Whether you're
            looking for the latest electronics, fashion essentials, or home
            goods, we've got you covered.
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800">Quality First</h3>
            <p className="text-gray-600 mt-2">
              Every product is carefully vetted
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Security
            </h3>
            <p className="text-gray-600 text-sm">
              Your data and transactions are protected with enterprise-grade
              security.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Quality
            </h3>
            <p className="text-gray-600 text-sm">
              We stand behind every product we sell with a satisfaction
              guarantee.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Support
            </h3>
            <p className="text-gray-600 text-sm">
              Our dedicated team is here to help you every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400">10K+</div>
            <div className="text-sm text-gray-400 mt-1">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">500+</div>
            <div className="text-sm text-gray-400 mt-1">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">99%</div>
            <div className="text-sm text-gray-400 mt-1">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">24/7</div>
            <div className="text-sm text-gray-400 mt-1">Customer Support</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-blue-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ready to Shop?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of satisfied customers and discover the ShopVault
          difference.
        </p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
