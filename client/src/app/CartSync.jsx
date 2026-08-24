import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { setItems } from "../features/cart/cartSlice";

const CartSync = () => {
  const user = useSelector((state) => state.auth.user);
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const hydratedUserId = useRef(null);
  const skipSave = useRef(false);

  useEffect(() => {
    let cancelled = false;

    if (!user?._id) {
      hydratedUserId.current = null;
      return undefined;
    }

    hydratedUserId.current = null;
    api.get("/cart").then((response) => {
      if (cancelled) return;
      skipSave.current = true;
      dispatch(setItems(response.data.items));
      hydratedUserId.current = user._id;
    }).catch(() => {
      hydratedUserId.current = user._id;
    });

    return () => { cancelled = true; };
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (!user?._id || hydratedUserId.current !== user._id) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      api.put("/cart", { items }).catch(() => {});
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [items, user?._id]);

  return null;
};

export default CartSync;