import { createSlice } from "@reduxjs/toolkit";
import { readStored, writeStored } from "../../../../shared/storage.js";
const saved = readStored("cartItems", []);
const cartItems = Array.isArray(saved) ? saved.filter(item => item && typeof item.product === "string" && Number.isInteger(item.quantity) && item.quantity > 0 && Number.isFinite(item.price) && item.price >= 0).map(item => ({ ...item, quantity: Math.min(item.quantity, Math.max(0, Number(item.stock) || 0)) })).filter(item => item.quantity > 0) : [];
const initialState = { cartItems, shippingAddress: readStored("shippingAddress", {}) || {}, paymentMethod: "Cash on Delivery" };
const persist = state => writeStored("cartItems", state.cartItems);
const cartSlice = createSlice({
  name: "cart", initialState,
  reducers: {
    addToCart: (state, { payload: item }) => {
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || !Number.isInteger(item.stock) || item.stock < 1) return;
      const existing = state.cartItems.find(x => x.product === item.product);
      const quantity = Math.min(item.stock, (existing?.quantity || 0) + item.quantity);
      if (existing) Object.assign(existing, item, { quantity });
      else state.cartItems.push({ ...item, quantity });
      persist(state);
    },
    removeFromCart: (state, action) => { state.cartItems = state.cartItems.filter(x => x.product !== action.payload); persist(state); },
    updateQuantity: (state, { payload: { productId, quantity } }) => {
      const item = state.cartItems.find(x => x.product === productId);
      if (item && Number.isInteger(quantity) && quantity >= 1) item.quantity = Math.min(quantity, item.stock);
      persist(state);
    },
    clearCart: state => { state.cartItems = []; writeStored("cartItems", undefined); },
    clearCustomerCart: state => { state.cartItems = []; state.shippingAddress = {}; writeStored("cartItems", undefined); writeStored("shippingAddress", undefined); },
    saveShippingAddress: (state, action) => { state.shippingAddress = action.payload; writeStored("shippingAddress", action.payload); },
    savePaymentMethod: state => { state.paymentMethod = "Cash on Delivery"; },
  },
});
export const { addToCart, removeFromCart, updateQuantity, clearCart, clearCustomerCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions;
export default cartSlice.reducer;
