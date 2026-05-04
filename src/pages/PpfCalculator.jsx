import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

const PpfCalculator = () => {
  const [yearly, setYearly] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15); // PPF min tenure

  // PPF maturity formula: M = P * [(1+r)^n - 1] / (1 - (1+r)^(-1))
  const r = rate / 100;
  let maturity = yearly * ((Math.pow(1 + r, years) - 1) / r);

  const totalDeposit = yearly * years;
  const interestEarned = maturity - totalDeposit;

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[800px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          PPF Calculator
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
          {/* Yearly Deposit */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Yearly Investment (₹)
            </label>
            <input
              type="number"
              value={yearly}
              onChange={(e) => setYearly(Number(e.target.value))}
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
            <p className="text-xs text-neutral-500 mt-1">
              (PPF lock-in period minimum 15 years)
            </p>
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

export default PpfCalculator;
