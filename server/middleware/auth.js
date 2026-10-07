import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticate = adminOnly => async (req, res, next) => {
  const token = req.cookies[adminOnly ? "adminJwt" : "jwt"];
  if (!token) return res.status(401).json({ success: false, message: "Please sign in to continue" });
  let decoded;
  try { decoded = jwt.verify(token, process.env.JWT_SECRET); }
  catch { return res.status(401).json({ success: false, message: "Your session expired. Please sign in again." }); }
  // Let database outages reach the error handler instead of invalidating a good session.
  req.user = await User.findById(decoded.userId);
  if (!req.user) return res.status(401).json({ success: false, message: "Account not found. Please sign in again." });
  if (adminOnly && !req.user.isAdmin) return res.status(403).json({ success: false, message: "Admin access is required" });
  next();
};
export const protect = authenticate(false);
export const adminProtect = authenticate(true);
export const admin = (req, res, next) => req.user?.isAdmin ? next() : res.status(403).json({ success: false, message: "Admin access is required" });
export const optionalAuth = async (req, res, next) => {
  req.user = null;
  if (req.cookies.jwt) {
    let decoded;
    try { decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET); } catch { /* Public browsing does not require a session. */ }
    if (decoded) req.user = await User.findById(decoded.userId);
  }
  next();
};
