import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

const TaxCalculator = () => {
  const [income, setIncome] = useState(800000);
  const [age, setAge] = useState("below60");
  const [regime, setRegime] = useState("new");

  // Old regime slabs (below 60)
  const calculateOldRegime = (inc) => {
    let tax = 0;
    if (age === "below60") {
      if (inc <= 250000) tax = 0;
      else if (inc <= 500000) tax = (inc - 250000) * 0.05;
      else if (inc <= 1000000)
        tax = 12500 + (inc - 500000) * 0.2;
      else tax = 112500 + (inc - 1000000) * 0.3;
    }
    if (age === "60to80") {
      if (inc <= 300000) tax = 0;
      else if (inc <= 500000) tax = (inc - 300000) * 0.05;
      else if (inc <= 1000000)
        tax = 10000 + (inc - 500000) * 0.2;
      else tax = 110000 + (inc - 1000000) * 0.3;
    }
    if (age === "80plus") {
      if (inc <= 500000) tax = 0;
      else if (inc <= 1000000) tax = (inc - 500000) * 0.2;
      else tax = 100000 + (inc - 1000000) * 0.3;
    }
    return tax;
  };

  // New regime slabs (FY 2023-24 simplified)
  const calculateNewRegime = (inc) => {
    let tax = 0;
    if (inc <= 300000) tax = 0;
    else if (inc <= 600000) tax = (inc - 300000) * 0.05;
    else if (inc <= 900000) tax = 15000 + (inc - 600000) * 0.1;
    else if (inc <= 1200000) tax = 45000 + (inc - 900000) * 0.15;
    else if (inc <= 1500000) tax = 90000 + (inc - 1200000) * 0.2;
    else tax = 150000 + (inc - 1500000) * 0.3;
    return tax;
  };

  let tax = regime === "old" ? calculateOldRegime(income) : calculateNewRegime(income);

  // Rebate u/s 87A: Income up to ₹7L in new regime => no tax
  if (regime === "new" && income <= 700000) tax = 0;

  // Add 4% cess
  let cess = tax * 0.04;
  let totalTax = tax + cess;

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[800px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          Income Tax Calculator
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
          {/* Income */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Annual Income (₹)
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Age Group
            </label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            >
              <option value="below60">Below 60 years</option>
              <option value="60to80">60–80 years</option>
              <option value="80plus">80+ years</option>
            </select>
          </div>

          {/* Regime */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tax Regime
            </label>
            <select
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            >
              <option value="new">New Regime</option>
              <option value="old">Old Regime</option>
            </select>
          </div>

          {/* Results */}
          <div className="bg-neutral-100 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">Results</h2>
            <p className="text-lg">
              Tax Before Cess:{" "}
              <span className="font-medium text-neutral-700">
                ₹{tax.toFixed(0).toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              Health & Edu Cess (4%):{" "}
              <span className="font-medium text-neutral-700">
                ₹{cess.toFixed(0).toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              <span className="font-bold text-secondary">
                Total Tax Payable: ₹{totalTax.toFixed(0).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TaxCalculator;
