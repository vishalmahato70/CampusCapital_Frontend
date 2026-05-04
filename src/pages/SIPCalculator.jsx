import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const INR0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export default function SIPCalculatorPage() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const monthlySanitized = useMemo(
    () => Math.min(Math.max(Number(monthly) || 0, 0), 1_00_00_000),
    [monthly]
  );
  const yearsSanitized = useMemo(
    () => Math.min(Math.max(Number(years) || 0, 0), 50),
    [years]
  );
  const rateSanitized = useMemo(
    () => Math.min(Math.max(Number(rate) || 0, 0), 40),
    [rate]
  );

  const months = yearsSanitized * 12;
  const i = rateSanitized / 12 / 100;

  // FV of SIP with deposit at period start (annuity due): FV = P * [((1+i)^n - 1)/i] * (1+i)
  const sipFutureValue = (p, m, r) => {
    if (r === 0) return p * m;
    return p * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
  };

  const investedAmount = useMemo(
    () => monthlySanitized * months,
    [monthlySanitized, months]
  );
  const totalValue = useMemo(
    () => sipFutureValue(monthlySanitized, months, i),
    [monthlySanitized, months, i]
  );
  const estReturns = useMemo(
    () => Math.max(totalValue - investedAmount, 0),
    [totalValue, investedAmount]
  );

  // Yearly chart data
  const chartData = useMemo(() => {
    const y = yearsSanitized;
    return Array.from({ length: y + 1 }, (_, year) => {
      const m = year * 12;
      return {
        year,
        value: Math.round(sipFutureValue(monthlySanitized, m, i)),
      };
    });
  }, [yearsSanitized, monthlySanitized, i]);

  const handleCalculate = (e) => {
    e?.preventDefault();
    // values already reactive; this is here if you want to validate/track
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#0D1B2A] inter">


      {/* Hero */}
      <section className="safe-area mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="py-10">
          <h2 className="text-3xl font-semibold mb-2">SIP Calculator</h2>
          <p className="text-slate-600">
            Plan investments and see projected returns with Systematic Investment Plans.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="safe-area mx-auto grid md:grid-cols-2 gap-10 pb-16" style={{ maxWidth: "1200px" }}>
        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Enter Your Details</h3>
          <form className="space-y-4" onSubmit={handleCalculate}>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Investment (₹)</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={10000000}
                step={500}
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                onBlur={() => setMonthly(monthlySanitized)}
                placeholder="5000"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A7A7]/30"
              />
              <div className="text-xs text-slate-500 mt-1">Use arrow keys for ₹500 steps.</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expected Return Rate (p.a. %)</label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={40}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                onBlur={() => setRate(rateSanitized)}
                placeholder="12"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A7A7]/30"
              />
              <div className="text-xs text-slate-500 mt-1">0–40% per annum.</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time Period (years)</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={50}
                step={1}
                value={years}
                onChange={(e) => setYears(e.target.value)}
                onBlur={() => setYears(yearsSanitized)}
                placeholder="10"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A7A7]/30"
              />
              <div className="text-xs text-slate-500 mt-1">Max 50 years.</div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 rounded-xl bg-[#00A7A7] text-white text-sm hover:bg-[#009090] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A7A7]/30"
            >
              Calculate
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Projected Results</h3>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-xs text-slate-500">Invested Amount</div>
              <div className="text-lg font-semibold">₹{INR0.format(investedAmount)}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-xs text-slate-500">Est. Returns</div>
              <div className="text-lg font-semibold text-green-600">₹{INR0.format(estReturns)}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-xs text-slate-500">Total Value</div>
              <div className="text-lg font-semibold text-[#00A7A7]">₹{INR0.format(totalValue)}</div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 16, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: "Years", position: "insideBottom", offset: -5 }}
                  tickMargin={8}
                />
                <YAxis tickFormatter={(v) => `₹${INR0.format(v)}`} width={90} />
                <Tooltip
                  formatter={(val) => `₹${INR0.format(Number(val))}`}
                  labelFormatter={(yr) => `Year ${yr}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00A7A7"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
