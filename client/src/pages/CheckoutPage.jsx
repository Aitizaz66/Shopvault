import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createOrder } from "../store/slices/orderSlice.js";
import { clearCart, saveShippingAddress } from "../store/slices/cartSlice.js";
import { toast } from "react-hot-toast";
import api from "../utils/axios.js";
import { checkoutItems, checkoutAttempt, clearCheckoutAttempt } from "../utils/checkout.js";
import { cartTotals } from "../../../shared/pricing.js";
import { errorMessage } from "../../../shared/http.js";
import ShippingForm from "../components/checkout/ShippingForm.jsx";
import OrderSummary from "../components/checkout/OrderSummary.jsx";
import CheckoutSteps from "../components/checkout/CheckoutSteps.jsx";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);
  const { cartItems, shippingAddress } = useSelector(state => state.cart);
  const { isLoading } = useSelector(state => state.orders);
  const [shippingData, setShippingData] = useState(shippingAddress);
  const [quote, setQuote] = useState(null);
  const [isQuoting, setIsQuoting] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const completed = useRef(false);
  const totals = quote || cartTotals(cartItems);
  const step = quote ? 2 : 1;
  const busy = isLoading || isQuoting;
  useEffect(() => {
    if (!cartItems.length && !completed.current) navigate("/cart", { replace: true });
  }, [cartItems.length, navigate]);

  const handleShippingSubmit = async data => {
    if (submitting.current) return;
    setShippingData(data);
    dispatch(saveShippingAddress(data));
    setError("");
    setIsQuoting(true);
    try {
      const response = await api.post("/api/orders/quote", { orderItems: checkoutItems(cartItems) });
      setQuote(response.data.data);
    } catch (error) { setError(errorMessage(error)); }
    finally { setIsQuoting(false); }
  };
  const handlePlaceOrder = async () => {
    if (!quote || submitting.current) return;
    submitting.current = true;
    setError("");
    const payload = {
      orderItems: checkoutItems(cartItems), shippingAddress: shippingData,
      paymentMethod: "Cash on Delivery", expectedTotal: quote.totalPrice,
    };
    try {
      const idempotencyKey = checkoutAttempt(userInfo._id, payload);
      const order = await dispatch(createOrder({ ...payload, idempotencyKey })).unwrap();
      completed.current = true;
      clearCheckoutAttempt(userInfo._id);
      dispatch(clearCart());
      navigate(`/order-success?orderId=${order._id}`, { replace: true });
      toast.success("Order placed successfully. Pay on delivery.");
    } catch (error) { setError(typeof error === "string" ? error : errorMessage(error)); }
    finally { submitting.current = false; }
  };
  if (!cartItems.length) return null;
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      <CheckoutSteps currentStep={step} />
      {error && <div role="alert" className="my-6 rounded-lg bg-red-50 p-4 text-red-700">{error} <Link to="/cart" className="underline">Review your cart</Link></div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          {!quote ? <ShippingForm onSubmit={handleShippingSubmit} initialData={shippingData} isLoading={busy} /> : (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Cash on Delivery</h2>
                <p>Pay when your order arrives. All prices are in USD.</p>
                <h3 className="font-semibold mt-5">Deliver to</h3>
                <p>{shippingData.address}, {shippingData.city}, {shippingData.postalCode}, {shippingData.country}</p>
                <p>{shippingData.phoneCode} {shippingData.phone}</p>
                <button className="text-blue-600 underline mt-3" disabled={busy} onClick={() => setQuote(null)}>Edit address or refresh totals</button>
              </div>
              <button onClick={handlePlaceOrder} disabled={busy} className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold disabled:opacity-50">
                {isLoading ? "Placing Order..." : `Place Order - $${quote.totalPrice.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">{quote ? "Current prices checked with the store." : "Estimated total. Current prices and availability are checked before you place the order."}</p>
          <OrderSummary items={quote?.orderItems || cartItems} subtotal={totals.itemsPrice} shipping={totals.shippingPrice} tax={totals.taxPrice} total={totals.totalPrice} isLoading={busy} />
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
