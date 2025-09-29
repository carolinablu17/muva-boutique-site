import React, { useMemo, useState, useEffect } from "react";

/* ---------- Muva wordmark (SVG) ---------- */
function LogoMuva({ width = 160, emerald = "var(--color-emerald, #047857)", purple = "var(--color-purple, #6d28d9)" }) {
  return (
    <svg width={width} viewBox="0 0 560 120" role="img" aria-label="muva wordmark" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 102c80-28 160-28 240 0 80 28 160 28 240 0" fill="none" stroke={emerald} strokeWidth="6" strokeLinecap="round" opacity="0.35" />
      <g fill={purple}>
        <path d="M35 85V45c0-14 22-14 22 0v6c6-9 14-14 24-14 12 0 21 6 24 17 7-11 17-17 30-17 19 0 30 12 30 33v15c0 6-4 10-10 10s-10-4-10-10V68c0-10-5-16-14-16-9 0-16 7-16 19v14c0 6-5 10-11 10s-11-4-11-10V68c0-10-5-16-14-16-9 0-15 7-15 19v14c0 6-5 10-11 10s-11-4-11-10Z" />
        <path d="M226 66v19c0 6-5 10-11 10s-11-4-11-10V66c0-22 12-34 33-34s33 12 33 34v19c0 6-5 10-11 10s-11-4-11-10V66c0-10-5-16-11-16s-11 6-11 16Z" />
        <path d="M319 46l24 55c2 5-1 10-7 12-5 2-10-1-12-6l-15-36-15 36c-2 5-7 8-12 6-6-2-9-7-7-12l24-55c3-6 8-9 15-9s12 3 15 9Z" />
        <path d="M387 85V66c0-22 12-34 33-34s33 12 33 34v19c0 6-5 10-11 10s-11-4-11-10V66c0-10-5-16-11-16s-11 6-11 16v19c0 6-5 10-11 10s-11-4-11-10Z" />
        <circle cx="453" cy="42" r="4" fill={emerald} />
      </g>
    </svg>
  );
}

/* ---------- Filters hook ---------- */
function useFilters(items) {
  const [q, setQ] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const matchesQ = q ? p.name.toLowerCase().includes(q.toLowerCase()) : true;
      const matchesSize = size ? p.sizes?.some((s) => s.label === size && s.qty > 0) : true;
      const matchesColor = color ? (p.colors || []).includes(color) : true;
      return matchesQ && matchesSize && matchesColor;
    });
  }, [items, q, size, color]);

  return { filtered, q, setQ, size, setSize, color, setColor };
}

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-emerald-700 bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
    {children}
  </span>
);

function SizeChip({ label, qty }) {
  const sold = qty <= 0;
  return (
    <button
      disabled={sold}
      className={`mr-2 mb-2 rounded-xl border px-3 py-1 text-sm transition ${sold ? "opacity-40 cursor-not-allowed" : "hover:shadow"}`}
      title={sold ? "Sold out" : `Size ${label}`}
    >
      {label}
    </button>
  );
}

function ProductCard({ p, onBook }) {
  const inStock = p.sizes?.some((s) => s.qty > 0);
  const availableSizes = p.sizes?.filter((s) => s.qty > 0) || [];
  return (
    <div className="group rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-purple-300 bg-white">
      <div className="relative">
        <img src={p.image} alt={p.name} className="h-72 w-full object-cover" />
        {!inStock && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-purple-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">SOLD OUT</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-purple-800">{p.name}</h3>
          <div className="text-sm text-emerald-800">${p.price}</div>
        </div>
        <div className="mt-1 flex items-center gap-2">
          {(p.colors || []).map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}
        </div>
        <div className="mt-3">
          <div className="mb-1 text-xs uppercase tracking-wide opacity-70">Sizes available</div>
          <div className="flex flex-wrap">
            {(p.sizes || []).map((s) => (
              <SizeChip key={s.label} label={s.label} qty={s.qty} />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onBook(p)}
            className="rounded-2xl border border-emerald-700 bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800 hover:shadow"
          >
            Book a fitting
          </button>
          <span className="text-xs opacity-70">
            {inStock ? `${availableSizes.length} size${availableSizes.length > 1 ? "s" : ""} in stock` : "No restock – join waitlist via booking"}
          </span>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ open, onClose, product, calendlyUrl }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-purple-800">Book a fitting</h2>
            {product && <p className="text-sm opacity-70">for: {product.name}</p>}
          </div>
          <button onClick={onClose} className="rounded-full border px-3 py-1 text-sm">Close</button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-xl">
          {/* Replace with your actual Calendly link */}
          <iframe title="Booking" src={calendlyUrl} className="h-full w-full" frameBorder="0" />
        </div>
      </div>
    </div>
  );
}

function ContactSection() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "", _gotcha: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (form._gotcha) return;
    setStatus("submitting");
    try {
      const endpoint = "https://formspree.io/f/YOUR_FORM_ID"; // <- replace with your Formspree ID
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Network error");
      setStatus("success");
      setForm({ name: "", email: "", message: "", _gotcha: "" });
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-purple-300 bg-white/70 p-6 shadow-sm">
        <h3 className="text-2xl font-semibold text-emerald-700">Contact Us</h3>
        <p className="mt-2 text-sm opacity-80">Have a question about sizing, availability, or fittings? Send us a note.</p>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <input type="text" required placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm" />
          <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm" />
          <textarea required rows={4} placeholder="How can we help?" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="rounded-xl border px-3 py-2 text-sm" />
          <input type="text" tabIndex="-1" autoComplete="off" value={form._gotcha} onChange={(e) => setForm((f) => ({ ...f, _gotcha: e.target.value }))} className="hidden" />
          <button type="submit" disabled={status === "submitting"} className="rounded-2xl border border-purple-700 bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 hover:shadow disabled:opacity-60">
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>
          {status === "success" && <div className="rounded-xl bg-green-50 p-3 text-sm text-emerald-800">Thanks! We’ll be in touch shortly.</div>}
          {status === "error" && <div className="rounded-xl bg-red-50 p-3 text-sm">Something went wrong. Please try again.</div>}
        </form>
      </div>
    </section>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}catalog.json`;
    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Using fallback catalog. Upload /public/catalog.json to control inventory.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { filtered, q, setQ, size, setSize, color, setColor } = useFilters(items);
  const allSizes = Array.from(new Set(items.flatMap((p) => (p.sizes || []).map((s) => s.label))));
  const allColors = Array.from(new Set(items.flatMap((p) => p.colors || [])));

  const calendlyUrl = "https://calendly.com/your-org/30min?hide_gdpr_banner=1"; // replace when ready

  return (
    <div className="min-h-screen bg-gradient-to-b from-[--color-emerald] via-white to-[--color-purple]">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
          <LogoMuva width={160} />
          <nav className="flex items-center gap-4 text-sm">
            <a href="#catalog" className="hover:underline">Dresses</a>
            <a href="#policies" className="hover:underline">Policies</a>
            <a href="#contact" className="hover:underline">Contact</a>
            <button onClick={() => { setSelected(null); setModalOpen(true); }} className="rounded-2xl border border-purple-700 px-3 py-1.5 hover:shadow">
              Book now
            </button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-purple-900">Fun & elegant looks for unforgettable moments</h2>
            <p className="mt-3 text-base opacity-80">Limited sizes. No restocks. When it’s gone, it’s gone.</p>
            <div className="mt-5 flex gap-3">
              <a href="#catalog" className="rounded-2xl border px-4 py-2 hover:shadow">Shop dresses</a>
              <button onClick={() => setModalOpen(true)} className="rounded-2xl border px-4 py-2 hover:shadow">Book a fitting</button>
            </div>
            {error && <div className="mt-4 text-xs text-red-700">{error}</div>}
          </div>
          <div className="overflow-hidden rounded-2xl shadow">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop"
              alt="Muva Boutique"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border bg-white/60 p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search styles" className="rounded-xl border px-3 py-2 text-sm" />
            <select value={size} onChange={(e) => setSize(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
              <option value="">All sizes</option>
              {allSizes.map((s) => (
                <option key={s} value={s}>Size {s}</option>
              ))}
            </select>
            <select value={color} onChange={(e) => setColor(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
              <option value="">All colors</option>
              {allColors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="rounded-2xl border bg-white/60 p-6 text-center text-sm">Loading dresses…</div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} onBook={(prod) => { setSelected(prod); setModalOpen(true); }} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="mt-8 rounded-2xl border bg-white/60 p-6 text-center text-sm opacity-70">No dresses match your filters.</div>
            )}
          </>
        )}
      </section>

      <section id="policies" className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-emerald-300 bg-white/70 p-6 shadow-sm">
          <h3 className="text-2xl font-semibold text-purple-700">Boutique Policies</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-emerald-900">
            <li>Appointments required. Please arrive on time.</li>
            <li>Sizing & alterations guidance offered; tailoring not included.</li>
            <li>Final sale; exchanges within 7 days if unworn with tags.</li>
            <li>No restocks: once sold out, it’s gone.</li>
            <li>Payment: all major cards, sales tax applies.</li>
            <li>Please cancel/reschedule appointments 24 hours in advance.</li>
          </ul>
        </div>
      </section>

      <ContactSection />

      <footer className="mt-12 border-t bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="opacity-70">© {new Date().getFullYear()} muva boutique</div>
            <div className="flex gap-4">
              <a href="#catalog" className="hover:underline">Dresses</a>
              <a href="#policies" className="hover:underline">Policies</a>
              <a href="#contact" className="hover:underline">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} product={selected} calendlyUrl={calendlyUrl} />
    </div>
  );
}