import React, { useMemo, useState, useEffect } from "react";

/* ========== Wordmark ========== */
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

/* ========== Utilities ========== */
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

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-purple-200/60 bg-white/70 p-6 shadow-sm backdrop-blur ${className}`}>{children}</div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-emerald-700 bg-emerald-100 px-2 py-0.5 text-xs font-medium text-[--color-emerald-ink]">
    {children}
  </span>
);

function SizeChip({ label, qty }) {
  const sold = qty <= 0;
  return (
    <button
      disabled={sold}
      className={`mr-2 mb-2 rounded-xl border px-3 py-1 text-sm transition
        ${sold ? "opacity-40 cursor-not-allowed" : "hover:shadow border-purple-300 text-[--color-purple-ink]"}
      `}
      aria-disabled={sold}
      aria-label={sold ? `Size ${label} sold out` : `Select size ${label}`}
      title={sold ? "Sold out" : `Size ${label}`}
    >
      {label}
    </button>
  );
}

/* ========== Product Card ========== */
function ProductCard({ p, onBook }) {
  const inStock = p.sizes?.some((s) => s.qty > 0);
  const availableSizes = p.sizes?.filter((s) => s.qty > 0) || [];
  return (
    <div className="group overflow-hidden rounded-2xl border border-purple-300 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative">
        <img src={p.image} alt={p.name} className="h-72 w-full object-cover" loading="lazy" />
        {!inStock && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-purple-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">SOLD OUT</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[--color-purple-ink]">{p.name}</h3>
          <div className="text-base font-semibold text-[--color-emerald-ink]">${p.price}</div>
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
            className="rounded-2xl border border-emerald-700 bg-emerald-100 px-4 py-2 text-sm font-medium text-[--color-emerald-ink] transition hover:shadow"
          >
            Book a fitting
          </button>
          <span className="text-xs opacity-70">
            {inStock ? `${availableSizes.length} size${availableSizes.length > 1 ? "s" : ""} in stock` : "No restock — join waitlist via booking"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ========== Booking Modal ========== */
function BookingModal({ open, onClose, product, calendlyUrl }) {
  if (!open) return null;
  const hasCalendly = !!calendlyUrl;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[--color-purple-ink]">Book a fitting</h2>
            {product && <p className="text-sm opacity-70">for: {product.name}</p>}
          </div>
          <button onClick={onClose} className="rounded-full border px-3 py-1 text-sm">Close</button>
        </div>

        {product && (
          <div className="mb-3 flex items-center gap-3">
            <img src={product.image} alt={product.name} className="h-12 w-12 rounded object-cover" />
            <div className="text-sm text-[--color-purple-ink]">{product.name}</div>
          </div>
        )}

        {hasCalendly ? (
          <>
            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe title="Booking" src={calendlyUrl} className="h-full w-full" frameBorder="0" />
            </div>
            <a href={calendlyUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-2xl bg-purple-700 px-4 py-2 text-white font-semibold">
              Open Calendly
            </a>
          </>
        ) : (
          <div className="rounded-xl border border-purple-200 bg-white/70 p-4 text-sm text-[--color-purple-ink]">
            Add your Calendly link in <code>public/settings.json</code> to enable booking.
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== Contact ========== */
function ContactSection({ formspreeId }) {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "", _gotcha: "" });
  const enabled = !!formspreeId;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!enabled) return;
    if (form._gotcha) return;
    setStatus("submitting");
    try {
      const endpoint = `https://formspree.io/f/${formspreeId}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Network error");
      setStatus("success");
      setForm({ name: "", email: "", message: "", _gotcha: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-4xl px-4 py-10">
      <Card>
        <h3 className="text-2xl font-semibold text-[--color-emerald-ink]">Contact Us</h3>
        <p className="mt-2 text-sm text-[--color-purple-ink]/80">
          Have a question about sizing, availability, or fittings? Send us a note.
        </p>

        {!enabled && (
          <div className="mt-3 rounded-xl border border-purple-200 bg-white/70 p-3 text-sm text-[--color-purple-ink]">
            Add your Formspree ID in <code>public/settings.json</code> to enable this form.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3" aria-disabled={!enabled}>
          <input
            type="text"
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-xl border px-3 py-2 text-sm"
            disabled={!enabled}
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="rounded-xl border px-3 py-2 text-sm"
            disabled={!enabled}
          />
          <textarea
            required
            rows={4}
            placeholder="How can we help?"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="rounded-xl border px-3 py-2 text-sm"
            disabled={!enabled}
          />
          <input type="text" tabIndex="-1" autoComplete="off" value={form._gotcha} onChange={(e) => setForm((f) => ({ ...f, _gotcha: e.target.value }))} className="hidden" />
          <button
            type="submit"
            disabled={!enabled || status === "submitting"}
            className="rounded-2xl border border-purple-700 bg-purple-100 px-4 py-2 text-sm font-medium text-[--color-purple-ink] hover:shadow disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>
          {status === "success" && <div className="rounded-xl bg-green-50 p-3 text-sm text-[--color-emerald-ink]">Thanks! We’ll be in touch shortly.</div>}
          {status === "error" && <div className="rounded-xl bg-red-50 p-3 text-sm">Something went wrong. Please try again.</div>}
        </form>
      </Card>
    </section>
  );
}

/* ========== Page ========== */
export default function App() {
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({ calendlyUrl: "", formspreeId: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Load both catalog and settings.json at runtime (no-code updates)
  useEffect(() => {
    const base = import.meta.env.BASE_URL || "/";
    const catalogURL = `${base}catalog.json`;
    const settingsURL = `${base}settings.json?ts=${Date.now()}`; // bypass cache when you edit

    (async () => {
      try {
        const [catRes, setRes] = await Promise.all([
          fetch(catalogURL, { cache: "no-store" }),
          fetch(settingsURL, { cache: "no-store" })
        ]);

        if (!catRes.ok) throw new Error(`catalog HTTP ${catRes.status}`);
        const data = await catRes.json();
        setItems(Array.isArray(data) ? data : []);

        if (setRes.ok) {
          const conf = await setRes.json();
          setSettings({
            calendlyUrl: typeof conf.calendlyUrl === "string" ? conf.calendlyUrl : "",
            formspreeId: typeof conf.formspreeId === "string" ? conf.formspreeId : ""
          });
        } else {
          setSettings({ calendlyUrl: "", formspreeId: "" });
        }
      } catch {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[--color-emerald] via-white to-[--color-purple]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <LogoMuva width={160} />
          <nav className="flex items-center gap-5 text-sm font-medium text-[--color-purple-ink]">
            <a className="hover:underline underline-offset-4" href="#catalog">Dresses</a>
            <a className="hover:underline underline-offset-4" href="#policies">Policies</a>
            <a className="hover:underline underline-offset-4" href="#contact">Contact</a>
            <button
              onClick={() => { setSelected(null); setModalOpen(true); }}
              className="rounded-2xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
            >
              Book now
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[--color-purple-ink]">
              Fun & elegant looks for unforgettable moments
            </h2>
            <p className="mt-4 max-w-prose text-base md:text-lg text-[--color-purple-ink]/80">
              Limited sizes. No restocks. When it’s gone, it’s gone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#catalog" className="rounded-2xl border border-purple-700/30 bg-white/70 px-5 py-2.5 text-sm font-medium text-[--color-purple-ink] transition hover:shadow">
                Shop dresses
              </a>
              <button onClick={() => setModalOpen(true)} className="rounded-2xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow">
                Book a fitting
              </button>
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

      {/* Filters */}
      <section className="mx-auto max-w-6xl px-4">
        <Card>
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
        </Card>
      </section>

      {/* Catalog */}
      <section id="catalog" className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <Card className="text-center text-sm">Loading dresses…</Card>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} onBook={(prod) => { setSelected(prod); setModalOpen(true); }} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="mt-8 rounded-2xl border border-purple-200 bg-white/70 p-8 text-center">
                <p className="font-semibold text-[--color-purple-ink]">No matches right now.</p>
                <p className="mt-2 text-sm text-[--color-purple-ink]/70">
                  Try clearing filters — or{" "}
                  <button onClick={() => setModalOpen(true)} className="underline underline-offset-4">
                    book a styling session
                  </button>.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Policies */}
      <section id="policies" className="mx-auto max-w-4xl px-4 py-10">
        <Card className="border-emerald-300">
          <h3 className="text-2xl font-semibold text-[--color-purple-ink]">Boutique Policies</h3>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-[--color-emerald-ink]">
            <li>Appointments required. Please arrive on time.</li>
            <li>Sizing & alterations guidance offered; tailoring not included.</li>
            <li>Final sale; exchanges within 7 days if unworn with tags.</li>
            <li>No restocks: once sold out, it’s gone.</li>
            <li>Payment: all major cards, sales tax applies.</li>
            <li>Please cancel/reschedule appointments 24 hours in advance.</li>
          </ul>
        </Card>
      </section>

      {/* Contact */}
      <ContactSection formspreeId={settings.formspreeId} />

      {/* Footer */}
      <footer className="mt-12 border-t bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="font-semibold text-[--color-purple-ink]">Muva Boutique</div>
              <div className="mt-2 text-[--color-purple-ink]/70">123 Market St, Suite 200 · Your City</div>
              <div className="text-[--color-purple-ink]/70">Tue–Sat 10–6</div>
            </div>
            <div>
              <div className="font-semibold text-[--color-purple-ink]">Contact</div>
              <div className="mt-2 text-[--color-purple-ink]/70">hello@shopmuva.com · (555) 123-4567</div>
            </div>
            <div>
              <div className="font-semibold text-[--color-purple-ink]">Follow</div>
              <div className="mt-2 flex gap-3 text-[--color-purple-ink]/70">
                <a href="#" className="hover:underline">Instagram</a>
                <a href="#" className="hover:underline">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking modal uses settings.calendlyUrl */}
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} product={selected} calendlyUrl={settings.calendlyUrl} />
    </div>
  );
}