import test, { before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { v2 as cloudinary } from "cloudinary";
import { Writable } from "node:stream";
import { createApp } from "../app.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

let db, server, base, customer, admin, other;
const shippingAddress = { address: "1 Test Street", city: "Islamabad", postalCode: "44000", country: "Pakistan", phone: "3001234567", phoneCode: "+92" };
async function request(path, { method = "GET", session, body, headers = {} } = {}) {
  const response = await fetch(`${base}${path}`, { method, headers: { ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}), ...(session ? { Cookie: session.cookie, "X-CSRF-Token": session.csrf } : {}), ...headers }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
  return { status: response.status, body: await response.json(), cookies: response.headers.getSetCookie() };
}
async function signIn(email, adminOnly = false) {
  const csrfResponse = await request("/api/auth/csrf");
  const session = { csrf: csrfResponse.body.csrfToken, cookie: csrfResponse.cookies[0].split(";")[0] };
  const logged = await request(`/api/auth/${adminOnly ? "admin-login" : "login"}`, { method: "POST", session, body: { email, password: "test-password" } });
  assert.equal(logged.status, 200, JSON.stringify(logged.body));
  session.cookie += `; ${logged.cookies[0].split(";")[0]}`;
  session.user = logged.body.data;
  return session;
}
async function product(stock = 5, price = 20) {
  return Product.create({ name: "Fixture", slug: randomUUID(), description: "Test fixture", category: "Home & Living", image: "https://example.test/image.png", stock, price });
}
async function orderBody(items, session = customer) {
  const orderItems = items.map(([p, quantity]) => ({ product: String(p._id), quantity }));
  const quote = await request("/api/orders/quote", { method: "POST", session, body: { orderItems } });
  assert.equal(quote.status, 200, JSON.stringify(quote.body));
  return { orderItems, shippingAddress, paymentMethod: "Cash on Delivery", expectedTotal: quote.body.data.totalPrice, idempotencyKey: randomUUID() };
}
const place = body => request("/api/orders", { method: "POST", session: customer, body });
const status = (id, value) => request(`/api/orders/${id}/status`, { method: "PUT", session: admin, body: { status: value } });
before(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "local-test-secret-not-for-production";
  db = await MongoMemoryReplSet.create({ replSet: { count: 1 }, binary: { version: "7.0.24" } });
  await mongoose.connect(db.getUri(), { dbName: "shopvault_test" });
  await Promise.all([Order.init(), Product.init(), User.init()]);
  const password = await bcrypt.hash("test-password", 4);
  await User.create([{ name: "Customer", email: "customer@example.test", password }, { name: "Admin", email: "admin@example.test", password, isAdmin: true }, { name: "Other", email: "other@example.test", password }]);
  server = createApp().listen(0, "127.0.0.1"); await once(server, "listening"); base = `http://127.0.0.1:${server.address().port}`;
  customer = await signIn("customer@example.test"); admin = await signIn("admin@example.test", true); other = await signIn("other@example.test");
});
after(async () => { if (server) await new Promise(resolve => server.close(resolve)); await mongoose.disconnect(); if (db) await db.stop(); });
beforeEach(async () => { await Order.deleteMany({}); await Product.deleteMany({}); });

test("checkout uses server snapshots, returns a real order and preserves price agreement", async () => {
  const p = await product(4); const body = await orderBody([[p, 2]]);
  body.orderItems[0].price = 0; body.orderItems[0].image = "ignored";
  const result = await place(body);
  assert.equal(result.status, 201, JSON.stringify(result.body));
  assert.ok(mongoose.isObjectIdOrHexString(result.body.data._id));
  assert.equal(result.body.data.totalPrice, 49); assert.equal(result.body.data.orderItems[0].price, 20);
  assert.equal(result.body.data.isPaid, false); assert.equal(result.body.data.requestHash, undefined);
  assert.equal((await Product.findById(p._id)).stock, 2);
  const mismatch = { ...body, idempotencyKey: randomUUID(), expectedTotal: 1 };
  assert.equal((await place(mismatch)).status, 409);
  assert.equal((await Product.findById(p._id)).stock, 2); assert.equal(await Order.countDocuments(), 1);
});
test("concurrent attempts to buy the final item cannot oversell", async () => {
  const p = await product(1); const body = await orderBody([[p, 1]]);
  const results = await Promise.all([place(body), place({ ...body, idempotencyKey: randomUUID() })]);
  assert.deepEqual(results.map(r => r.status).sort(), [201, 409]);
  assert.equal(await Order.countDocuments(), 1); assert.equal((await Product.findById(p._id)).stock, 0);
});
test("concurrent retries create one order and consume inventory once", async () => {
  const p = await product(3); const body = await orderBody([[p, 1]]);
  const results = await Promise.all([place(body), place(body), place(body)]);
  assert.ok(results.every(r => [200, 201].includes(r.status)), JSON.stringify(results));
  assert.equal(new Set(results.map(r => r.body.data._id)).size, 1);
  assert.equal(await Order.countDocuments(), 1); assert.equal((await Product.findById(p._id)).stock, 2);
  assert.equal((await place({ ...body, shippingAddress: { ...shippingAddress, city: "Other" } })).status, 409);
});
test("duplicate lines count together and any unavailable item rolls back all reservations", async () => {
  const p = await product(3); const p2 = await product(1);
  const body = await orderBody([[p, 2], [p2, 1]]);
  await Product.updateOne({ _id: p2._id }, { $set: { stock: 0 } });
  assert.equal((await place(body)).status, 409);
  assert.equal((await Product.findById(p._id)).stock, 3); assert.equal(await Order.countDocuments(), 0);
  const duplicate = { ...body, orderItems: [{ product: String(p._id), quantity: 2 }, { product: String(p._id), quantity: 2 }] };
  assert.equal((await place(duplicate)).status, 409); assert.equal((await Product.findById(p._id)).stock, 3);
});
test("order-save failures roll inventory back", async () => {
  const p = await product(); const body = await orderBody([[p, 2]]);
  const save = Order.prototype.save;
  Order.prototype.save = async function () { throw new Error("Injected save failure"); };
  try { assert.equal((await place(body)).status, 500); } finally { Order.prototype.save = save; }
  assert.equal((await Product.findById(p._id)).stock, 5); assert.equal(await Order.countDocuments(), 0);
});
test("admin-only detail works with adminJwt and other customers cannot view the order", async () => {
  const result = await place(await orderBody([[await product(), 1]])); const id = result.body.data._id;
  assert.equal((await request(`/api/orders/admin/${id}`, { session: admin })).status, 200);
  assert.equal((await request(`/api/orders/admin/${id}`, { session: customer })).status, 401);
  assert.equal((await request(`/api/orders/${id}`, { session: other })).status, 403);
  assert.equal((await request("/api/orders/not-an-id", { session: customer })).status, 400);
  await User.deleteOne({ _id: customer.user._id });
  try {
    const detail = await request(`/api/orders/admin/${id}`, { session: admin });
    assert.equal(detail.status, 200); assert.equal(detail.body.data.customer.name, "Customer");
  } finally { await User.create({ _id: customer.user._id, name: "Customer", email: "customer@example.test", password: await bcrypt.hash("test-password", 4) }); }
});
test("cancellation restocks exactly once and terminal statuses cannot be reversed", async () => {
  const p = await product(); const created = await place(await orderBody([[p, 2]])); const id = created.body.data._id;
  const results = await Promise.all([status(id, "Cancelled"), status(id, "Cancelled")]);
  assert.ok(results.every(r => r.status === 200)); assert.equal((await Product.findById(p._id)).stock, 5);
  assert.equal((await status(id, "Processing")).status, 409); assert.equal((await status(id, "Delivered")).status, 409);
});
test("customer payment requests cannot mark paid and COD delivery confirms payment once", async () => {
  const created = await place(await orderBody([[await product(), 1]])); const id = created.body.data._id;
  assert.equal((await request(`/api/orders/${id}/pay`, { method: "PUT", session: customer, body: { status: "COMPLETED" } })).status, 410);
  assert.equal((await Order.findById(id)).isPaid, false);
  for (const next of ["Processing", "Shipped"]) assert.equal((await status(id, next)).status, 200);
  const delivered = await request(`/api/orders/${id}/deliver`, { method: "PUT", session: admin });
  assert.equal(delivered.status, 200); assert.equal(delivered.body.data.isPaid, true); assert.equal(delivered.body.data.isDelivered, true);
  assert.equal((await status(id, "Delivered")).body.data.paidAt, delivered.body.data.paidAt);
  assert.equal((await status(id, "Cancelled")).status, 409);
});
test("profile addresses survive updates and auth checks; raw short passwords are rejected", async () => {
  const address = { street: "Test Street", city: "Islamabad", zipCode: "44000", country: "Pakistan", state: "ICT" };
  const updated = await request("/api/auth/profile", { method: "PUT", session: customer, body: { address } });
  assert.equal(updated.status, 200); assert.deepEqual(updated.body.data.address, address);
  const checked = await request("/api/auth/check", { session: customer }); assert.deepEqual(checked.body.user.address, address);
  assert.equal((await request("/api/auth/register", { method: "POST", session: customer, body: { name: "Bad", email: "bad@example.test", password: "123" } })).status, 400);
});
test("dashboard shows paid sales, accurate product revenue and daily totals", async () => {
  const p = await product(); const paid = await place(await orderBody([[p, 1]]));
  for (const next of ["Processing", "Shipped", "Delivered"]) await status(paid.body.data._id, next);
  await place(await orderBody([[p, 1]])); // unpaid order is excluded from revenue
  const cancelled = await place(await orderBody([[p, 1]])); await status(cancelled.body.data._id, "Cancelled");
  await Order.updateOne({ _id: cancelled.body.data._id }, { $set: { isPaid: true, paidAt: new Date() } }); // legacy inconsistency
  const stats = await request("/api/admin/stats", { session: admin });
  assert.equal(stats.body.data.totalRevenue, 27); assert.equal(stats.body.data.topProducts[0].totalRevenue, 20);
  assert.equal(stats.body.data.topProducts[0].totalSold, 1); assert.equal(stats.body.data.dailySales[0].total, 27);
});
test("reviews load and delete correctly; users with order history cannot be deleted", async () => {
  const p = await product(); const placed = await place(await orderBody([[p, 1]]));
  for (const next of ["Processing", "Shipped", "Delivered"]) await status(placed.body.data._id, next);
  const review = await request(`/api/reviews/${p._id}`, { method: "POST", session: customer, body: { rating: 5, comment: "Works well" } });
  assert.equal(review.status, 201); const reviewId = review.body.data._id;
  const reviews = await request(`/api/reviews/${p._id}`); assert.equal(reviews.body.numReviews, 1); assert.equal(reviews.body.rating, 5);
  assert.equal((await request(`/api/reviews/${p._id}/${reviewId}`, { method: "DELETE", session: admin })).status, 200);
  assert.equal((await request(`/api/reviews/${p._id}`)).body.numReviews, 0);
  assert.equal((await request(`/api/admin/users/${customer.user._id}`, { method: "DELETE", session: admin })).status, 409);
});
test("stock edits detect changed inventory and literal searches accept punctuation", async () => {
  const p = await product(3); await place(await orderBody([[p, 1]]));
  const changed = await request(`/api/products/${p._id}`, { method: "PUT", session: admin, body: { stock: 10, stockBaseline: 3 } });
  assert.equal(changed.status, 409); assert.equal((await Product.findById(p._id)).stock, 2);
  assert.equal((await request(`/api/products/${p._id}`, { method: "PUT", session: admin, body: { price: 0 } })).status, 200);
  assert.equal((await request("/api/products?keyword=%5B")).status, 200);
  assert.equal((await request("/api/products?category=Home%20%26%20Living")).body.data.length, 1);
});
test("multipart image uploads allow a file above the JSON limit and return a URL", async () => {
  const original = cloudinary.uploader.upload_stream;
  process.env.CLOUDINARY_CLOUD_NAME = "test"; process.env.CLOUDINARY_API_KEY = "test"; process.env.CLOUDINARY_API_SECRET = "test";
  let received = 0;
  cloudinary.uploader.upload_stream = (options, callback) => new Writable({ write(chunk, encoding, done) { received += chunk.length; done(); }, final(done) { callback(null, { secure_url: "https://example.test/upload.png" }); done(); } });
  try {
    const bytes = Buffer.alloc(150000); Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
    const form = new FormData(); form.append("image", new Blob([bytes], { type: "image/png" }), "image.png");
    const uploaded = await request("/api/products/upload", { method: "POST", session: admin, body: form });
    assert.equal(uploaded.status, 201, JSON.stringify(uploaded.body)); assert.equal(received, 150000); assert.equal(uploaded.body.data.data, undefined); assert.equal(uploaded.body.data.url, "https://example.test/upload.png");
    const bad = new FormData(); bad.append("image", new Blob(["not a PNG"], { type: "image/png" }), "bad.png");
    assert.equal((await request("/api/products/upload", { method: "POST", session: admin, body: bad })).status, 400);
  } finally { cloudinary.uploader.upload_stream = original; }
});
