export function allowedOrigins() {
  const values = [process.env.CLIENT_URL, process.env.ADMIN_URL, ...(process.env.ALLOWED_ORIGINS || "").split(",")].filter(Boolean);
  if (process.env.NODE_ENV !== "production") values.push("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174");
  return new Set(values.map(value => {
    const url = new URL(value.trim());
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || (url.pathname !== "/") || url.search || url.hash) throw new Error("Allowed frontend URLs must be exact HTTP(S) origins");
    return url.origin;
  }));
}
