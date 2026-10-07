# Audit corrections

This checklist maps the original audit to the changes on `fix/shopvault-audit`. The deployment requirements in the root README are part of the rollout; the branch does not change production hosting settings or customer records.

| Finding | Correction |
| --- | --- |
| 1. Checkout returns an envelope instead of an order | The order thunk unwraps `data.data`; checkout navigates using the saved `_id`. |
| 2. Inline images exceed JSON limits | Admin file uploads use multipart transport; checkout sends product IDs and quantities only. Existing inline images are omitted from edit requests when unchanged. |
| 3. Login loses the checkout destination | Guards preserve the full internal path; login/register normalize and validate redirect paths. |
| 4. Admin details use a customer session | `/api/orders/admin/:id` uses `adminProtect`; the admin thunk calls that route. |
| 5. Shipping totals disagree | Shared pricing uses USD, $5 shipping/free above $50 and 10% tax; checkout reviews a server quote. |
| 6. Stock checks race or ignore duplicate lines | Lines are consolidated and stock is conditionally decremented within a transaction. |
| 7. Partial writes and duplicate orders | Order creation and stock updates are atomic; a unique user/checkout-key index returns the existing order on retries. |
| 8. Repeated cancellations inflate stock | Transitions run transactionally, repeating the same status has no side effect, and terminal states cannot be reversed. |
| 9. A customer can claim payment succeeded | The unverifiable `/pay` operation returns 410. COD delivery is the available payment confirmation path. |
| 10. Product edit form loads blank/stale data | The form mounts only after the matching product arrives, with a key per product/new form. Zero values are valid. |
| 11. Cart icons do nothing | Both navbar cart controls open `/cart`. |
| 12. Cart quantities exceed stock | Cart reducers and add-to-cart entry points enforce the stock cap; server validation remains authoritative. |
| 13. Reviews never load | Review fetch/submission lifecycles, response shape, loading/error state and displayed ratings are wired up. |
| 14. Admin review deletion has wrong arguments | The call passes `{ productId, reviewId }`. |
| 15. Saved addresses disappear | Profile updates persist address fields, and profile/auth responses include them. |
| 16. Product filters ignore URL navigation | Search, category, sort and pagination are derived from the current URL. Old requests cannot overwrite newer results. |
| 17. Search/category URLs split at ampersands | Values are encoded and filters use URLSearchParams. |
| 18. Revenue charts and top products are wrong | The dashboard includes daily sales and historical line revenue; unpaid/cancelled orders are excluded from sales. |
| 19. Failures show spinners, empty states or stale data | Affected list/detail pages show retryable errors. Selected records clear on new requests; session resets ignore outstanding old responses. |
| 20. Empty seeder deletes the catalog | Development-only importer validates non-empty input and inserts missing slugs without deleting or overwriting existing products. |
| 21. CORS trusts arbitrary hosting domains | Exact configured origins replace substring/domain matching, and write requests require a CSRF token. |

Additional corrections include consistent delivery behavior, raw password validation, removal of published demo credentials, a guard against deleting users with orders, product field validation, safe stock edits after concurrent orders, defensive storage reads, runtime cookie configuration, local API proxies, and environment examples. About/FAQ/Contact are routed. Inactive password-reset/social-login/newsletter controls were removed; contact opens an email draft and checkout no longer claims to have sent email.

## Verification status

- 7 database-independent server/shared checks passed locally.
- 8 storefront regression checks passed locally, including checkout navigation and URL changes.
- 5 admin regression checks passed locally, including delayed product loading and zero-value edits.
- Both applications passed ESLint and production builds.
- 13 database integration tests are committed for concurrency, rollback, retries, permissions, transitions, profile/review persistence, reporting, stock edits, and uploads. They require the temporary MongoDB test binary. The binary was unavailable locally, and no GitHub workflow run had started at publication, so these tests are **not yet verified**.
- Cloudinary is mocked in transport tests; real credentials/uploads and production deployment still require a staging check.

Deploy API, client and admin together only after reviewing configuration and running the database integration suite. Historical payment/inventory inconsistencies are not automatically rewritten.
