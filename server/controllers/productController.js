import Product from "../models/Product.js";
import { httpError } from "../utils/httpError.js";
import { productFields } from "../services/productValidation.js";
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const getProducts = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const filter = {};
  if (typeof req.query.keyword === "string" && req.query.keyword.trim()) filter.name = { $regex: escapeRegex(req.query.keyword.trim().slice(0, 100)), $options: "i" };
  if (typeof req.query.category === "string" && req.query.category) filter.category = req.query.category;
  const sorts = { "price-low": { price: 1, _id: 1 }, "price-high": { price: -1, _id: 1 }, rating: { rating: -1, _id: 1 }, newest: { createdAt: -1, _id: -1 } };
  const [total, products] = await Promise.all([Product.countDocuments(filter), Product.find(filter).sort(sorts[req.query.sort] || sorts.newest).limit(limit).skip((page - 1) * limit)]);
  res.json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  res.json({ success: true, data: product });
};
export const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw httpError(404, "Product not found");
  res.json({ success: true, data: product });
};
export const getProductByCategory = async (req, res) => res.json({ success: true, data: await Product.find({ category: req.params.category }).sort({ createdAt: -1 }) });
export const getCategories = async (req, res) => res.json({ success: true, data: await Product.distinct("category") });
export const createProduct = async (req, res) => res.status(201).json({ success: true, data: await Product.create(productFields(req.body)) });
export const updateProduct = async (req, res) => {
  const fields = productFields(req.body, true);
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  if (fields.stock !== undefined && req.body.stockBaseline !== product.stock) throw httpError(409, "Stock changed since you opened this product. Reload before adjusting stock.");
  Object.assign(product, fields);
  await product.save();
  res.json({ success: true, data: product });
};
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw httpError(404, "Product not found");
  res.json({ success: true, message: "Product deleted successfully" });
};
