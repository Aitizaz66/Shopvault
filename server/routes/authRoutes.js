import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  checkAuth,
  adminLogin,
  adminLogout,
} from "../controllers/authController.js";
import { protect, adminProtect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);
router.post("/logout", logoutUser);
router.post("/admin-logout", adminLogout);

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/check", protect, checkAuth);

router.get("/admin-profile", adminProtect, getUserProfile);
router.put("/admin-profile", adminProtect, updateUserProfile);


router.get("/admin-check", adminProtect, (req, res) => {
  res.status(200).json({
    success: true,
    isAuthenticated: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    },
  });
});

export default router;
