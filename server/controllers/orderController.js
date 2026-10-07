import { createHash } from "node:crypto";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import { normalizeItems, normalizeAddress, quoteItems, transitionOrder } from "../services/orderService.js";
import { httpError } from "../utils/httpError.js";
import { toCents } from "../../shared/pricing.js";

export const quoteOrder = async (req, res) => {
  const quote = await quoteItems(normalizeItems(req.body.orderItems));
  res.json({ success: true, data: quote });
};
export const createOrder = async (req, res) => {
  const items = normalizeItems(req.body.orderItems);
  const shippingAddress = normalizeAddress(req.body.shippingAddress);
  const paymentMethod = req.body.paymentMethod || "Cash on Delivery";
  if (paymentMethod !== "Cash on Delivery") throw httpError(400, "Only Cash on Delivery is available");
  const key = req.get("Idempotency-Key") || req.body.idempotencyKey;
  if (typeof key !== "string" || !/^[a-zA-Z0-9_-]{16,128}$/.test(key)) throw httpError(400, "A valid checkout retry key is required");
  const expectedTotal = req.body.expectedTotal;
  if (typeof expectedTotal !== "number" || !Number.isFinite(expectedTotal) || expectedTotal < 0) throw httpError(400, "Please review the latest order total before placing your order");
  const requestHash = createHash("sha256").update(JSON.stringify({ items, shippingAddress, paymentMethod, expectedTotal: toCents(expectedTotal) })).digest("hex");
  const query = { user: req.user._id, idempotencyKey: key };
  const ensureSameRequest = (order) => {
    if (order.requestHash !== requestHash) throw httpError(409, "This checkout key was already used for a different order");
    return order;
  };
  const existing = await Order.findOne(query).select("+requestHash");
  if (existing) return res.status(200).json({ success: true, data: ensureSameRequest(existing) });
  let result;
  let replayed = false;
  try {
    await mongoose.connection.transaction(async (session) => {
      const previous = await Order.findOne(query).select("+requestHash").session(session);
      if (previous) { result = ensureSameRequest(previous); replayed = true; return; }
      const quote = await quoteItems(items, session, true);
      if (toCents(quote.totalPrice) !== toCents(expectedTotal)) throw httpError(409, "Prices have changed. Review the refreshed total and place your order again.", "PRICE_CHANGED");
      result = await new Order({ ...quote, user: req.user._id, customer: { name: req.user.name, email: req.user.email }, shippingAddress, paymentMethod, idempotencyKey: key, requestHash }).save({ session });
    });
  } catch (error) {
    if (error.code !== 11000) throw error;
    const previous = await Order.findOne(query).select("+requestHash");
    if (!previous) throw error;
    result = ensureSameRequest(previous);
    replayed = true;
  }
  res.status(replayed ? 200 : 201).json({ success: true, data: result });
};
export const getOrderById = async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) throw httpError(400, "Invalid order ID");
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) throw httpError(404, "Order not found");
  if (!req.user.isAdmin && String(order.user?._id) !== String(req.user._id)) throw httpError(403, "Not authorized to view this order");
  res.json({ success: true, data: order });
};
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
};
export const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
};
export const updateOrderToPaid = async (req, res) => {
  res.status(410).json({ success: false, message: "Online payment confirmation is unavailable. Cash on Delivery is confirmed by the store upon delivery." });
};
export const updateOrderStatus = async (req, res) => res.json({ success: true, data: await transitionOrder(req.params.id, req.body.status) });
export const updateOrderToDelivered = async (req, res) => res.json({ success: true, data: await transitionOrder(req.params.id, "Delivered") });
