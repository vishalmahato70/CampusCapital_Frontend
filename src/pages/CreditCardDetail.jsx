
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import BASE_URL from "../utils/api";

export default function CreditCardDetailPage() {
  const { cardId } = useParams(); // yeh URL se cardId lega
  const [card, setCard] = useState(null);
  const [selected, setSelected] = useState([]);
  const maxCompare = 4;

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/credit-cards/${cardId}`);
        if (!res.ok) throw new Error("Card not found");
        const data = await res.json();
        setCard(data);
        setSelected([data._id]); // preselect
      } catch (err) {
        console.error(err);
      }
    };
    fetchCard();
  }, [cardId]);

  if (!card) return <div className="p-10 text-center">Loading...</div>;

  const isSelected = selected.includes(card._id);

  const toggleCompare = () => {
    setSelected((prev) => {
      if (prev.includes(card._id)) return prev.filter((x) => x !== card._id);
      if (prev.length >= maxCompare) return prev; // cap
      return [...prev, card._id];
    });
  };

  const onApply = () => {
    alert(`Apply for ${card.name}`);
  };

  const onCompare = () => {
    alert(`Compare: ${selected.join(", ")}`);
  };




  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#0D1B2A] inter">


      {/* Card Hero */}
      <section className="safe-area mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="py-10 grid md:grid-cols-3 gap-8">
          {/* Card image placeholder */}
          <div className="md:col-span-1">
            <div className="w-full aspect-[4/2.5] bg-gradient-to-br from-[#0D1B2A] to-[#172A3A] rounded-2xl flex items-center justify-center text-white font-semibold text-xl">
              {card.shortName}
            </div>
          </div>

          {/* Card details */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-3xl font-semibold">{card.name}</h2>
            <p className="text-slate-600 max-w-2xl">{card.description}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="text-sm text-slate-500">Annual Fee</div>
                <div className="mt-1 text-lg font-semibold tnum">₹{card.annualFee}</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="text-sm text-slate-500">APR</div>
                <div className="mt-1 text-lg font-semibold tnum">{card.apr}%</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="text-sm text-slate-500">Rewards</div>
                <div className="mt-1 text-lg font-semibold">{card.rewards}</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="text-sm text-slate-500">Lounge Access</div>
                <div className="mt-1 text-lg font-semibold">{card.lounge}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onApply}
                className="px-5 py-3 rounded-xl bg-[#00A7A7] text-white hover:bg-[#009090] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A7A7]/30"
              >
                Apply Now
              </button>
              <button
                onClick={toggleCompare}
                aria-pressed={isSelected}
                className={`px-5 py-3 rounded-xl border transition-colors ${
                  isSelected
                    ? "border-[#00A7A7] text-[#00A7A7] bg-[#E8F6F6]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {isSelected ? "Added to Compare" : "Add to Compare"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Features */}
      <section className="safe-area mx-auto mt-8" style={{ maxWidth: "1200px" }}>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white border border-slate-100 shadow-sm rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              {card.keyBenefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-white border border-slate-100 shadow-sm rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Eligibility & Fees</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              {card.fees.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="safe-area mx-auto mt-10" style={{ maxWidth: "1200px" }}>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">User Reviews</h3>
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <div className="font-medium">Rahul S.</div>
              <div className="text-sm text-slate-600">
                Great rewards for online shopping, got good cashback on Amazon purchases.
              </div>
            </div>
            <div className="border-b border-slate-100 pb-4">
              <div className="font-medium">Neha P.</div>
              <div className="text-sm text-slate-600">
                Lounge access is limited but useful for frequent travelers.
              </div>
            </div>
            <div>
              <div className="font-medium">Amit K.</div>
              <div className="text-sm text-slate-600">Annual fee is justified if you maximize rewards.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Tray */}
      <div className="fixed bottom-0 left-0 w-full border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto safe-area flex items-center justify-between" style={{ maxWidth: "1200px" }}>
          <div className="text-sm text-slate-600 tnum">{selected.length}/{maxCompare} selected</div>
          <button
            onClick={onCompare}
            disabled={selected.length < 2}
            className={`px-4 py-2 rounded-xl ${
              selected.length < 2 ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-[#00A7A7] text-white hover:bg-[#009090]"
            }`}
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
}
