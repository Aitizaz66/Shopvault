import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { spawnSync } from "node:child_process";
import { calculateTotals, cartTotals } from "../../shared/pricing.js";
import { nextOrderStatuses } from "../../shared/orderStatus.js";
import { normalizeItems, normalizeAddress } from "../services/orderService.js";
import { productFields } from "../services/productValidation.js";
import { cookieOptions } from "../utils/generateToken.js";
import { allowedOrigins } from "../config/origins.js";
import { createApp } from "../app.js";

let server, base;
before(async () => {
  process.env.NODE_ENV = "test";
  server = createApp().listen(0, "127.0.0.1");
  await once(server, "listening");
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));

test("checkout totals are rounded once in cents and match advertised shipping", () => {
  assert.equal(calculateTotals(40).totalPrice, 49);
  assert.equal(calculateTotals(50).shippingPrice, 5);
  assert.equal(calculateTotals(50.01).shippingPrice, 0);
  assert.equal(calculateTotals(10.05).taxPrice, 1.01);
  assert.equal(cartTotals([]).totalPrice, 0);
  assert.equal(cartTotals([{ price: 0.1, quantity: 3 }]).itemsPrice, 0.3);
});
test("duplicate product lines are merged before reserving stock", () => {
  const id = "0123456789abcdef01234567";
  assert.deepEqual(normalizeItems([{ product: id, quantity: 2 }, { product: id.toUpperCase(), quantity: 3 }]), [{ product: id, quantity: 5 }]);
  for (const quantity of [0, -1, 1.5, "1", 1000]) assert.throws(() => normalizeItems([{ product: id, quantity }]), { statusCode: 400 });
  assert.throws(() => normalizeItems([]), { statusCode: 400 });
});
test("address and product validation reject malformed values but allow zero price and stock", () => {
  assert.equal(normalizeAddress({ address: " A ", city: "B", postalCode: "C", country: "D", phone: "(300) 123-4567" }).phone, "3001234567");
  assert.throws(() => normalizeAddress({}), { statusCode: 400 });
  const product = { name: "Test", description: "Fixture", category: "Home & Living", price: 0, stock: 0, image: "https://example.test/p.png" };
  assert.equal(productFields(product).price, 0);
  for (const changes of [{ stock: 1.2 }, { price: -1 }, { description: " " }, { image: "data:image/png;base64,abc" }]) assert.throws(() => productFields({ ...product, ...changes }), { statusCode: 400 });
});
test("paid, cancelled, and delivered orders cannot be reversed or restocked", () => {
  assert.deepEqual(nextOrderStatuses({ status: "Cancelled" }), []);
  assert.deepEqual(nextOrderStatuses({ status: "Delivered" }), []);
  assert.deepEqual(nextOrderStatuses({ status: "Shipped" }), ["Delivered"]);
  assert.ok(!nextOrderStatuses({ status: "Processing", isPaid: true }).includes("Cancelled"));
});
test("CORS only permits exact origins, CSRF is required even on logout", async () => {
  for (const origin of ["https://evil.vercel.app", "https://localhost.attacker.test", "https://evil.onrender.com"]) {
    const res = await fetch(`${base}/api/health`, { headers: { Origin: origin } });
    assert.equal(res.status, 403);
    assert.equal(res.headers.get("access-control-allow-origin"), null);
  }
  const issued = await fetch(`${base}/api/auth/csrf`, { headers: { Origin: "http://localhost:5173" } });
  const { csrfToken } = await issued.json();
  const cookie = issued.headers.getSetCookie()[0].split(";")[0];
  assert.equal(issued.headers.get("access-control-allow-origin"), "http://localhost:5173");
  assert.equal((await fetch(`${base}/api/auth/logout`, { method: "POST", headers: { Cookie: cookie } })).status, 403);
  const res = await fetch(`${base}/api/auth/logout`, { method: "POST", headers: { Cookie: cookie, "X-CSRF-Token": csrfToken } });
  assert.equal(res.status, 200);
  assert.match(res.headers.getSetCookie().join(";"), /jwt=/);
});
test("production cookie settings read the loaded environment and production has no wildcard defaults", () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  assert.equal(cookieOptions().secure, true);
  assert.equal(cookieOptions().sameSite, "none");
  assert.ok(!allowedOrigins().has("http://localhost:5173"));
  process.env.NODE_ENV = previous;
});
test("empty seeding refuses to connect to or erase a database", () => {
  const res = spawnSync(process.execPath, ["seeder.js"], { cwd: new URL("..", import.meta.url), encoding: "utf8", env: { ...process.env, MONGODB_URI: "mongodb://invalid:1/test" } });
  assert.equal(res.status, 1);
  assert.match(res.stderr, /non-empty product array/);
});
