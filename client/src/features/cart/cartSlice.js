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
    updateIngredients: (state, action) => {
      const { cartItemId, extraIngredients } = action.payload;
      const item = state.items.find((cartItem) => cartItem.cartItemId === cartItemId);
      if (item) {
        item.originalCustomizations = item.originalCustomizations || (item.customizations || []).filter(
          (customization) => !customization.startsWith("Extra ")
        );
        item.extraIngredients = extraIngredients;
        item.basePrice = item.basePrice ?? item.unitPrice;
        item.unitPrice = item.basePrice + extraIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
        item.itemTotal = item.quantity * item.unitPrice;
        item.customizations = [
          ...(item.originalCustomizations || item.customizations || []),
          ...extraIngredients.map((ingredient) => `Extra ${ingredient.name}`),
        ];
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setItems, addToCart, removeFromCart, updateQuantity, updateIngredients, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;