import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios.js";
import { readStored, writeStored } from "../../../../shared/storage.js";
import { errorMessage } from "../../../../shared/http.js";
export const login = createAsyncThunk("adminAuth/login", async (data, { rejectWithValue }) => {
  try { return (await api.post("/api/auth/admin-login", data)).data.data; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "login" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
export const checkAuth = createAsyncThunk("adminAuth/checkAuth", async (data, { rejectWithValue }) => {
  try { return (await api.get("/api/auth/admin-check", data)).data.user; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "checkAuth" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
export const updateUserProfile = createAsyncThunk("adminAuth/updateUserProfile", async (data, { rejectWithValue }) => {
  try { return (await api.put("/api/auth/admin-profile", data)).data.data; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "updateUserProfile" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
export const logout = createAsyncThunk("adminAuth/logout", async (data, { rejectWithValue }) => {
  try { return (await api.post("/api/auth/admin-logout", data)).data.success; }
  catch (error) { return rejectWithValue(error.response?.status === 401 && "logout" === "checkAuth" ? "Not authenticated" : errorMessage(error)); }
});
const initialState = { userInfo: readStored("adminInfo", null), isAuthenticated: false, isAdmin: false, isChecking: true, isLoading: false, error: null, requests: {} };
const clearSession = (state) => {
  Object.assign(state, { userInfo: null, isAuthenticated: false, isAdmin: false, isChecking: false, isLoading: false, error: null, requests: {} });
  writeStored("adminInfo", undefined);
};
const slice = createSlice({
  name: "adminAuth", initialState,
  reducers: { clearError: state => { state.error = null; }, sessionExpired: clearSession },
  extraReducers: builder => {
    for (const thunk of [login, checkAuth, updateUserProfile, logout]) {
      builder.addCase(thunk.pending, (state, action) => {
        state.requests[thunk.typePrefix] = action.meta.requestId;
        if (thunk === checkAuth) state.isChecking = true;
        else { state.isLoading = true; delete state.requests[checkAuth.typePrefix]; state.isChecking = false; }
        state.error = null;
      }).addCase(thunk.fulfilled, (state, action) => {
        if (state.requests[thunk.typePrefix] !== action.meta.requestId) return;
        delete state.requests[thunk.typePrefix];
        if (thunk === logout) { clearSession(state); return; }
        state.isLoading = false;
        state.isChecking = false;
        state.userInfo = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = !!action.payload?.isAdmin;
        writeStored("adminInfo", action.payload);
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
