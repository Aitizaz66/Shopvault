import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slices/adminAuthSlice.js";
import adminProductReducer from "./slices/adminProductSlice.js";
import adminOrderReducer from "./slices/adminOrderSlice.js";
import adminUserReducer from "./slices/adminUserSlice.js";
import adminStatsReducer from "./slices/adminStatsSlice.js";

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer,
    adminUsers: adminUserReducer,
    adminStats: adminStatsReducer,
  },
});

export default store;
