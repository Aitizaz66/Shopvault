import { randomBytes, timingSafeEqual } from "node:crypto";
import { cookieOptions } from "../utils/generateToken.js";
const valid = (token) => typeof token === "string" && /^[a-f0-9]{64}$/.test(token);
export const csrfToken = (req, res) => {
  const token = valid(req.cookies.csrf) ? req.cookies.csrf : randomBytes(32).toString("hex");
  res.cookie("csrf", token, cookieOptions());
  res.set("Cache-Control", "no-store");
  res.json({ success: true, csrfToken: token });
};
export const csrfProtect = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const cookie = req.cookies.csrf;
  const header = req.get("X-CSRF-Token");
  if (!valid(cookie) || !valid(header) || !timingSafeEqual(Buffer.from(cookie), Buffer.from(header))) {
    return res.status(403).json({ success: false, code: "CSRF_INVALID", message: "Your session could not be verified. Please reload and allow this store's cookies." });
  }
  next();
};
