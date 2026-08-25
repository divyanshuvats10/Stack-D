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

  if (loading) return <Loader />;
  if (error) return <p className="mx-auto max-w-7xl px-5 py-16 text-tomato">{error}</p>;

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-10 border-b border-line pb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-tomato">// the menu</p><h1 className="text-5xl font-extrabold tracking-[-0.06em] text-ink">Find your next<br /><span className="text-tomato">favorite slice.</span></h1>
      </div>

      {pizzas.length === 0 ? (
        <p className="py-12 text-muted">No pizzas found.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pizzas.map((pizza) => (
            <PizzaCard
              key={pizza._id}
              pizza={pizza}
              onAdd={() => handleAddToCart(pizza)}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default OrderPizza;