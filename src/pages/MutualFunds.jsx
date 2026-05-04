// frontend/src/pages/MutualFunds.jsx

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export default function MutualFundsPage() {
  // Data state management
  const [allFunds, setAllFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // UI filters
  const FILTER_PILLS = ["ELSS", "Large Cap", "Mid Cap", "Index Fund", "Debt", "Hybrid"];
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [selected, setSelected] = useState([]);

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchFunds() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/mutual-funds`);
        if (!response.ok) {
          throw new Error('Failed to fetch mutual funds');
        }
        const data = await response.json();
        setAllFunds(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFunds();
  }, []);

  const toggleTag = (tag) => {
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allFunds.filter((f) => {
      const blob = [f.name, f.amc, f.category, f.risk, ...(f.tags || []), `expense ${f.expense}`, `1y ${f.returns["1Y"]}`, `3y ${f.returns["3Y"]}`, `5y ${f.returns["5Y"]}`].join(" ").toLowerCase();
      const matchesQuery = !q || blob.includes(q);
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => f.tags?.map((x) => x.toLowerCase()).includes(t.toLowerCase()));
      return matchesQuery && matchesTags;
    });
    return list;
  }, [query, activeTags, allFunds]);

  const onCompare = () => {
    const query = new URLSearchParams({ ids: selected.join(',') }).toString();
    navigate(`/mutual-funds/compare?${query}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#0D1B2A] inter">
      {/* Hero Section */}
      <section className="safe-area mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="py-10 space-y-6">
          <h2 className="text-3xl font-semibold">Explore Mutual Funds</h2>
          <p className="text-slate-600 max-w-2xl">
            Compare performance, expense ratios, and risks of different mutual funds to make informed investment choices.
          </p>
          <div className="space-y-3">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search funds by name, category, or AMC..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A7A7]" />
            <div className="flex flex-wrap gap-2">
              {FILTER_PILLS.map((pill) => {
                const active = activeTags.includes(pill);
                return (
                  <button key={pill} onClick={() => toggleTag(pill)} className={`px-3 py-1.5 rounded-full text-sm border ${active ? "bg-[#E8F6F6] text-[#00A7A7] border-[#00A7A7]" : "bg-[#F9F5F3] text-slate-700 border-slate-200 hover:border-slate-300"}`}>
                    {pill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Funds Grid */}
      <section className="safe-area mx-auto" style={{ maxWidth: "1200px" }}>
        {loading && <div className="p-6 text-slate-600">Loading funds...</div>}
        {error && <div className="p-6 text-rose-600">Error: {error}</div>}
        {!loading && !error && (
          filtered.length === 0 ? (
            <div className="p-6 text-slate-600">No funds match the current filters.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((f) => {
                const isSelected = selected.includes(f.id);
                return (
                  <div key={f.id} className="rounded-xl border border-slate-100 p-5 bg-white" style={{ boxShadow: "0 6px 16px rgba(2,8,23,0.08)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold">{f.name}</div>
                        <div className="mt-1 text-sm text-slate-600 tnum">
                          1Y {f.returns["1Y"]}% • 3Y {f.returns["3Y"]}% • 5Y {f.returns["5Y"]}% • Expense {f.expense}% • Risk {f.risk}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{f.amc} • {f.category}</div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#FEF3E6] text-[#F4A261]">
                        Fund
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={() => toggleSelect(f.id)} className={`px-4 py-2 rounded-xl border transition-colors ${isSelected ? "border-[#00A7A7] text-[#00A7A7] bg-[#E8F6F6]" : "border-slate-200 hover:border-slate-300"}`}>
                        {isSelected ? "Added" : "Add to Compare"}
                      </button>
                      <Link
                        to={`/mutual-funds/${f.id}`}
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
        <div className="mx-auto flex items-center justify-between px-4 py-3" style={{ maxWidth: "1200px" }}>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600 tnum">{selected.length}/4 selected</div>
            <div className="hidden md:flex items-center gap-2">
              {selected.map((id) => {
                const fund = allFunds.find((x) => x.id === id);
                if (!fund) return null;
                return (
                  <span key={id} className="px-2 py-1 rounded-md text-xs border border-slate-200 bg-white text-slate-700">
                    {fund.name}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (<button onClick={() => setSelected([])} className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm">Clear</button>)}
            <button disabled={selected.length < 2} onClick={onCompare} className={`px-4 py-2 rounded-xl ${selected.length < 2 ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-[#00A7A7] text-white hover:bg-[#009090]"}`}>
              Compare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}