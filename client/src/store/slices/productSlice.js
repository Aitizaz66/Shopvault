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
      const response = await api.get(`/api/products/category/${category}`);
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
  products: [],
  product: null,
  categories: [],
  reviews: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1,
        };
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.products = [];
      })
      // Get Product By ID
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Categories
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload || [];
      })
      .addCase(getCategories.rejected, (state) => {
        state.categories = [];
      });
  },
});

export const { clearProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
