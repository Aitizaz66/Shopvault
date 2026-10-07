import { configureStore, combineReducers } from "@reduxjs/toolkit";
import adminAuthReducer from "./slices/adminAuthSlice.js";
import adminProductReducer from "./slices/adminProductSlice.js";
import adminOrderReducer from "./slices/adminOrderSlice.js";
import adminUserReducer from "./slices/adminUserSlice.js";
import adminStatsReducer from "./slices/adminStatsSlice.js";

const combined = combineReducers({
    adminAuth: adminAuthReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer,
    adminUsers: adminUserReducer,
    adminStats: adminStatsReducer,
});



const reducer = (state, action) => {
  const ended = ["adminAuth/sessionExpired", "adminAuth/logout/fulfilled"].includes(action.type);
  const changedUser = ["adminAuth/login/fulfilled", "adminAuth/register/fulfilled", "adminAuth/checkAuth/fulfilled"].includes(action.type) && state?.adminAuth.userInfo?._id && state.adminAuth.userInfo._id !== action.payload?._id;
  if (ended || changedUser) {
    state = { adminAuth: state?.adminAuth };
  }
  return combined(state, action);
};
export const store = configureStore({ reducer });

export default store;
