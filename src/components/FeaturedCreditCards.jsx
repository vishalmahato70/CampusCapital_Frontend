const FeaturedCreditCards = () => {
  const cards = [
    {
      name: "HDFC Millennia",
      fee: "₹499",
      apr: "36%",
      rewards: "Up to 5%",
      perk: "Lounge access",
    },
    {
      name: "SBI Prime",
      fee: "₹2,999",
      apr: "34%",
      rewards: "Dining & Travel",
      perk: "Airport lounge",
    },
    {
      name: "ICICI Amazon Pay",
      fee: "₹0",
      apr: "38%",
      rewards: "5% on Amazon",
      perk: "Fuel surcharge waiver",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-2xl font-semibold text-primary mb-8">
          Featured Credit Cards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-[#F9F5F3] rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-primary mb-2">
                {card.name}
              </h3>
              <ul className="text-sm text-neutral700 space-y-1 mb-4">
                <li>Annual Fee: {card.fee}</li>
                <li>APR: {card.apr}</li>
                <li>Rewards: {card.rewards}</li>
                <li>{card.perk}</li>
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

export default FeaturedCreditCards;
