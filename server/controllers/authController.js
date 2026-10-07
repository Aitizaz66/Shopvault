import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken, { clearToken } from "../utils/generateToken.js";
import { httpError } from "../utils/httpError.js";

const profile = (user) => ({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, address: user.address, createdAt: user.createdAt, updatedAt: user.updatedAt });
const emailValue = (value) => {
  if (typeof value !== "string" || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) throw httpError(400, "Please enter a valid email address");
  return value.trim().toLowerCase();
};
const nameValue = (value) => {
  if (typeof value !== "string" || !value.trim() || value.length > 100) throw httpError(400, "Please enter a name of 1 to 100 characters");
  return value.trim();
};
const validatePassword = (value) => {
  if (typeof value !== "string" || value.length < 6 || Buffer.byteLength(value) > 72) throw httpError(400, "Password must be at least 6 characters and no more than 72 bytes");
};
export const registerUser = async (req, res) => {
  const name = nameValue(req.body.name);
  const email = emailValue(req.body.email);
  validatePassword(req.body.password);
  if (await User.exists({ email })) throw httpError(409, "An account with this email already exists");
  const password = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ name, email, password });
  generateToken(res, user._id);
  res.status(201).json({ success: true, data: profile(user) });
};
const login = (adminOnly) => async (req, res) => {
  const email = emailValue(req.body.email);
  if (typeof req.body.password !== "string" || !req.body.password) throw httpError(400, "Please enter your password");
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) throw httpError(401, "Invalid email or password");
  if (adminOnly && !user.isAdmin) throw httpError(403, "Access denied. Admin only.");
  generateToken(res, user._id, adminOnly);
  res.json({ success: true, data: profile(user) });
};
export const loginUser = login(false);
export const adminLogin = login(true);
export const logoutUser = (req, res) => { clearToken(res); res.json({ success: true }); };
export const adminLogout = (req, res) => { clearToken(res, true); res.json({ success: true }); };
export const getUserProfile = (req, res) => res.json({ success: true, data: profile(req.user) });
export const checkAuth = (req, res) => res.json({ success: true, isAuthenticated: true, user: profile(req.user) });
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw httpError(404, "User not found");
  if (req.body.name !== undefined) user.name = nameValue(req.body.name);
  if (req.body.email !== undefined) {
    const email = emailValue(req.body.email);
    if (await User.exists({ email, _id: { $ne: user._id } })) throw httpError(409, "Email is already in use");
    user.email = email;
  }
  if (req.body.password) {
    validatePassword(req.body.password);
    user.password = await bcrypt.hash(req.body.password, 10);
  }
  if (req.body.address !== undefined) {
    if (!req.body.address || typeof req.body.address !== "object" || Array.isArray(req.body.address)) throw httpError(400, "Invalid address");
    for (const field of ["street", "city", "state", "zipCode", "country"]) {
      const value = req.body.address[field];
      if (value !== undefined) {
        if (typeof value !== "string" || value.length > 250) throw httpError(400, `Invalid address ${field}`);
        user.address[field] = value.trim();
      }
    }
  }
  await user.save();
  res.json({ success: true, data: profile(user) });
};
