import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import Loader from "../components/Loader";
import { addToCart } from "../features/cart/cartSlice";
import { generateCartItemId } from "../utils/cartHelpers";

const BASE_PIZZA_PRICE = 150; // starting price before any selections
const BASE_PIZZA_ID = "custom-build"; // constant "virtual" pizza id for custom builds

const BuildPizza = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({
    base: null,
    sauce: null,
    cheese: null,
    toppings: [],
  });
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const res = await api.get("/ingredients");
        setIngredients(res.data);
      } catch (err) {
        setError("Failed to load ingredients.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  const grouped = {
    base: ingredients.filter((i) => i.type === "base"),
    sauce: ingredients.filter((i) => i.type === "sauce"),
    cheese: ingredients.filter((i) => i.type === "cheese"),
    topping: ingredients.filter((i) => i.type === "topping"),
  };

  const handleSingleSelect = (type, ingredient) => {
    setSelected((prev) => ({ ...prev, [type]: ingredient }));
  };

  const handleToppingToggle = (ingredient) => {
    setSelected((prev) => {
      const exists = prev.toppings.find((t) => t._id === ingredient._id);
      return {
        ...prev,
        toppings: exists
          ? prev.toppings.filter((t) => t._id !== ingredient._id)
          : [...prev.toppings, ingredient],
      };
    });
  };

  // ---- dynamic price calculation ----
  const calculateUnitPrice = () => {
    let total = BASE_PIZZA_PRICE;
    if (selected.base) total += selected.base.price;
    if (selected.sauce) total += selected.sauce.price;
    if (selected.cheese) total += selected.cheese.price;
    total += selected.toppings.reduce((sum, t) => sum + t.price, 0); 
    return total;
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = unitPrice * quantity;

  const isValid = selected.base && selected.sauce && selected.cheese;

  const handleAddToCart = () => {
    if (!isValid) return;

    const allIngredientIds = [
      selected.base._id,
      selected.sauce._id,
      selected.cheese._id,
      ...selected.toppings.map((t) => t._id),
    ];

    const cartItemId = generateCartItemId(BASE_PIZZA_ID, allIngredientIds);

    dispatch(
      addToCart({
        cartItemId,
        pizzaId: BASE_PIZZA_ID,
        name: "Custom Pizza",
        image: "/images/custom-pizza.jpg",
        basePrice: BASE_PIZZA_PRICE,
        unitPrice,
        quantity,
        customizations: [
          selected.base.name,
          selected.sauce.name,
          selected.cheese.name,
          ...selected.toppings.map((t) => t.name),
        ],
        originalCustomizations: [
          selected.base.name,
          selected.sauce.name,
          selected.cheese.name,
          ...selected.toppings.map((t) => t.name),
        ],
        extraIngredients: [],
        itemTotal: totalPrice,
      })
    );

    // reset after adding
    setSelected({ base: null, sauce: null, cheese: null, toppings: [] });
    setQuantity(1);
  };

  if (loading) return <Loader />;
  if (error) return <p className="mx-auto max-w-7xl px-5 py-16 text-tomato">{error}</p>;

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-10 border-b border-line pb-8"><p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-tomato">// your canvas, your rules</p><h1 className="text-5xl font-extrabold tracking-[-0.06em] text-ink">Build something<br /><span className="text-tomato">delicious.</span></h1></div>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <IngredientGroup title="01 / Choose a base" items={grouped.base} selected={selected.base} onSelect={(item) => handleSingleSelect("base", item)} />
          <IngredientGroup title="02 / Pick a sauce" items={grouped.sauce} selected={selected.sauce} onSelect={(item) => handleSingleSelect("sauce", item)} />
          <IngredientGroup title="03 / Add cheese" items={grouped.cheese} selected={selected.cheese} onSelect={(item) => handleSingleSelect("cheese", item)} />
          <div className="rounded-2xl border border-line bg-paper p-6"><h3 className="mb-4 text-lg font-extrabold text-ink">04 / Top it off</h3><div className="flex flex-wrap gap-2">{grouped.topping.map((item) => { const isSelected = selected.toppings.some((t) => t._id === item._id); return <button key={item._id} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${isSelected ? 'border-tomato bg-[#fbe5df] text-tomato' : 'border-line text-muted hover:border-tomato hover:text-tomato'}`} onClick={() => handleToppingToggle(item)}>{item.name}{item.price > 0 && <span className="ml-2 font-mono text-xs">+₹{item.price}</span>}</button>; })}</div></div>
        </section>
        <aside className="sticky top-24 rounded-3xl bg-ink p-6 text-white shadow-xl"><div className="mb-8 flex items-center justify-between"><span className="font-mono text-xs uppercase tracking-[0.18em] text-[#f7b5a9]">Your creation</span><span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs">{quantity} pizza</span></div><div className="mb-8 grid aspect-square place-items-center rounded-2xl bg-[#493e36] text-8xl">🍕</div><h2 className="text-2xl font-extrabold">Custom Pizza</h2><div className="mt-4 space-y-2 border-b border-white/10 pb-5 text-sm text-white/60"><p>{selected.base?.name || 'Choose a base'}</p><p>{selected.sauce?.name || 'Choose a sauce'}</p><p>{selected.cheese?.name || 'Choose cheese'}</p>{selected.toppings.map((topping) => <p key={topping._id}>{topping.name}</p>)}</div><div className="mt-5 flex items-end justify-between"><span className="text-sm text-white/60">Total</span><span className="font-mono text-2xl">₹{totalPrice}</span></div><div className="mt-5 flex items-center justify-between rounded-xl bg-white/10 p-1"><button className="h-9 w-10 rounded-lg text-xl hover:bg-white/10" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button><span className="font-mono text-sm">{quantity}</span><button className="h-9 w-10 rounded-lg text-xl hover:bg-white/10" onClick={() => setQuantity((q) => q + 1)}>+</button></div><button className="mt-3 w-full rounded-xl bg-tomato px-4 py-3.5 text-sm font-extrabold transition hover:bg-[#f0644d] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40" disabled={!isValid} onClick={handleAddToCart}>Add to cart <span className="ml-1">→</span></button>{!isValid && <p className="mt-3 text-center text-xs text-white/40">Select a base, sauce, and cheese to continue.</p>}</aside>
      </div>
    </main>
  );
};

// reusable single-select group (base/sauce/cheese)
const IngredientGroup = ({ title, items, selected, onSelect }) => (
  <div className="rounded-2xl border border-line bg-paper p-6">
    <h3 className="mb-4 text-lg font-extrabold text-ink">{title}</h3>
    <div className="grid gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <button
          key={item._id}
          className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${selected?._id === item._id ? "border-tomato bg-[#fbe5df] text-tomato" : "border-line text-muted hover:border-tomato hover:text-tomato"}`}
          onClick={() => onSelect(item)}
        >
          {item.name} {item.price > 0 && `+₹${item.price}`}
        </button>
      ))}
    </div>
  </div>
);

export default BuildPizza;