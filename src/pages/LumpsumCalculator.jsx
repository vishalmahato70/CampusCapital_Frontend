import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LumpsumCalculator = () => {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const r = rate / 100;

  // Maturity formula
  const maturityValue = amount * Math.pow(1 + r, years);
  const wealthGained = maturityValue - amount;

  // Chart data (growth each year)
  const data = Array.from({ length: years + 1 }, (_, year) => {
    const value = amount * Math.pow(1 + r, year);
    return {
      year: year,
      value: Math.round(value),
    };
  });

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[900px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          Lumpsum Calculator
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Investment Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Investment Period (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Expected Return Rate (% per year)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Results */}
          <div className="bg-neutral-100 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">Results</h2>
            <p className="text-lg">
              Invested Amount:{" "}
              <span className="font-medium">₹{amount.toLocaleString()}</span>
            </p>
            <p className="text-lg">
              Wealth Gained:{" "}
              <span className="font-medium text-green-600">
                ₹{wealthGained.toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              Maturity Value:{" "}
              <span className="font-bold text-secondary">
                ₹{maturityValue.toLocaleString()}
              </span>
            </p>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
                <YAxis />
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FF6B6B"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LumpsumCalculator;
