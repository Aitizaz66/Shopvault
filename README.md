# ShopVault

React storefront (`client`), React administration app (`admin`), and Express/Mongoose API (`server`). Shared pricing, order transitions, and browser request helpers are in `shared`.

## Run locally

Use Node.js 24 and MongoDB Atlas or a MongoDB replica set. A standalone MongoDB server cannot perform the transactions used to reserve inventory and save orders atomically.

1. Run `npm ci --prefix server`, `npm ci --prefix client`, and `npm ci --prefix admin` from the repository root.
2. Copy each app's `.env.example` to `.env`. Supply your database URI and a strong JWT secret in `server/.env`. Keep credentials out of Git.
3. Run `npm run dev --prefix server`, `npm run dev --prefix client`, and `npm run dev --prefix admin` in separate terminals.
4. Open `http://localhost:5173` and `http://localhost:5174/admin`. Vite proxies `/api` to port 5000. Use the same hostname consistently, rather than mixing `localhost` and `127.0.0.1`.

The importer is development-only: `cd server` then `node seeder.js ./products.json`. It requires a non-empty array, validates every entry before connecting, and inserts missing slugs without deleting or overwriting existing products. Admin accounts must be provisioned in your own database; demo credentials are not published in the UI.

## Deploy this fix

Deploy all three apps from the same commit. The checkout API now requires a server-reviewed total and a retry key, and write requests require a CSRF token. An old storefront will not work with the new API.

- API: install using `npm ci` in `server`; start with `npm start`. Set `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and `ADMIN_URL`. The frontend URLs must be exact origins such as `https://shop.example.com` and `https://admin.example.com`. Add explicitly trusted preview origins through comma-separated `ALLOWED_ORIGINS`. No domain wildcards are accepted. Set `TRUST_PROXY_HOPS` to match the hosting proxy topology (default 1).
- MongoDB: use a replica set or sharded cluster. Startup verifies transaction support and creates the unique user/checkout-key index before accepting orders. Existing orders without a key remain valid. Do not run the seeder against production.
- Frontends: `npm ci && npm run build`, output directory `dist`, root directory `client` or `admin`. Include files outside the root directory in the build, because both apps import `shared`. On Vercel enable **Include source files outside of the Root Directory in the Build Step** for both projects.
- API routing: set `VITE_API_URL` to the API origin, or leave it blank when hosting `/api` on the frontend origin through a reverse proxy. If you use a proxy, route `/api/:path*` to the API **before** the existing SPA fallback in `vercel.json`. Preserve cookies and `Set-Cookie`. The API helper accepts a trailing `/api` but does not require it. Vite environment variables are baked into a build, so rebuild after changing them.
- Cookie compatibility: unrelated Vercel and Render default domains use cross-site cookies, which some browsers block. Prefer HTTPS custom subdomains of the same parent domain, or a same-origin API proxy. `SameSite=None; Secure` and CORS alone cannot override browser cookie blocking.
- Images: configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` (or `CLOUDINARY_URL`) to enable multipart uploads. Without that service, admins can use existing HTTP(S) image URLs. Uploads accept one JPG, PNG, or WebP file up to 5 MiB. Existing inline images are kept when editing other fields; replace them using upload or a hosted URL when convenient.
- Replace/verify the existing `support@shopvault.com` mailbox before exposing Contact Us. The form opens a draft in the visitor's email app and does not claim delivery. Online payments, password reset email, social sign-in, and newsletter subscriptions are not configured or advertised as working features.
- Rotate any production account password that matched previously published demo credentials. Existing order/payment inconsistencies require reconciliation against actual deliveries or payments; this change does not guess or rewrite historical records.

## Order behavior

Prices are USD. Shipping is $5, free when the item subtotal is **above** $50. Tax remains 10% of the item subtotal. Monetary totals use integer cents, and checkout displays an authoritative quote before submission. The server ignores client-provided product names, images, and prices.

Cash on Delivery is the available payment method. Orders move `Pending → Processing → Shipped → Delivered`. Delivery records payment for COD orders. Unpaid Pending/Processing orders can instead be cancelled; cancellation returns inventory once. Delivered and Cancelled are terminal. The old customer `/pay` endpoint cannot mark orders paid. Admins cannot set stock from an outdated product form after another order changed inventory.

A stable checkout key is retained for the same request in the browser session. A retry returns the same order instead of creating another, including when a previous response was lost. Stock reservation and order creation run in one MongoDB transaction. Historical customer and product snapshots keep order details readable if referenced records disappear.

## Verification

Run from the repository root:

```sh
npm test --prefix server
npm test --prefix client
npm test --prefix admin
npm run lint --prefix client
npm run lint --prefix admin
npm run build --prefix client
npm run build --prefix admin
```

The server integration suite creates and destroys an isolated, temporary MongoDB replica set using `mongodb-memory-server` and MongoDB 7.0.24. It never uses `MONGODB_URI` or a production database. The first run downloads the MongoDB test binary. If downloads are unavailable, `npm run test:unit --prefix server` runs the database-independent checks. The GitHub workflow runs both suites, the frontend regression tests, lint, and production builds.

Tests cover the order response contract, checkout redirects/payloads, retries, overselling, rollback after stock and save failures, repeated cancellation, COD payment transitions, admin-only details, profile addresses, reviews, revenue reporting, image transport, product editing, search navigation, and stale session data.

After deployment, verify `/api/health`, sign in separately to customer and admin sessions, create a test COD order, open its confirmation/history/admin detail, and progress it through delivery. Use a staging database for cancellation and concurrent checkout checks. No real customer order is necessary to run the automated suite.
