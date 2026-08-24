import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import authReducer from "../features/auth/authSlice";

const CART_STORAGE_KEY = "stackd_cart";

const loadCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : undefined;
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState: {
    cart: loadCart(),
  },
});

store.subscribe(() => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(store.getState().cart));
});