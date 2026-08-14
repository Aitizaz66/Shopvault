import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getSalesReport,
} from "../controllers/adminController.js";
import { adminProtect } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", adminProtect, getDashboardStats);
router.get("/sales", adminProtect, getSalesReport);
router.get("/users", adminProtect, getAllUsers);
router.get("/users/:id", adminProtect, getUserById);
router.put("/users/:id", adminProtect, updateUser);
router.delete("/users/:id", adminProtect, deleteUser);

export default router;
