import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/axios";
import { clearCart } from "../features/cart/cartSlice";
import { useState } from "react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  address: z.string().min(5, "Address is too short"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

const Checkout = () => {
  const items = useSelector((state) => state.cart.items);
  const grandTotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(checkoutSchema) });

  const onSubmit = async (formData) => {
    if (items.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ...formData,
        items: items.map((item) => ({
          name: item.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          customizations: item.customizations,
          itemTotal: item.itemTotal,
        })),
        grandTotal,
      };

      const res = await api.post("/orders", payload);
      dispatch(clearCart());
      navigate(`/order-confirmation/${res.data._id}`);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Failed to place order. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8"><h1 className="text-5xl font-extrabold tracking-[-0.06em] text-ink">Nothing to<br /><span className="text-tomato">check out.</span></h1>
        <button className="mt-8 rounded-xl bg-tomato px-6 py-3.5 text-sm font-extrabold text-white" onClick={() => navigate("/order")}>Browse the menu →
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16"><div className="mb-10 border-b border-line pb-8"><p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-tomato">// final step</p><h1 className="text-5xl font-extrabold tracking-[-0.06em] text-ink">Where should<br /><span className="text-tomato">we send it?</span></h1></div>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]"><form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2 lg:p-8">
        <div className="sm:col-span-2"><h3 className="text-lg font-extrabold text-ink">Delivery details</h3><p className="mt-1 text-sm text-muted">We will use these details to get your order to you.</p></div>
        <div className="sm:col-span-2"><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Full name</label><input className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none transition focus:border-tomato" {...register("customerName")} placeholder="Your name" />{errors.customerName && <span className="mt-1 block text-xs text-tomato">{errors.customerName.message}</span>}</div>
        <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Phone number</label><input className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none transition focus:border-tomato" {...register("phone")} placeholder="9876543210" />{errors.phone && <span className="mt-1 block text-xs text-tomato">{errors.phone.message}</span>}</div>
        <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Pincode</label><input className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none transition focus:border-tomato" {...register("pincode")} placeholder="123456" />{errors.pincode && <span className="mt-1 block text-xs text-tomato">{errors.pincode.message}</span>}</div>
        <div className="sm:col-span-2"><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">Address</label><input className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none transition focus:border-tomato" {...register("address")} placeholder="Street, house number" />{errors.address && <span className="mt-1 block text-xs text-tomato">{errors.address.message}</span>}</div>
        <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">City</label><input className="w-full rounded-xl border border-line bg-cream px-4 py-3 outline-none transition focus:border-tomato" {...register("city")} placeholder="Your city" />{errors.city && <span className="mt-1 block text-xs text-tomato">{errors.city.message}</span>}</div>
        {submitError && <p className="text-sm text-tomato sm:col-span-2">{submitError}</p>}
        <button type="submit" className="rounded-xl bg-tomato px-5 py-3.5 text-sm font-extrabold text-white hover:bg-[#f0644d] disabled:opacity-50 sm:col-span-2" disabled={submitting}>{submitting ? "Placing order..." : `Place order · ₹${grandTotal}`}</button>
      </form>
      <aside className="rounded-[1.5rem] bg-ink p-6 text-white lg:sticky lg:top-24"><h3 className="mb-6 text-lg font-extrabold">Your order</h3>
        {items.map((item) => (
          <div key={item.cartItemId} className="mb-4 flex justify-between gap-4 text-sm text-white/60"><span>{item.name} <b className="text-white/40">×{item.quantity}</b></span><span className="font-mono text-white">₹{item.itemTotal}</span></div>
        ))}
        <div className="mt-6 flex justify-between border-t border-white/10 pt-5"><span className="text-sm text-white/60">Total</span><span className="font-mono text-2xl">₹{grandTotal}</span></div></aside></div>
    </main>
  );
};

export default Checkout;