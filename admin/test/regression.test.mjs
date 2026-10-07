import test, { before } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import React from "react";
import { act, create } from "react-test-renderer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { transformWithOxc } from "vite";
import { registerJSX } from "../../shared/test/jsx.js";
await registerJSX(fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, ""), transformWithOxc);
const { default: api } = await import("../src/utils/axios.js");
const { default: productsReducer } = await import("../src/store/slices/adminProductSlice.js");
const { default: ordersReducer, getOrderById } = await import("../src/store/slices/adminOrderSlice.js");
const { default: statsReducer, deleteReview } = await import("../src/store/slices/adminStatsSlice.js");
const { default: ProductEditPage } = await import("../src/pages/ProductEditPage.jsx");
const { default: OrderDetailPage } = await import("../src/pages/OrderDetailPage.jsx");
const { default: ProductForm } = await import("../src/components/products/ProductForm.jsx");
const { default: OrderTable } = await import("../src/components/orders/OrderTable.jsx");
const h = React.createElement;
let responder, calls = [];
before(() => {
  api.defaults.adapter = async config => {
    calls.push(config);
    const data = config.url === "/api/auth/csrf" ? { success: true, csrfToken: "test" } : await responder(config);
    return { data, status: 200, statusText: "OK", headers: {}, config };
  };
});
test("admin detail uses the admin cookie route and reviews use both URL identifiers", async () => {
  const s = configureStore({ reducer: { adminOrders: ordersReducer, adminStats: statsReducer } });
  calls = []; responder = () => ({ success: true, data: { _id: "order" } });
  await s.dispatch(getOrderById("order")).unwrap();
  assert.equal(calls[0].url, "/api/orders/admin/order"); assert.equal(calls[0].withCredentials, true);
  await s.dispatch(deleteReview({ productId: "product", reviewId: "review" })).unwrap();
  assert.ok(calls.some(c => c.url === "/api/reviews/product/review"));
});
test("edit form waits for asynchronous product data and remounts when switching to a new product", async () => {
  const s = configureStore({ reducer: { adminProducts: productsReducer } });
  let resolveProduct, view, navigate;
  responder = () => new Promise(resolve => { resolveProduct = resolve; });
  function Probe() { navigate = useNavigate(); return null; }
  await act(async () => { view = create(h(Provider, { store: s }, h(MemoryRouter, { initialEntries: ["/admin/products/p/edit"] }, h(Probe), h(Routes, null, h(Route, { path: "/admin/products/:id/edit", element: h(ProductEditPage) }), h(Route, { path: "/admin/products/new", element: h(ProductEditPage) }))))); });
  assert.equal(view.root.findAllByType(ProductForm).length, 0);
  await act(async () => resolveProduct({ success: true, data: { _id: "p", name: "Loaded product", description: "Fixture", category: "Test", price: 0, stock: 0, image: "https://example.test/p.png" } }));
  assert.equal(view.root.findByProps({ name: "name" }).props.value, "Loaded product"); assert.equal(view.root.findByProps({ name: "price" }).props.value, 0);
  await act(async () => navigate("/admin/products/new"));
  assert.equal(view.root.findByProps({ name: "name" }).props.value, "");
  await act(async () => view.unmount());
});
test("valid zero values submit and unchanged legacy images are not posted as JSON", async () => {
  let view, submitted;
  const product = { _id: "p", name: "Zero", description: "Fixture", category: "Test", price: 0, stock: 0, image: "data:image/png;base64," + "x".repeat(150000) };
  await act(async () => { view = create(h(MemoryRouter, null, h(ProductForm, { product, onSubmit: data => { submitted = data; }, isLoading: false }))); });
  await act(async () => view.root.findByType("form").props.onSubmit({ preventDefault() {} }));
  assert.equal(submitted.price, 0); assert.equal(submitted.image, undefined); assert.equal(submitted.stock, undefined);
  await act(async () => view.unmount());
});
test("deleted customers do not crash historical admin order details", async () => {
  const order = { _id: "order", user: null, customer: { name: "Saved customer" }, status: "Pending", orderItems: [], shippingAddress: {}, totalPrice: 0, itemsPrice: 0, taxPrice: 0, shippingPrice: 0 };
  responder = () => ({ success: true, data: order });
  const s = configureStore({ reducer: { adminOrders: ordersReducer } }); let view;
  await act(async () => { view = create(h(Provider, { store: s }, h(MemoryRouter, { initialEntries: ["/admin/orders/order"] }, h(Routes, null, h(Route, { path: "/admin/orders/:id", element: h(OrderDetailPage) }))))); });
  assert.match(JSON.stringify(view.toJSON()), /Order #/);
  await act(async () => view.unmount());
});
test("cancelled orders have no reversal option in the admin table", async () => {
  let view;
  await act(async () => { view = create(h(MemoryRouter, null, h(OrderTable, { orders: [{ _id: "o", status: "Cancelled", user: null, totalPrice: 1 }], isLoading: false, onStatusUpdate() {} }))); });
  assert.deepEqual(view.root.findAllByType("option").map(option => option.props.value), ["Cancelled"]);
  await act(async () => view.unmount());
});
