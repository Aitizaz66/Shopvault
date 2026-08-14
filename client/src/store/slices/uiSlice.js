import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartOpen: false,
  isModalOpen: false,
  modalContent: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalContent = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalContent = null;
    },
  },
});

export const { toggleCart, openCart, closeCart, openModal, closeModal } =
  uiSlice.actions;
export default uiSlice.reducer;
