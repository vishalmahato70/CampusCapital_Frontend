const Hero = () => {
  return (
    <section className="bg-[#F7F9FB] py-16">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-semibold text-primary mb-4">
          Find Your Ideal Card or Fund
        </h1>
        <p className="text-neutral700 text-lg mb-8">
          Compare credit cards, mutual funds and financial tools to make smarter money decisions.
        </p>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search credit cards or mutual funds..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {["Zero annual fee", "Travel rewards", "ELSS", "Large Cap Index"].map(
            (filter) => (
              <span
                key={filter}
                className="px-4 py-2 rounded-full bg-white shadow-sm border text-sm cursor-pointer hover:bg-secondary hover:text-white transition"
              >
                {filter}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
