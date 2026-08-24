import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { pizzaId, name, image, basePrice, quantity, customizations, itemTotal }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      // if same pizza with same customizations already exists, increase qty
      const existing = state.items.find(
        (item) => item.cartItemId === newItem.cartItemId
      );
      if (existing) {
        existing.quantity += newItem.quantity;
        existing.itemTotal = existing.quantity * existing.unitPrice;
      } else {
        state.items.push(newItem);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.cartItemId !== action.payload
      );
    },
    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find((i) => i.cartItemId === cartItemId);
      if (item) {
        item.quantity = quantity;
        item.itemTotal = item.quantity * item.unitPrice;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setItems, addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;