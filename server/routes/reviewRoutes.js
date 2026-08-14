import express from "express";
import {
  addReview,
  getProductReviews,
  deleteReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import { protect, adminProtect } from "../middleware/auth.js";

const router = express.Router();

router.get("/all", adminProtect, getAllReviews);
router.get("/:productId", getProductReviews);
router.post("/:productId", protect, addReview);
router.delete("/:productId/:reviewId", adminProtect, deleteReview);

export default router;
