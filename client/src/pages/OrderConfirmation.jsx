import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setError("Could not find this order.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="mx-auto max-w-7xl px-5 py-16 text-tomato">{error}</p>;

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 lg:py-20">
      <section className="overflow-hidden rounded-[1.75rem] border border-line bg-paper shadow-[0_18px_55px_rgba(52,39,29,0.08)]">
        <div className="bg-ink px-6 py-10 text-center text-white sm:px-12"><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-tomato text-3xl shadow-[0_5px_0_#bc3827]">✓</div><p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#f7b5a9]">// order received</p><h1 className="text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl">That’s a wrap.</h1><p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/60">Your pizza is being prepared with care. We’ll get it moving soon.</p></div>
        <div className="p-6 sm:p-10"><div className="mb-8 grid gap-4 border-b border-line pb-6 sm:grid-cols-2"><div><p className="font-mono text-[10px] uppercase tracking-widest text-muted">Order ID</p><p className="mt-1 truncate font-mono text-xs text-ink">{order._id}</p></div><div className="sm:text-right"><p className="font-mono text-[10px] uppercase tracking-widest text-muted">Status</p><p className="mt-1 text-sm font-extrabold capitalize text-sage">{order.status}</p></div></div><h2 className="mb-4 text-lg font-extrabold text-ink">Order summary</h2>
        <div className="space-y-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between gap-4 text-sm text-muted">
            <span>{item.name} <b className="font-mono text-xs text-ink">×{item.quantity}</b></span><span className="font-mono text-ink">₹{item.itemTotal}</span>
          </div>
        ))}
        </div><div className="mt-6 flex justify-between border-t border-line pt-5 text-base font-extrabold text-ink"><span>Total</span><span className="font-mono text-tomato">₹{order.grandTotal}</span></div><div className="mt-8 rounded-xl bg-cream p-4"><p className="font-mono text-[10px] uppercase tracking-widest text-muted">Delivering to</p><p className="mt-2 text-sm font-semibold leading-6 text-ink">{order.address}<br />{order.city} · {order.pincode}</p></div><Link to="/" className="mt-6 block w-full rounded-xl bg-tomato px-5 py-3.5 text-center text-sm font-extrabold text-white transition hover:bg-[#f0644d]">Back to home →</Link></div>
      </section>
    </main>
  );
};

export default OrderConfirmation;