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
        unitPrice,
        quantity,
        customizations: [
          selected.base.name,
          selected.sauce.name,
          selected.cheese.name,
          ...selected.toppings.map((t) => t.name),
        ],
        itemTotal: totalPrice,
      })
    );

    // reset after adding
    setSelected({ base: null, sauce: null, cheese: null, toppings: [] });
    setQuantity(1);
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="build-page">
      <h2>Build Your Own Pizza</h2>

      <IngredientGroup
        title="Choose Base"
        items={grouped.base}
        selected={selected.base}
        onSelect={(item) => handleSingleSelect("base", item)}
      />
      <IngredientGroup
        title="Choose Sauce"
        items={grouped.sauce}
        selected={selected.sauce}
        onSelect={(item) => handleSingleSelect("sauce", item)}
      />
      <IngredientGroup
        title="Choose Cheese"
        items={grouped.cheese}
        selected={selected.cheese}
        onSelect={(item) => handleSingleSelect("cheese", item)}
      />

      <div className="ingredient-group">
        <h3>Add Toppings</h3>
        <div className="ingredient-options">
          {grouped.topping.map((item) => {
            const isSelected = selected.toppings.some((t) => t._id === item._id);
            return (
              <button
                key={item._id}
                className={`ingredient-btn ${isSelected ? "active" : ""}`}
                onClick={() => handleToppingToggle(item)}
              >
                {item.name} {item.price > 0 && `+₹${item.price}`}
              </button>
            );
          })}
        </div>
      </div>

	        <div className="ingredient-group">
        <h3>Add Toppings</h3>
        <div className="ingredient-options">
          {grouped.topping.map((item) => {
            const isSelected = selected.toppings.some((t) => t._id === item._id);
            return (
              <button
                key={item._id}
                className={`ingredient-btn ${isSelected ? "active" : ""}`}
                onClick={() => handleToppingToggle(item)}
              >
                {item.name} {item.price > 0 && `+₹${item.price}`}
              </button>
            );
          })}
        </div>

        {/* NEW: selected toppings list with remove buttons */}
        {selected.toppings.length > 0 && (
          <div className="selected-toppings">
            <h4>Selected Toppings</h4>
            <ul>
              {selected.toppings.map((topping) => (
                <li key={topping._id} className="selected-topping-item">
                  <span>
                    {topping.name} {topping.price > 0 && `(+₹${topping.price})`}
                  </span>
                  <button
                    className="remove-topping-btn"
                    onClick={() => handleToppingToggle(topping)}
                    aria-label={`Remove ${topping.name}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="build-summary">
        <div className="quantity-control">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>

        <p className="live-price">Unit Price: ₹{unitPrice}</p>
        <p className="live-price total">Total: ₹{totalPrice}</p>

        {!isValid && (
          <p className="validation-msg">
            Please select a base, sauce, and cheese to continue.
          </p>
        )}

        <button
          className="btn-primary"
          disabled={!isValid}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// reusable single-select group (base/sauce/cheese)
const IngredientGroup = ({ title, items, selected, onSelect }) => (
  <div className="ingredient-group">
    <h3>{title}</h3>
    <div className="ingredient-options">
      {items.map((item) => (
        <button
          key={item._id}
          className={`ingredient-btn ${selected?._id === item._id ? "active" : ""}`}
          onClick={() => onSelect(item)}
        >
          {item.name} {item.price > 0 && `+₹${item.price}`}
        </button>
      ))}
    </div>
  </div>
);

export default BuildPizza;