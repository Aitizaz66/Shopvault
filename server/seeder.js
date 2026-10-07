import "dotenv/config";
import { readFile } from "node:fs/promises";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import { productFields } from "./services/productValidation.js";

// Explicit development-only, non-destructive import: node seeder.js ./products.json
try {
  if (process.env.NODE_ENV === "production") throw new Error("Seeding is disabled in production");
  const file = process.argv[2];
  if (!file) throw new Error("Provide a JSON file containing a non-empty product array");
  const products = JSON.parse(await readFile(file, "utf8"));
  if (!Array.isArray(products) || !products.length) throw new Error("Refusing an empty product import");
  const validated = products.map(product => productFields(product));
  for (const fields of validated) await new Product(fields).validate();
  await connectDB();
  for (const fields of validated) await Product.updateOne({ slug: fields.slug }, { $setOnInsert: fields }, { upsert: true, runValidators: true });
  console.log(`Processed ${validated.length} products. Existing products were preserved.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally { await mongoose.disconnect(); }
