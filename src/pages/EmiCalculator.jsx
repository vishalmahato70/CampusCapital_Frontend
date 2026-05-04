
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(10);

  const months = years * 12;
  const monthlyRate = rate / 12 / 100;

  // EMI formula
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  // Amortization data
  let balance = loanAmount;
  const data = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principal = emi - interest;
    balance -= principal;

    data.push({
      month: i,
      Interest: Math.round(interest),
      Principal: Math.round(principal),
    });
  }

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-[900px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          EMI Calculator
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Loan Amount (₹)
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-secondary"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Interest Rate (% per year)
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
              Monthly EMI:{" "}
              <span className="font-bold text-secondary">
                ₹{emi.toFixed(0).toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              Total Interest:{" "}
              <span className="font-medium text-red-500">
                ₹{totalInterest.toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              Total Payment:{" "}
              <span className="font-medium text-green-600">
                ₹{totalPayment.toLocaleString()}
              </span>
            </p>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  label={{ value: "Months", position: "insideBottom", offset: -5 }}
                />
                <YAxis />
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="Principal" stackId="a" fill="#4ECDC4" />
                <Bar dataKey="Interest" stackId="a" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmiCalculator;
