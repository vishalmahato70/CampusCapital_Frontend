import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflation, setInflation] = useState(6);

  const years = retirementAge - currentAge;
  const months = years * 12;

  // FV formula for SIP: FV = P * [ ( (1+r)^n - 1 ) / r ] * (1+r)
  const monthlyRate = expectedReturn / 100 / 12;
  const futureValue =
    monthlyInvestment *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate));

  // Adjust corpus for inflation (real value at today's prices)
  const realValue =
    futureValue / Math.pow(1 + inflation / 100, years);

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[800px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          Retirement Calculator
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Current Age
              </label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Retirement Age
              </label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Monthly Investment (₹)
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Expected Return (% p.a.)
              </label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Inflation (% p.a.)
              </label>
              <input
                type="number"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          {/* Results */}
          <div className="bg-neutral-100 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">Results</h2>
            <p className="text-lg">
              Retirement Corpus (Future Value):{" "}
              <span className="font-medium text-neutral-700">
                ₹{futureValue.toFixed(0).toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              Value at Today's Prices (Inflation Adjusted):{" "}
              <span className="font-bold text-secondary">
                ₹{realValue.toFixed(0).toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-neutral-600 mt-2">
              (Assuming compounding and inflation adjustment till retirement)
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RetirementCalculator;
