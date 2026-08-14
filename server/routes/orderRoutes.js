import express from "express";
import {
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  createOrder,
} from "../controllers/orderController.js";
import { protect, adminProtect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protect, createOrder);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/").get(adminProtect, getAllOrders);
router.route("/:id/deliver").put(adminProtect, updateOrderToDelivered);
router.route("/:id/status").put(adminProtect, updateOrderStatus);

export default router;
