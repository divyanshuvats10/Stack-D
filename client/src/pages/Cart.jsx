import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  updateIngredients,
} from "../features/cart/cartSlice";
import customPizzaImage from "../assets/custom.png";
import api from "../api/axios";

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api.get("/ingredients").then((res) => setIngredients(res.data)).catch(() => setIngredients([]));
  }, []);

  const grandTotal = items.reduce((sum, item) => sum + item.itemTotal, 0);

  const handleQuantityChange = (cartItemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ cartItemId, quantity: newQty }));
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  const ingredientGroups = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === "topping"),
    [ingredients]
  );

  const handleIngredientsChange = (item, ingredient) => {
    const current = item.extraIngredients || [];
    const next = current.some((selected) => selected._id === ingredient._id)
      ? current.filter((selected) => selected._id !== ingredient._id)
      : [...current, ingredient];
    dispatch(updateIngredients({ cartItemId: item.cartItemId, extraIngredients: next }));
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8"><p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-tomato">// nothing here yet</p>
        <h1 className="text-5xl font-extrabold tracking-[-0.06em] text-ink">Your cart is<br /><span className="text-tomato">waiting.</span></h1>
        <button className="mt-8 rounded-xl bg-tomato px-6 py-3.5 text-sm font-extrabold text-white" onClick={() => navigate("/order")}>
          Browse the menu →
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-10 border-b border-line pb-8"><p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-tomato">// almost there</p><h1 className="text-5xl font-extrabold tracking-[-0.06em] text-ink">Your order.</h1></div>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex flex-wrap gap-4 rounded-2xl border border-line bg-paper p-4 sm:items-center">
            <img className="h-24 w-24 rounded-xl object-cover" src={item.pizzaId === "custom-build" ? customPizzaImage : item.image} alt={item.name} />
            <div className="min-w-0 flex-1"><h4 className="font-extrabold text-ink">{item.name}</h4>{item.customizations?.length > 0 && <div className="mt-2 flex max-w-full flex-wrap gap-1.5">{item.customizations.map((customization, index) => <span key={`${customization}-${index}`} className="max-w-full wrap-break-word rounded-md bg-[#eee7de] px-2 py-1 text-[10px] leading-tight text-muted">{customization}</span>)}</div>}<div className="mt-3 space-y-1 font-mono text-xs text-muted"><p>Pizza: ₹{item.basePrice ?? item.unitPrice}</p>{item.extraIngredients?.length > 0 && <p>Ingredients: +₹{item.extraIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0)}</p>}<p className="font-medium text-ink">Total: ₹{item.unitPrice} each</p></div>
              <button className="mt-3 text-xs font-bold text-tomato" onClick={() => setEditingId(editingId === item.cartItemId ? null : item.cartItemId)}>{editingId === item.cartItemId ? "Done" : "+ Add ingredients"}</button>
              {editingId === item.cartItemId && <div className="mt-3 flex flex-wrap gap-2">{ingredientGroups.map((ingredient) => { const selected = item.extraIngredients?.some((extra) => extra._id === ingredient._id); return <button key={ingredient._id} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${selected ? "border-tomato bg-[#fbe5df] text-tomato" : "border-line text-muted"}`} onClick={() => handleIngredientsChange(item, ingredient)}>{ingredient.name} +₹{ingredient.price}</button>; })}</div>}
            </div>
            <div className="flex items-center rounded-lg border border-line p-0.5">
              <button
                className="h-7 w-7 rounded-md text-lg text-muted hover:bg-[#eee7de]"
                onClick={() =>
                  handleQuantityChange(item.cartItemId, item.quantity - 1)
                }
              >
                -
              </button>
              <span className="w-7 text-center font-mono text-xs">{item.quantity}</span>
              <button
                className="h-7 w-7 rounded-md text-lg text-muted hover:bg-[#eee7de]"
                onClick={() =>
                  handleQuantityChange(item.cartItemId, item.quantity + 1)
                }
              >
                +
              </button>
            </div>
            <p className="hidden font-mono text-sm font-medium text-ink sm:block">₹{item.itemTotal}</p>
            <button
              className="self-start text-muted hover:text-tomato"
              onClick={() => handleRemove(item.cartItemId)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <aside className="rounded-3xl bg-ink p-6 text-white lg:sticky lg:top-24"><div className="mb-6 flex justify-between text-sm text-white/60"><span>Items</span><span>{items.length}</span></div><div className="mb-6 flex justify-between border-b border-white/10 pb-6 text-sm text-white/60"><span>Delivery</span><span className="text-sage">Free</span></div><div className="flex items-end justify-between"><span className="text-sm text-white/60">Total</span><span className="font-mono text-2xl">₹{grandTotal}</span></div><button className="mt-6 w-full rounded-xl bg-tomato px-4 py-3.5 text-sm font-extrabold hover:bg-[#f0644d]" onClick={() => navigate("/checkout")}>Proceed to checkout →</button><button className="mt-3 w-full py-2 text-xs font-bold text-white/50 hover:text-white" onClick={() => dispatch(clearCart())}>Clear order</button>
      </aside></div>
    </main>
  );
};

export default Cart;