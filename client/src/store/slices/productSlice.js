import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios.js";

// Get all products
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// Get single product
export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

// Get product by slug
export const getProductBySlug = createAsyncThunk(
  "products/getProductBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/slug/${slug}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

// Get products by category
export const getProductsByCategory = createAsyncThunk(
  "products/getProductsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/category/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products by category",
      );
    }
  },
);

// Get all categories
export const getCategories = createAsyncThunk(
  "products/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products/categories");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  },
);

// Add review
export const addReview = createAsyncThunk(
  "products/addReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/reviews/${productId}`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add review",
      );
    }
  },
);

// Get product reviews
export const getProductReviews = createAsyncThunk(
  "products/getProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/reviews/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews",
      );
    }
  },
);

const initialState = {
  products: [], product: null, categories: [], reviews: null, isLoading: false,
  isReviewLoading: false, isReviewSubmitting: false, error: null, reviewError: null, requests: {},
  pagination: { page: 1, limit: 12, total: 0, pages: 1 },
};
const productSlice = createSlice({
  name: "products", initialState,
  reducers: {
    clearProduct: state => { state.product = null; state.reviews = null; state.error = null; state.reviewError = null; state.requests = {}; },
    clearError: state => { state.error = null; },
  },
  extraReducers: builder => {
    for (const thunk of [getProducts, getProductsByCategory, getProductById, getProductBySlug, getCategories, getProductReviews, addReview]) {
      const key = thunk === getProductById || thunk === getProductBySlug ? "detail" : thunk === getProducts || thunk === getProductsByCategory ? "list" : thunk.typePrefix;
      const review = thunk === getProductReviews || thunk === addReview;
      const flag = thunk === getCategories ? "isCategoryLoading" : thunk === addReview ? "isReviewSubmitting" : review ? "isReviewLoading" : "isLoading";
      const errorKey = thunk === getCategories ? "categoryError" : review ? "reviewError" : "error";
      builder.addCase(thunk.pending, (state, action) => {
        state.requests[key] = action.meta.requestId;
        state[flag] = true; state[errorKey] = null;
        if (key === "detail") state.product = null;
        if (thunk === getProductReviews) state.reviews = null;
      }).addCase(thunk.fulfilled, (state, action) => {
        if (state.requests[key] !== action.meta.requestId) return;
        state[flag] = false;
        if (key === "list") { state.products = action.payload.data || []; state.pagination = action.payload.pagination || initialState.pagination; }
        else if (key === "detail") state.product = action.payload;
        else if (thunk === getCategories) state.categories = action.payload;
        else if (thunk === getProductReviews) {
          state.reviews = action.payload;
          if (state.product?._id === action.meta.arg) { state.product.rating = action.payload.rating; state.product.numReviews = action.payload.numReviews; }
        }
      }).addCase(thunk.rejected, (state, action) => {
        if (state.requests[key] !== action.meta.requestId) return;
        state[flag] = false; state[errorKey] = action.payload || action.error.message;
        if (key === "list") state.products = [];
      });
    }
  },
});
export const { clearProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
