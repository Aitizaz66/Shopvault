// Production uses each frontend's /api rewrite so cookies stay on the same origin.
// Ignore old VITE_API_URL values in hosted builds; otherwise they bypass the proxy.
export const apiBaseUrl = (env = {}) => env.PROD ? "" : env.VITE_API_URL || "";

export function createApi(axios, baseURL, onUnauthorized) {
  const normalized = (baseURL || "").trim().replace(/\/+$/, "").replace(/\/api$/, "");
  const api = axios.create({ baseURL: normalized, withCredentials: true, timeout: 30000 });
  let token;
  let tokenRequest;
  const getToken = async () => {
    if (token) return token;
    if (!tokenRequest) tokenRequest = api.get("/api/auth/csrf").then(response => {
      token = response.data.csrfToken;
      if (!token) throw new Error("Unable to verify your session. Please reload.");
      return token;
    }).finally(() => { tokenRequest = null; });
    return tokenRequest;
  };
  api.interceptors.request.use(async config => {
    if (!["get", "head", "options"].includes((config.method || "get").toLowerCase())) config.headers.set("X-CSRF-Token", await getToken());
    return config;
  });
  api.interceptors.response.use(response => {
    if (!response.data || typeof response.data !== "object" || typeof response.data.success !== "boolean") throw new Error("Unable to reach the store. Please try again later.");
    return response;
  }, async error => {
    const config = error.config;
    if (error.response?.data?.code === "CSRF_INVALID" && config && !config.csrfRetried) {
      token = null;
      config.csrfRetried = true;
      return api(config);
    }
    if (error.response?.status === 401 && !/\/auth\/(login|admin-login|check|admin-check)/.test(config?.url || "")) onUnauthorized?.();
    return Promise.reject(error);
  });
  return api;
}
export const errorMessage = (error, fallback = "The request failed. Please try again.") => error.response?.data?.message || error.message || fallback;
