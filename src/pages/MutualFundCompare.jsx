import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export default function MutualFundCompare() {
  const [searchParams] = useSearchParams();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      const idArray = ids.split(',');
      fetchCompareFunds(idArray);
    } else {
      setLoading(false);
      setError("No funds selected for comparison.");
    }

    async function fetchCompareFunds(idArray) {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/mutual-funds/compare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: idArray }),
        });
        if (!response.ok) throw new Error('Could not fetch fund details.');
        const data = await response.json();
        setFunds(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
        <Header />
        <div className="text-center py-20 flex-grow">Loading comparison...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 text-center py-20">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Link to="/mutual-funds" className="text-blue-500 hover:underline">← Go back to select funds</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const features = [
    { label: 'Category', key: 'category' },
    { label: 'Risk', key: 'risk' },
    { label: 'Expense Ratio', key: 'expense', suffix: '%' },
    { label: '1Y Return', key: 'returns.1Y', suffix: '%' },
    { label: '3Y Return', key: 'returns.3Y', suffix: '%' },
    { label: '5Y Return', key: 'returns.5Y', suffix: '%' },
  ];

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1200px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary mb-6">Compare Mutual Funds</h1>
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full border-collapse">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-neutral-700">Features</th>
                {funds.map((fund) => (
                  <th key={fund.id} className="px-6 py-4 text-center font-semibold text-primary">
                    {fund.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr className="border-t" key={feature.key}>
                  <td className="px-6 py-4 font-medium text-neutral-700">{feature.label}</td>
                  {funds.map((fund) => (
                    <td key={fund.id} className="px-6 py-4 text-center">
                      {/* Helper to get nested values like 'returns.1Y' */}
                      {getNestedValue(fund, feature.key) || 'N/A'}
                      {feature.suffix || ''}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t bg-neutral-50">
                <td className="px-6 py-4"></td>
                {funds.map((fund) => (
                  <td key={fund.id} className="px-6 py-4 text-center">
                    <button className="bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition">
                      Invest Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Helper function to access nested object properties
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}