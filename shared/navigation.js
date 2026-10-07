export function safeRedirect(value, fallback = "/") {
  if (typeof value !== "string" || !value) return fallback;
  const path = value.startsWith("/") ? value : `/${value}`;
  if (path.startsWith("//") || /[\\\r\n]/.test(path) || /^\/(login|register)([/?#]|$)/.test(path)) return fallback;
  if (fallback === "/admin" && !/^\/admin(?:[/?#]|$)/.test(path)) return fallback;
  return path;
}
