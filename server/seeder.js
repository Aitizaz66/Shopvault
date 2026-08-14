import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

const products = [];

// Add images array + ensure required fields
const finalProducts = products.map((p) => ({
  ...p,
  images: [p.image],
}));

const seed = async () => {
  await connectDB();
  await Product.deleteMany();
  await Product.insertMany(finalProducts);
  console.log(`✅ Seeded ${finalProducts.length} professional products`);
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
