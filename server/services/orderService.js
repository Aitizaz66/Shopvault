import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { calculateTotals, toCents } from "../../shared/pricing.js";
import { nextOrderStatuses } from "../../shared/orderStatus.js";
import { httpError } from "../utils/httpError.js";

export function normalizeItems(items) {
  if (!Array.isArray(items) || !items.length || items.length > 100) throw httpError(400, "Your cart must contain between 1 and 100 product lines");
  const quantities = new Map();
  for (const item of items) {
    if (!item || !mongoose.isObjectIdOrHexString(item.product) || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 999) throw httpError(400, "Invalid product or quantity");
    const id = String(item.product).toLowerCase();
    const quantity = (quantities.get(id) || 0) + item.quantity;
    if (quantity > 999) throw httpError(400, "Maximum quantity per product is 999");
    quantities.set(id, quantity);
  }
  return [...quantities].sort(([a], [b]) => a.localeCompare(b)).map(([product, quantity]) => ({ product, quantity }));
}
export function normalizeAddress(address) {
  if (!address || typeof address !== "object") throw httpError(400, "A shipping address is required");
  const result = {};
  for (const field of ["address", "city", "postalCode", "country", "phone"]) {
    if (typeof address[field] !== "string" || !address[field].trim() || address[field].length > 250) throw httpError(400, `Please provide a valid shipping ${field}`);
    result[field] = address[field].trim();
  }
  result.phone = result.phone.replace(/[\s()-]/g, "");
  result.phoneCode = typeof address.phoneCode === "string" ? address.phoneCode.trim() : "+92";
  if (!/^\d{7,15}$/.test(result.phone) || !/^\+\d{1,4}$/.test(result.phoneCode)) throw httpError(400, "Please provide a valid phone number and country code");
  return result;
}
export async function quoteItems(items, session = null, reserve = false) {
  const orderItems = [];
  let cents = 0;
  for (const item of items) {
    const product = reserve
      ? await Product.findOneAndUpdate({ _id: item.product, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity, __v: 1 } }, { new: true, session })
      : await Product.findById(item.product).session(session);
    if (!product || (!reserve && product.stock < item.quantity)) throw httpError(409, "An item is unavailable or has insufficient stock. Please update your cart.", "STOCK_CHANGED");
    cents += toCents(product.price) * item.quantity;
    orderItems.push({ product: product._id, name: product.name, quantity: item.quantity, price: toCents(product.price) / 100, image: product.image });
  }
  return { orderItems, ...calculateTotals(cents / 100) };
}
export async function transitionOrder(id, status) {
  if (!mongoose.isObjectIdOrHexString(id)) throw httpError(400, "Invalid order ID");
  await mongoose.connection.transaction(async (session) => {
    const order = await Order.findById(id).session(session);
    if (!order) throw httpError(404, "Order not found");
    if (order.status === status) return;
    if (!nextOrderStatuses(order).includes(status)) throw httpError(409, `Cannot change ${order.status} to ${status}`);
    if (status === "Delivered" && order.paymentMethod !== "Cash on Delivery" && !order.isPaid) throw httpError(409, "Payment must be verified before delivery");
    if (status === "Cancelled") {
      for (const item of order.orderItems) await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity, __v: 1 } }, { session });
    }
    order.status = status;
    order.isDelivered = status === "Delivered";
    order.deliveredAt = order.isDelivered ? new Date() : undefined;
    if (order.isDelivered && order.paymentMethod === "Cash on Delivery") {
      order.isPaid = true;
      order.paidAt = new Date();
    }
    await order.save({ session });
  });
  return Order.findById(id).populate("user", "name email");
}
