import jwt from "jsonwebtoken";
export const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
});
const generateToken = (res, userId, isAdmin = false) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "30d" });
  res.cookie(isAdmin ? "adminJwt" : "jwt", token, cookieOptions());
  return token;
};
export const clearToken = (res, isAdmin = false) => res.clearCookie(isAdmin ? "adminJwt" : "jwt", { ...cookieOptions(), maxAge: undefined });
export default generateToken;
