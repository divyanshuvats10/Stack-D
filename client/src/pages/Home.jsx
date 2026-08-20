import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-24 lg:pt-20">
        <div className="relative z-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-tomato">// made for your kind of hungry</p>
          <h1 className="max-w-xl text-6xl font-extrabold leading-[0.94] tracking-[-0.07em] text-ink sm:text-7xl lg:text-[6.4rem]">Hot.<br /><span className="text-tomato">Fresh.</span><br />Yours.</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted">Big flavor, zero compromise. Pick a house favorite or stack your perfect pizza from the base up.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/order" className="rounded-xl bg-tomato px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_5px_0_#bc3827] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#bc3827]">Explore the menu <span className="ml-2">→</span></Link>
            <Link to="/build" className="rounded-xl border border-line bg-paper px-6 py-3.5 text-sm font-extrabold text-ink transition hover:border-ink">Build your own</Link>
          </div>
          <div className="mt-12 flex gap-8 border-t border-line pt-5 font-mono text-[10px] uppercase tracking-widest text-muted"><span><b className="block text-lg text-ink">30 min</b> avg. delivery</span><span><b className="block text-lg text-ink">100%</b> real cheese</span></div>
        </div>
        <div className="relative min-h-[380px] lg:min-h-[560px]">
          <div className="absolute right-0 top-0 h-full w-[90%] rounded-[2rem] bg-[#e5c7b1]" />
          <img className="absolute inset-5 h-[calc(100%-2.5rem)] w-[calc(100%-2.5rem)] rounded-[1.5rem] object-cover shadow-2xl lg:inset-10 lg:h-[calc(100%-5rem)] lg:w-[calc(100%-5rem)]" src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1100&q=85" alt="Fresh pizza with basil and tomato" />
          <div className="absolute bottom-5 left-0 rounded-2xl bg-ink px-5 py-4 text-white shadow-xl lg:bottom-16"><p className="font-mono text-[10px] uppercase tracking-widest text-[#f7b5a9]">Stack'd pick</p><p className="mt-1 font-bold">The Pepperoni Feast</p></div>
        </div>
      </section>
      <section className="border-y border-line bg-paper"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 lg:px-8"><p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">What are you in the mood for?</p><div className="flex gap-2 text-sm font-bold"><Link className="rounded-full bg-[#fbe5df] px-4 py-2 text-tomato" to="/order">Classic favorites</Link><Link className="rounded-full border border-line px-4 py-2 hover:border-tomato" to="/build">Make it yours →</Link></div></div></section>
    </main>
  );
};

export default Home;