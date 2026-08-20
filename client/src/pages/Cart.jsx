import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../features/cart/cartSlice";

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const grandTotal = items.reduce((sum, item) => sum + item.itemTotal, 0);

  const handleQuantityChange = (cartItemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ cartItemId, quantity: newQty }));
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  if (items.length === 0) {
    return (
      <div className="cart-page empty">
        <h2>Your cart is empty</h2>
        <button className="btn-primary" onClick={() => navigate("/order")}>
          Browse Pizzas
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      <div className="cart-items">
        {items.map((item) => (
          <div key={item.cartItemId} className="cart-item">
            <img src={item.image} alt={item.name} />

            <div className="cart-item-details">
              <h4>{item.name}</h4>
              {item.customizations?.length > 0 && (
                <p className="customizations">
                  {item.customizations.join(", ")}
                </p>
              )}
              <p className="unit-price">₹{item.unitPrice} each</p>
            </div>

            <div className="quantity-control">
              <button
                onClick={() =>
                  handleQuantityChange(item.cartItemId, item.quantity - 1)
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  handleQuantityChange(item.cartItemId, item.quantity + 1)
                }
              >
                +
              </button>
            </div>

            <p className="item-total">₹{item.itemTotal}</p>

            <button
              className="remove-btn"
              onClick={() => handleRemove(item.cartItemId)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: ₹{grandTotal}</h3>
        <div className="cart-actions">
          <button className="btn-secondary" onClick={() => dispatch(clearCart())}>
            Clear Cart
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;