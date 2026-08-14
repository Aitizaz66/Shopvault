import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios.js";

const adminInfo = localStorage.getItem("adminInfo")
  ? JSON.parse(localStorage.getItem("adminInfo"))
  : null;

export const login = createAsyncThunk(
  "adminAuth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/admin-login", credentials);
      const user = response.data.data;
      if (!user.isAdmin) return rejectWithValue("Access denied. Admin only.");
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const logout = createAsyncThunk("adminAuth/logout", async () => {
  try {
    await api.post("/api/auth/admin-logout");
  } catch (e) {
    console.error(e);
  }
  localStorage.removeItem("adminInfo");
  return true;
});

export const checkAuth = createAsyncThunk(
  "adminAuth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/auth/admin-check");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Not authenticated",
      );
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "adminAuth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put("/api/auth/admin-profile", userData);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    userInfo: adminInfo,
    isAuthenticated: !!adminInfo,
    isAdmin: !!adminInfo?.isAdmin,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = true;

        localStorage.setItem("adminInfo", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.isAdmin = false;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.isAuthenticated = false;
        state.isAdmin = false;

        localStorage.removeItem("adminInfo");
      })
      .addCase(logout.rejected, (state) => {
        state.userInfo = null;
        state.isAuthenticated = false;
        state.isAdmin = false;

        localStorage.removeItem("adminInfo");
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = true;

        localStorage.setItem("adminInfo", JSON.stringify(action.payload));
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.userInfo = null;
        state.isAuthenticated = false;
        state.isAdmin = false;

        localStorage.removeItem("adminInfo");
      })

      // UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = !!action.payload?.isAdmin;

        localStorage.setItem("adminInfo", JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
