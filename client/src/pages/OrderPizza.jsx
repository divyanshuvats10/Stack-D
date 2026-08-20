import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import PizzaCard from "../components/PizzaCard";
import Loader from "../components/Loader";
import { addToCart } from "../features/cart/cartSlice";

const OrderPizza = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const res = await api.get("/pizzas");
        setPizzas(res.data);
      } catch (err) {
        setError("Failed to load menu. Please try again.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const handleAddToCart = (pizza) => {
    dispatch(
      addToCart({
        cartItemId: pizza._id,
        pizzaId: pizza._id,
        name: pizza.name,
        image: pizza.image,
        unitPrice: pizza.basePrice,
        quantity: 1,
        customizations: [],
        itemTotal: pizza.basePrice,
      })
    );
  };

  const filteredPizzas =
    filter === "all" ? pizzas : pizzas.filter((p) => p.category === filter);

  if (loading) return <Loader />;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="order-page">
      <h2>Our Menu</h2>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("veg")}>Veg</button>
        <button onClick={() => setFilter("non-veg")}>Non-Veg</button>
      </div>

      {filteredPizzas.length === 0 ? (
        <p>No pizzas found.</p>
      ) : (
        <div className="pizza-grid">
          {filteredPizzas.map((pizza) => (
            <PizzaCard
              key={pizza._id}
              pizza={pizza}
              onAdd={() => handleAddToCart(pizza)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPizza;