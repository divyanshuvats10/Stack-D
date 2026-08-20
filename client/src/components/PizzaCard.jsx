const PizzaCard = ({ pizza, onAdd }) => {
  return (
    <div className="pizza-card">
      <img src={pizza.image} alt={pizza.name} />
      <h3>{pizza.name}</h3>
      <p className="desc">{pizza.description}</p>
      <div className="pizza-footer">
        <span className="price">₹{pizza.basePrice}</span>
        <button onClick={onAdd}>Add to Cart</button>
      </div>
    </div>
  );
};

export default PizzaCard;