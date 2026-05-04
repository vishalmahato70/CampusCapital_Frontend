// frontend/src/pages/CreditCards.jsx

import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate } from 'react-router-dom';

// API URL (aapke SigninPage se liya gaya)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export default function CreditCards() {
  // Data state management
  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // UI filters
  const availablePills = ["Zero annual fee", "Travel rewards", "Cashback", "Fuel", "Lounge access", "Shopping"];
  const [query, setQuery] = useState("");
  const [activePills, setActivePills] = useState([]);
  const [selected, setSelected] = useState([]);

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchCards() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/credit-cards`);
        if (!response.ok) {
          throw new Error('Failed to fetch credit cards');
        }
        const data = await response.json();
        setAllCards(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []); // Empty array ka matlab hai ki yeh effect sirf ek baar chalega

  const togglePill = (pill) => {
    setActivePills((prev) => prev.includes(pill) ? prev.filter((p) => p !== pill) : [...prev, pill]);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allCards.filter((c) => {
      if (!q) return true;
      const blob = [c.name, c.bank, c.rewards, ...(c.perks || []), ...(c.tags || []), ...(c.features || [])].join(" ").toLowerCase();
      return blob.includes(q);
    });

    if (activePills.length > 0) {
      list = list.filter((c) => activePills.every((p) => c.tags?.map((t) => t.toLowerCase()).includes(p.toLowerCase())));
    }

    return list;
  }, [query, activePills, allCards]);

  const onCompare = () => {
    const query = new URLSearchParams({ ids: selected.join(',') }).toString();
    navigate(`/credit-cards/compare?${query}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#0D1B2A] inter">
      {/* Hero */}
      <section className="safe-area mx-auto px-4" style={{ maxWidth: "1200px" }}>
        <div className="py-8 sm:py-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">Explore Credit Cards</h2>
          <p className="text-slate-600 max-w-2xl">
            Compare and choose the best credit card that fits your lifestyle. Filter by benefits, fees, APR, and more.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search credit cards by bank, feature, or category..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A7A7] bg-white"
            />
            <div className="flex flex-wrap gap-2">
              {availablePills.map((pill) => {
                const active = activePills.includes(pill);
                return (
                  <button key={pill} onClick={() => togglePill(pill)} className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${active ? "bg-[#E8F6F6] text-[#00A7A7] border-[#9fe3e3]" : "bg-[#F9F5F3] text-slate-700 border-slate-200 hover:border-slate-300"}`}>
                    {pill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="safe-area mx-auto px-4 pb-28" style={{ maxWidth: "1200px" }}>
        {loading && <div className="text-slate-600">Loading cards...</div>}
        {error && <div className="text-rose-600">Error: {error}</div>}
        {!loading && !error && (
          filteredCards.length === 0 ? (
            <div className="text-slate-600">No cards match the current filters.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card) => {
                const isSelected = selected.includes(card.id);
                return (
                  <div key={card.id} className="rounded-xl border border-slate-100 p-5 bg-white" style={{ boxShadow: "0 6px 16px rgba(2,8,23,0.08)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold">{card.name}</div>
                        <div className="mt-1 text-sm text-slate-600 tnum">
                          Annual fee ₹{card.annualFee} • APR {card.apr}% • Rewards {card.rewards} • {card.perks?.[0] ?? "Benefits"}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {card.tags?.slice(0, 3).map((t) => (
                            <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#E8F6F6] text-[#00A7A7]">
                        Card
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={() => toggleSelect(card.id)} className={`px-4 py-2 rounded-xl border transition-colors ${isSelected ? "border-[#00A7A7] text-[#00A7A7] bg-[#E8F6F6]" : "border-slate-200 hover:border-slate-300"}`}>
                        {isSelected ? "Added" : "Add to Compare"}
                      </button>
                      <Link
                        to={`/credit-cards/${card.id}`}
                        className="px-4 py-2 rounded-xl text-white bg-[#00A7A7] hover:bg-[#009090]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </section>

      {/* Compare Tray */}
      <div className="fixed bottom-0 left-0 w-full border-t border-slate-200 bg-white/80 backdrop-blur safe-area">
        <div className="mx-auto px-4 py-3 flex items-center justify-between" style={{ maxWidth: "1200px" }}>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600 tnum">{selected.length}/4 selected</div>
            <div className="hidden md:flex items-center gap-2">
              {selected.map((id) => {
                const card = allCards.find((c) => c.id === id);
                if (!card) return null;
                return (
                  <span key={id} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                    {card.name}
                    <button onClick={() => toggleSelect(id)} className="ml-1 text-slate-500 hover:text-slate-700" aria-label={`Remove ${card.name}`}>
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (<button onClick={() => setSelected([])} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm">Clear</button>)}
            <button onClick={onCompare} disabled={selected.length < 2} className={`px-4 py-2 rounded-xl text-sm ${selected.length < 2 ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-[#00A7A7] text-white hover:bg-[#009090]"}`}>
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}