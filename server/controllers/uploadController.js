import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { httpError } from "../utils/httpError.js";
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
  },
}).single("image");
export const storeImage = async (req, res) => {
  if (!req.file) throw httpError(400, "Choose a JPEG, PNG, or WebP image");
  const bytes = req.file.buffer;
  const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!png && !jpeg && !webp) throw httpError(400, "The file is not a supported image");
  if (process.env.CLOUDINARY_URL) cloudinary.config();
  else cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) throw httpError(503, "Image uploads are unavailable. Please use a hosted image URL.");
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "image", folder: "shopvault", allowed_formats: ["jpg", "png", "webp"], transformation: [{ width: 1600, height: 1600, crop: "limit" }] }, (error, value) => error ? reject(error) : resolve(value)).end(bytes);
  });
  res.status(201).json({ success: true, data: { url: result.secure_url } });
};
