import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios.js";
import { readStored, writeStored } from "../../../../shared/storage.js";
import { errorMessage } from "../../../../shared/http.js";
export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try { return (await api.post("/api/auth/login", data)).data.data; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "login" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
export const checkAuth = createAsyncThunk("auth/checkAuth", async (data, { rejectWithValue }) => {
  try { return (await api.get("/api/auth/check", data)).data.user; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "checkAuth" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
export const updateUserProfile = createAsyncThunk("auth/updateUserProfile", async (data, { rejectWithValue }) => {
  try { return (await api.put("/api/auth/profile", data)).data.data; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "updateUserProfile" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
export const register = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try { return (await api.post("/api/auth/register", data)).data.data; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "register" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
export const getUserProfile = createAsyncThunk("auth/getUserProfile", async (data, { rejectWithValue }) => {
  try { return (await api.get("/api/auth/profile", data)).data.data; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "getUserProfile" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
export const logoutUser = createAsyncThunk("auth/logoutUser", async (data, { rejectWithValue }) => {
  try { return (await api.post("/api/auth/logout", data)).data.success; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "logoutUser" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
const initialState = { userInfo: readStored("userInfo", null), isAuthenticated: false, isAdmin: false, isChecking: true, isLoading: false, error: null, requests: {} };
const clearSession = (state) => {
  Object.assign(state, { userInfo: null, isAuthenticated: false, isAdmin: false, isChecking: false, isLoading: false, error: null, requests: {} });
  writeStored("userInfo", undefined);
};
const slice = createSlice({
  name: "auth", initialState,
  reducers: { clearError: state => { state.error = null; }, sessionExpired: clearSession },
  extraReducers: builder => {
    for (const thunk of [login, checkAuth, updateUserProfile, register, getUserProfile, logoutUser]) {
      builder.addCase(thunk.pending, (state, action) => {
        state.requests[thunk.typePrefix] = action.meta.requestId;
        if (thunk === checkAuth) state.isChecking = true;
        else { state.isLoading = true; delete state.requests[checkAuth.typePrefix]; state.isChecking = false; }
        state.error = null;
      }).addCase(thunk.fulfilled, (state, action) => {
        if (state.requests[thunk.typePrefix] !== action.meta.requestId) return;
        delete state.requests[thunk.typePrefix];
        if (thunk === logoutUser) { clearSession(state); return; }
        state.isLoading = false;
        state.isChecking = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = !!action.payload?.isAdmin;
        writeStored("userInfo", action.payload);
      }).addCase(thunk.rejected, (state, action) => {
        if (state.requests[thunk.typePrefix] !== action.meta.requestId) return;
        delete state.requests[thunk.typePrefix];
        state.isLoading = false;
        state.isChecking = false;
        if (thunk === checkAuth) clearSession(state);
        state.error = action.payload === "Not authenticated" ? null : action.payload || action.error.message;
      });
    }
  },
});
export const { clearError, sessionExpired } = slice.actions;
export default slice.reducer;
