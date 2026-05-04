// frontend/src/pages/MutualFundDetail.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export default function MutualFundDetail() {
  const { fundId } = useParams();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFundDetails() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/mutual-funds/${fundId}`);
        if (!response.ok) {
          throw new Error('Mutual fund details could not be loaded.');
        }
        const data = await response.json();
        setFund(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (fundId) {
      fetchFundDetails();
    }
  }, [fundId]);

  if (loading) {
    return <div className="text-center py-20">Loading fund details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Link to="/mutual-funds" className="text-blue-500 hover:underline">← Back to all funds</Link>
      </div>
    );
  }

  if (!fund) {
    return <div className="text-center py-20">Fund not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#0D1B2A] p-4">
      <main className="max-w-[1200px] mx-auto py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">{fund.name}</h1>
          <p className="text-lg text-slate-600 mt-2">{fund.amc} • {fund.category}</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Key Details */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold">Key Information</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
                <InfoCard label="Category" value={fund.category} />
                <InfoCard label="Risk" value={fund.risk} />
                <InfoCard label="Expense Ratio" value={`${fund.expense}%`} />
                <InfoCard label="Asset Management Company" value={fund.amc} />
            </div>
             <div className="flex flex-wrap gap-2 mt-4">
                {fund.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium text-teal-800 bg-teal-100 rounded-full">{tag}</span>
                ))}
            </div>
          </div>

          {/* Performance */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold">Performance</h2>
            <div className="space-y-3">
              <PerformanceRow label="1 Year Return" value={`${fund.returns['1Y']}%`} />
              <PerformanceRow label="3 Year Return" value={`${fund.returns['3Y']}%`} />
              <PerformanceRow label="5 Year Return" value={`${fund.returns['5Y']}%`} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper components for styling
const InfoCard = ({ label, value }) => (
  <div className="bg-slate-50 p-4 rounded-lg">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-xl font-semibold text-slate-800 mt-1">{value}</p>
  </div>
);

const PerformanceRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
    <p className="text-slate-600">{label}</p>
    <p className="font-bold text-lg text-green-600">{value}</p>
  </div>
);