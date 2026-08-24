// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  return (
    <nav className="navbar">
      <Link to="/" className="logo"><span className="logo-mark">🍕</span> Stack'd</Link>
      <div className="nav-links">
        <Link to="/order">Menu</Link>
        <Link to="/build">Build your own</Link>
        <Link to="/cart" className="cart-link">Cart <span className="cart-count">{cartCount}</span></Link>

      </div>
    </nav>
  );
};

export default Navbar;