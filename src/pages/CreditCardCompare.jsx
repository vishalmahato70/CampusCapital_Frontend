// frontend/src/pages/CreditCardCompare.jsx

import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export default function CreditCardCompare() {
  const [searchParams] = useSearchParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      const idArray = ids.split(",");
      fetchCompareCards(idArray);
    } else {
      setLoading(false);
      setError("No cards selected for comparison.");
    }

    async function fetchCompareCards(idArray) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/credit-cards/compare`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: idArray }),
        });
        if (!response.ok) {
          throw new Error("Could not fetch card details.");
        }
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [searchParams]);

  if (loading) {
    return <div className="text-center py-20">Loading comparison...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Link to="/credit-cards" className="text-blue-500 hover:underline">
          ← Go back to select cards
        </Link>
      </div>
    );
  }

  const features = [
    { key: "annualFee", label: "Annual Fee" },
    { key: "apr", label: "APR" },
    { key: "rewards", label: "Rewards" },
    { key: "perks", label: "Perks" },
    { key: "bestFor", label: "Best For" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#0D1B2A] inter">


      {/* Hero Section */}
      <section className="safe-area mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="py-10">
          <h2 className="text-3xl font-semibold mb-2">Compare Credit Cards</h2>
          <p className="text-slate-600">
            Review fees, APRs, rewards, and perks side by side to choose the best card for you.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="safe-area mx-auto overflow-x-auto" style={{ maxWidth: "1200px" }}>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-left text-sm text-slate-600">
              <th className="p-4 font-medium w-48">Feature</th>
              {cards.map((card) => (
                <th key={card.id} className="p-4 font-semibold text-[#0D1B2A]">
                  {card.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm tnum">
            {features.map((feature) => (
              <tr key={feature.key} className="border-t border-slate-200">
                <td className="p-4 font-medium">{feature.label}</td>
                {cards.map((card) => (
                  <td key={card.id + feature.key} className="p-4">
                    {feature.key === "annualFee"
                      ? `₹${card.annualFee}`
                      : card[feature.key] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}

            {/* Apply Button Row */}
            <tr className="border-t border-slate-200 bg-slate-50">
              <td className="p-4"></td>
              {cards.map((card) => (
                <td key={card.id + "-apply"} className="p-4">
                  <button className="px-4 py-2 rounded-xl bg-[#00A7A7] text-white hover:bg-[#008c8c] transition">
                    Apply
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
