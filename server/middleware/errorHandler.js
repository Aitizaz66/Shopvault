export default function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  let status = error.statusCode || error.status || 500;
  let message = error.message;
  if (error.name === "ValidationError" || error.name === "CastError") {
    status = 400;
    message = error.name === "CastError" ? "Invalid identifier or field value" : Object.values(error.errors).map(e => e.message).join(". ");
  }
  if (error.name === "VersionError") { status = 409; message = "This record changed. Reload and try again."; }
  if (error.code === 11000) { status = 409; message = "A record with these details already exists"; }
  if (status === 413) message = "The request is too large. Use the image upload endpoint for files.";
  if (error.code === "LIMIT_FILE_SIZE") { status = 413; message = "Upload is too large. Images must be 5 MB or smaller."; }
  if (error.name === "MulterError" && status === 500) { status = 400; message = "Choose one supported image file"; }
  if (status >= 500) {
    console.error(`${req.method} ${req.path}:`, error.message);
    message = error.statusCode ? error.message : "The request could not be completed. Please try again.";
  }
  res.status(status).json({ success: false, message, ...(typeof error.code === "string" && { code: error.code }) });
}
