const PizzaCard = ({ pizza, onAdd }) => {
  return (
    <article className="group overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_12px_35px_rgba(52,39,29,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(52,39,29,0.12)]">
      <div className="relative aspect-[1.18] overflow-hidden bg-[#e8d4c4]">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={pizza.image} alt={pizza.name} />
      </div>
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div><h3 className="text-lg font-extrabold tracking-tight text-ink">{pizza.name}</h3><p className="mt-1 text-sm leading-5 text-muted">{pizza.description}</p></div>
          <span className="shrink-0 font-mono text-sm font-medium text-tomato">₹{pizza.basePrice}</span>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-tomato" onClick={onAdd}>
          Add to order <span className="text-lg leading-none">+</span>
        </button>
      </div>
    </article>
  );
};

export default PizzaCard;