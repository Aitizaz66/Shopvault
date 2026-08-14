import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

export const adminProtect = async (req, res, next) => {
  const token = req.cookies.adminJwt;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no admin token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized as an admin" });
    }
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) next();
  else
    return res
      .status(403)
      .json({ success: false, message: "Not authorized as an admin" });
};

export const optionalAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
    } catch {
      req.user = null;
    }
  } else req.user = null;
  next();
};
