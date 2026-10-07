import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Order from "./models/Order.js";
import { createApp } from "./app.js";
import { allowedOrigins } from "./config/origins.js";

for (const key of ["MONGODB_URI", "JWT_SECRET"]) {
  if (!process.env[key]) throw new Error(`${key} must be configured`);
}
if (process.env.NODE_ENV === "production" && !allowedOrigins().size) {
  throw new Error("Configure CLIENT_URL, ADMIN_URL, or ALLOWED_ORIGINS before starting production");
}
await connectDB();
const topology = await mongoose.connection.db.admin().command({ hello: 1 });
if (!topology.setName && topology.msg !== "isdbgrid") throw new Error("ShopVault requires a MongoDB replica set (for example Atlas) for atomic order creation");
// Ensure retry protection exists before accepting orders, including in production.
await Order.createIndexes();
const PORT = process.env.PORT || 5000;
createApp().listen(PORT, () => console.log(`Server running on port ${PORT}`));
