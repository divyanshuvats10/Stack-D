import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>Hot, Fresh, Yours.</h1>
        <p>Order ready-made favorites or build your own from scratch.</p>
        <div className="hero-actions">
          <Link to="/order" className="btn-primary">Order Pizza</Link>
          <Link to="/build" className="btn-secondary">Build Your Own</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;