const FeaturedFunds = () => {
  const funds = [
    {
      name: "Nifty 50 Index Fund",
      oneYear: "22%",
      threeYear: "16%",
      fiveYear: "14%",
      expense: "0.20%",
      risk: "Moderate",
    },
    {
      name: "Axis Bluechip Fund",
      oneYear: "18%",
      threeYear: "15%",
      fiveYear: "13%",
      expense: "0.50%",
      risk: "Moderate",
    },
    {
      name: "HDFC Midcap Opportunities",
      oneYear: "25%",
      threeYear: "20%",
      fiveYear: "17%",
      expense: "0.75%",
      risk: "High",
    },
  ];

  return (
    <section className="py-16 bg-[#F7F9FB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-2xl font-semibold text-primary mb-8">
          Featured Mutual Funds
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {funds.map((fund) => (
            <div
              key={fund.name}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-primary mb-2">
                {fund.name}
              </h3>
              <ul className="text-sm text-neutral700 space-y-1 mb-4">
                <li>1Y: {fund.oneYear}</li>
                <li>3Y: {fund.threeYear}</li>
                <li>5Y: {fund.fiveYear}</li>
                <li>Expense Ratio: {fund.expense}</li>
                <li>Risk: {fund.risk}</li>
              </ul>

              <div className="flex gap-3">
                <button className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-100">
                  Add to Compare
                </button>
                <button className="px-3 py-2 rounded-lg bg-secondary text-white text-sm hover:bg-teal-600">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFunds;
