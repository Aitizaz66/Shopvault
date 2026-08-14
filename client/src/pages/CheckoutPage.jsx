import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../store/slices/orderSlice.js";
import { clearCart } from "../store/slices/cartSlice.js";
import { toast } from "react-hot-toast";
import ShippingForm from "../components/checkout/ShippingForm.jsx";
import OrderSummary from "../components/checkout/OrderSummary.jsx";
import CheckoutSteps from "../components/checkout/CheckoutSteps.jsx";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { isLoading } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
    phone: "",
    phoneCode: "+92",
  });

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=checkout");
      return;
    }
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [isAuthenticated, cartItems, navigate]);

  // Handle shipping submit
  const handleShippingSubmit = (data) => {
    setShippingData(data);
    setStep(2);
  };

  // Handle place order (Cash on Delivery)
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        shippingAddress: shippingData,
        paymentMethod: "Cash on Delivery",
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();

      dispatch(clearCart());

      navigate(`/order-success?orderId=${result._id}`);

      toast.success("Order placed successfully! Pay on delivery.");
    } catch (error) {
      toast.error(error || "Failed to place order");
    }
  };

  // If cart is empty or not authenticated, show nothing
  if (!isAuthenticated || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <CheckoutSteps currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Forms Section */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <ShippingForm
              onSubmit={handleShippingSubmit}
              initialData={shippingData}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Method
                </h2>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">💵</span>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-gray-600">
                        Pay when your order arrives. No payment required now.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Placing Order..."
                  : `Place Order - $${total.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={cartItems}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
