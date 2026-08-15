import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do NOT redirect automatically here.
    // AdminGuard will decide whether the user should go to login.
    return Promise.reject(error);
  },
);

export default api;
