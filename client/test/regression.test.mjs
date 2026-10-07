import test, { before } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import React from "react";
import { act, create } from "react-test-renderer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { transformWithOxc } from "vite";
import { registerJSX } from "../../shared/test/jsx.js";
import { safeRedirect } from "../../shared/navigation.js";
import { readStored } from "../../shared/storage.js";
import { createApi } from "../../shared/http.js";
import axios from "axios";
import { checkoutItems, checkoutAttempt, clearCheckoutAttempt } from "../src/utils/checkout.js";
const memory = new Map();
const storage = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) };
Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
Object.defineProperty(globalThis, "sessionStorage", { value: storage, configurable: true });
await registerJSX(fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, ""), transformWithOxc);
const { default: api } = await import("../src/utils/axios.js");
const { default: cartReducer, addToCart, updateQuantity } = await import("../src/store/slices/cartSlice.js");
const { default: orderReducer, createOrder, getOrderById } = await import("../src/store/slices/orderSlice.js");
const { default: productsReducer, getProductReviews } = await import("../src/store/slices/productSlice.js");
const { default: authReducer, checkAuth, updateUserProfile, sessionExpired } = await import("../src/store/slices/authSlice.js");
const { store } = await import("../src/store/store.js");
const { default: ProductListPage } = await import("../src/pages/ProductListPage.jsx");
const { default: CheckoutPage } = await import("../src/pages/CheckoutPage.jsx");
const { default: ShippingForm } = await import("../src/components/checkout/ShippingForm.jsx");
const h = React.createElement;
let calls = [], responder;
before(() => {
  api.defaults.adapter = async config => {
    calls.push(config);
    const data = config.url === "/api/auth/csrf" ? { success: true, csrfToken: "test-token" } : await responder(config);
    return { data, status: 200, statusText: "OK", headers: {}, config };
  };
});
test("checkout thunk unwraps the actual order and cart payload excludes large images", async () => {
  const body = { orderItems: checkoutItems([{ product: "p", quantity: 2, price: 3, image: "x".repeat(150000) }]), idempotencyKey: "key" };
  assert.deepEqual(body.orderItems, [{ product: "p", quantity: 2 }]);
  const s = configureStore({ reducer: { orders: orderReducer } });
  responder = () => ({ success: true, data: { _id: "saved-order" } });
  const order = await s.dispatch(createOrder(body)).unwrap();
  assert.equal(order._id, "saved-order"); assert.equal(s.getState().orders.currentOrder._id, "saved-order");
});
test("retries reuse the same key after remount and different orders use a new key", () => {
  const payload = { orderItems: [{ product: "p", quantity: 1 }], expectedTotal: 10 };
  const a = checkoutAttempt("user", payload);
  assert.equal(checkoutAttempt("user", structuredClone(payload)), a);
  assert.notEqual(checkoutAttempt("user", { ...payload, expectedTotal: 20 }), a);
  clearCheckoutAttempt("user"); assert.equal(storage.getItem("shopvault:checkout:user"), null);
});
test("cart reducers cap every quantity entry at stock", () => {
  const item = { product: "p", name: "P", price: 1, stock: 2, quantity: 1 };
  let state = cartReducer(undefined, addToCart(item));
  state = cartReducer(state, addToCart({ ...item, quantity: 100 }));
  assert.equal(state.cartItems[0].quantity, 2);
  state = cartReducer(state, updateQuantity({ productId: "p", quantity: 5 })); assert.equal(state.cartItems[0].quantity, 2);
  state = cartReducer(state, updateQuantity({ productId: "p", quantity: 1.2 })); assert.equal(state.cartItems[0].quantity, 2);
});
test("late detail responses and responses after session expiry cannot show private data", () => {
  let state = orderReducer(undefined, getOrderById.pending("a", "one"));
  state = orderReducer(state, getOrderById.pending("b", "two"));
  state = orderReducer(state, getOrderById.fulfilled({ _id: "one" }, "a", "one")); assert.equal(state.currentOrder, null);
  store.dispatch(getOrderById.pending("private", "private-order")); store.dispatch(sessionExpired());
  store.dispatch(getOrderById.fulfilled({ _id: "private-order" }, "private", "private-order"));
  assert.equal(store.getState().orders.currentOrder, null); assert.deepEqual(store.getState().cart.shippingAddress, {});
});
test("reviews and profile updates have complete lifecycles without restarting the auth guard", async () => {
  responder = () => ({ success: true, data: [{ _id: "review" }], rating: 5, numReviews: 1 });
  const s = configureStore({ reducer: productsReducer }); await s.dispatch(getProductReviews("p"));
  assert.equal(s.getState().reviews.data[0]._id, "review"); assert.equal(s.getState().reviews.rating, 5);
  let auth = authReducer(undefined, checkAuth.pending("check"));
  auth = authReducer(auth, checkAuth.fulfilled({ _id: "u", address: { city: "Islamabad" } }, "check"));
  auth = authReducer(auth, updateUserProfile.pending("update"));
  assert.equal(auth.isChecking, false); assert.equal(auth.isAuthenticated, true); assert.equal(auth.isLoading, true);
});
test("internal redirects, malformed storage and API URL configuration are handled", async () => {
  assert.equal(safeRedirect("checkout"), "/checkout"); assert.equal(safeRedirect("/checkout"), "/checkout");
  assert.equal(safeRedirect("//evil.test"), "/"); assert.equal(safeRedirect("\\evil.test"), "/");
  storage.setItem("broken", "{bad"); assert.deepEqual(readStored("broken", []), []);
  const configured = createApi(axios, "https://api.example.test/api/"); assert.equal(configured.defaults.baseURL, "https://api.example.test");
  configured.defaults.adapter = async config => ({ data: "<html>wrong host</html>", status: 200, config, headers: {} });
  await assert.rejects(configured.get("/api/products"), /Unable to reach/);
});
test("product search follows URL changes including encoded ampersands", async () => {
  responder = config => config.url.endsWith("categories") ? { success: true, data: [] } : { success: true, data: [], pagination: { page: 1, pages: 0, total: 0 } };
  calls = [];
  const s = configureStore({ reducer: { products: productsReducer, cart: cartReducer } });
  let navigate, view;
  function Probe() { navigate = useNavigate(); return null; }
  await act(async () => { view = create(h(Provider, { store: s }, h(MemoryRouter, { initialEntries: ["/products?keyword=old"] }, h(Probe), h(ProductListPage)))); });
  await act(async () => navigate("/products?keyword=new%20%26%20good&category=Home%20%26%20Living&sort=price-low"));
  const request = calls.filter(c => c.url === "/api/products").at(-1);
  assert.equal(request.params.keyword, "new & good"); assert.equal(request.params.category, "Home & Living");
  assert.equal(view.root.findByProps({ name: "keyword" }).props.defaultValue, "new & good");
  await act(async () => view.unmount());
});
test("checkout quotes first, submits only IDs and quantities, then navigates to the saved order", async () => {
  const p = { product: "0123456789abcdef01234567", name: "Fixture", price: 20, quantity: 1, stock: 2, image: "large-image" };
  const s = configureStore({ reducer: { cart: cartReducer, orders: orderReducer, auth: () => ({ userInfo: { _id: "u" }, isAuthenticated: true }) }, preloadedState: { cart: { cartItems: [p], shippingAddress: {} } } });
  let location, view;
  function Probe() { location = useLocation(); return null; }
  const shipping = { address: "1 Test", city: "Islamabad", postalCode: "44000", country: "Pakistan", phone: "3001234567", phoneCode: "+92" };
  calls = [];
  responder = config => config.url.endsWith("quote") ? { success: true, data: { orderItems: [p], itemsPrice: 20, taxPrice: 2, shippingPrice: 5, totalPrice: 27 } } : { success: true, data: { _id: "saved-order" } };
  await act(async () => { view = create(h(Provider, { store: s }, h(MemoryRouter, { initialEntries: ["/checkout"] }, h(Probe), h(Routes, null, h(Route, { path: "/checkout", element: h(CheckoutPage) }), h(Route, { path: "/order-success", element: h("p", null, "Saved") }))))); });
  await act(async () => view.root.findByType(ShippingForm).props.onSubmit(shipping));
  const button = view.root.findAllByType("button").find(b => String(b.props.children).startsWith("Place Order"));
  await act(async () => { await button.props.onClick(); });
  const placed = JSON.parse(calls.find(c => c.url === "/api/orders").data);
  assert.deepEqual(placed.orderItems, [{ product: p.product, quantity: 1 }]); assert.equal(placed.expectedTotal, 27); assert.ok(placed.idempotencyKey);
  assert.equal(location.pathname + location.search, "/order-success?orderId=saved-order"); assert.equal(s.getState().cart.cartItems.length, 0);
  await act(async () => view.unmount());
});
