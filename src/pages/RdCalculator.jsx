import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

const RdCalculator = () => {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState(4); // Quarterly default

  const months = years * 12;

  // RD formula: M = P * [(1+r/n)^(n*t) - 1] / (1 - (1+r/n)^(-1/3))
  // Simplified for Indian RD scheme (quarterly compounding)
  const r = rate / 100;
  const n = compounding;

  let maturity = 0;
  for (let i = 1; i <= months; i++) {
    maturity += monthly * Math.pow(1 + r / n, n * (i / 12));
  }

  const totalDeposit = monthly * months;
  const interestEarned = maturity - totalDeposit;

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[800px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          RD Calculator
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
          {/* Monthly Deposit */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Monthly Deposit (₹)
            </label>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Tenure */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tenure (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Compounding */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Compounding Frequency
            </label>
            <select
              value={compounding}
              onChange={(e) => setCompounding(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            >
              <option value={1}>Yearly</option>
              <option value={2}>Half-Yearly</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
            </select>
          </div>

          {/* Results */}
          <div className="bg-neutral-100 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">Results</h2>
            <p className="text-lg">
              Maturity Value:{" "}
              <span className="font-bold text-secondary">
                ₹{maturity.toFixed(0).toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              Interest Earned:{" "}
              <span className="font-medium text-green-600">
                ₹{interestEarned.toFixed(0).toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              Total Deposits:{" "}
              <span className="font-medium text-neutral-700">
                ₹{totalDeposit.toFixed(0).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RdCalculator;
