import express from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductByCategory,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { adminProtect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/slug/:slug", getProductBySlug);
router.get("/category/:category", getProductByCategory);
router.get("/:id", getProductById);

router.post("/", adminProtect, createProduct);
router.put("/:id", adminProtect, updateProduct);
router.delete("/:id", adminProtect, deleteProduct);

export default router;
