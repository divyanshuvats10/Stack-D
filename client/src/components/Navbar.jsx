import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-tomato text-xl text-white shadow-[0_5px_0_#bc3827]">+</span>
        <span className="font-mono text-lg font-medium tracking-[-0.08em]">STACK'D<span className="text-tomato">.</span></span>
      </Link>
      <div className="hidden items-center gap-8 text-sm font-semibold text-muted md:flex">
        <Link className="transition-colors hover:text-tomato" to="/order">Menu</Link>
        <Link className="transition-colors hover:text-tomato" to="/build">Build your own</Link>
      </div>
      <Link to="/cart" className="flex items-center gap-3 rounded-full border border-line bg-paper px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-tomato">
        <span>Cart</span>
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 font-mono text-xs text-white">{cartCount}</span>
      </Link>
      </div>
    </nav>
  );
};

export default Navbar;