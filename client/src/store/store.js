import { clearCustomerCart } from "./slices/cartSlice.js";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice.js";
import authReducer from "./slices/authSlice.js";
import productReducer from "./slices/productSlice.js";
import orderReducer from "./slices/orderSlice.js";
import uiReducer from "./slices/uiSlice.js";

const combined = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
    ui: uiReducer,
});


const reducer = (state, action) => {
  const ended = ["auth/sessionExpired", "auth/logoutUser/fulfilled"].includes(action.type);
  const changedUser = ["auth/login/fulfilled", "auth/register/fulfilled", "auth/checkAuth/fulfilled"].includes(action.type) && state?.auth.userInfo?._id && state.auth.userInfo._id !== action.payload?._id;
  if (ended || changedUser) {
    state = { auth: state?.auth, cart: cartReducer(state?.cart, clearCustomerCart()) };
  }
  return combined(state, action);
};
export const store = configureStore({ reducer });

export default store;
