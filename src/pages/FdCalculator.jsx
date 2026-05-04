
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

const FdCalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(7);

  const data = [];
  let amount = principal;

  for (let i = 1; i <= years; i++) {
    amount = amount * (1 + rate / 100); // Compounded yearly
    data.push({
      year: i,
      value: Math.round(amount),
    });
  }

  const maturityValue = data[data.length - 1]?.value || principal;
  const totalInterest = maturityValue - principal;

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
     

      <main className="flex-1 max-w-[900px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary mb-6">
          FD Calculator
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Principal (₹)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
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
              Maturity Value:{" "}
              <span className="font-bold text-green-600">
                ₹{maturityValue.toLocaleString()}
              </span>
            </p>
            <p className="text-lg">
              Total Interest:{" "}
              <span className="font-medium text-secondary">
                ₹{totalInterest.toLocaleString()}
              </span>
            </p>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: "Years", position: "insideBottom", offset: -5 }}
                />
                <YAxis />
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4ECDC4"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default FdCalculator;
