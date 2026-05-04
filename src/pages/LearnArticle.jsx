import { useParams, Link } from "react-router-dom";

const LearnArticle = () => {
  const { slug } = useParams();

  // Dummy articles database
  const articles = {
    "credit-cards-101": {
      title: "Credit Cards 101: Everything You Need to Know",
      content: `
        Credit cards are a financial tool that lets you borrow money for purchases. 
        Understanding interest rates (APR), annual fees, reward programs, and credit limits is crucial. 
        Using a card responsibly helps build your credit score while giving you access to perks like cashback, travel points, or lounge access.
        
        ✅ Key Tips:
        - Always pay your bill on time to avoid penalties.
        - Don’t spend more than 30% of your credit limit.
        - Compare fees and rewards before choosing a card.
      `
    },
    "mutual-funds-basics": {
      title: "Mutual Funds Basics for Beginners",
      content: `
        Mutual funds pool money from investors to invest in stocks, bonds, or other assets. 
        They are managed by professionals and are ideal for people who want diversification with small investments.
        
        Types of Mutual Funds:
        - Equity Funds
        - Debt Funds
        - Hybrid Funds
        - Index Funds

        ✅ Key Tip: Check expense ratio and past performance before investing.
      `
    },
    "sip-guide": {
      title: "What is SIP and How Does it Work?",
      content: `
        SIP (Systematic Investment Plan) allows investors to put small amounts regularly in a mutual fund. 
        It uses the power of compounding and rupee cost averaging to build wealth over time.

        Example: Investing ₹5,000/month for 10 years at 12% annual return can grow to ₹11.6 lakhs.
      `
    },
    "personal-finance-tips": {
      title: "Personal Finance Tips for 2025",
      content: `
        Managing your money smartly is the foundation of financial freedom. 

        ✅ 2025 Tips:
        - Automate your savings and investments.
        - Diversify across equity, debt, and gold.
        - Use credit cards responsibly.
        - Build an emergency fund of 6 months.
      `
    }
  };

  const article = articles[slug];

  if (!article) {
    return (
      <main className="flex-1 max-w-[800px] mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-primary">Article Not Found</h1>
        <p className="text-neutral-700 mt-4">
          Sorry, we couldn’t find this article. Go back to{" "}
          <Link to="/learn" className="text-secondary underline">Learn</Link>.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-[800px] mx-auto px-6 py-12 bg-[#F7F9FB]">
      <h1 className="text-3xl font-semibold text-primary mb-6">{article.title}</h1>
      <article className="prose prose-neutral max-w-none">
        {article.content.split("\n").map((para, i) => (
          <p key={i} className="mb-4">{para}</p>
        ))}
      </article>
    </main>
  );
};

export default LearnArticle;
