import { httpError } from "../utils/httpError.js";
export function productFields(body, partial = false) {
  const result = {};
  for (const [field, max] of [["name", 100], ["description", 2000], ["category", 100]]) {
    if (partial && body[field] === undefined) continue;
    if (typeof body[field] !== "string" || !body[field].trim() || body[field].length > max) throw httpError(400, `Please provide ${field} (1 to ${max} characters)`);
    result[field] = body[field].trim();
  }
  for (const field of ["price", "stock"]) {
    if (partial && body[field] === undefined) continue;
    const value = body[field];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || (field === "stock" && !Number.isSafeInteger(value))) throw httpError(400, `Invalid product ${field}`);
    if (field === "price" && (!Number.isSafeInteger(Math.round(value * 100)) || Math.abs(value * 100 - Math.round(value * 100)) > 0.00001)) throw httpError(400, "Price must use at most two decimal places");
    result[field] = value;
  }
  const imageUrl = value => {
    try { const url = new URL(value); if (typeof value !== "string" || value.length > 2048 || !["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error(); return value; }
    catch { throw httpError(400, "Use an uploaded image or a valid HTTP(S) image URL"); }
  };
  if (!partial || body.image !== undefined) result.image = imageUrl(body.image);
  if (body.images !== undefined) {
    if (!Array.isArray(body.images) || body.images.length > 10) throw httpError(400, "Provide at most 10 additional image URLs");
    result.images = body.images.map(imageUrl);
  }
  if (result.name !== undefined) {
    result.slug = result.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!result.slug) throw httpError(400, "Product name must include a letter or number");
  }
  return result;
}
