
import { BookOpen, CreditCard, TrendingUp, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";

const Learn = () => {
  const articles = [
    {
      title: "Credit Cards 101: Everything You Need to Know",
      description: "Understand types of credit cards, fees, rewards and how to choose the best one.",
      icon: <CreditCard className="w-6 h-6 text-secondary" />,
      link: "/learn/credit-cards-101"
    },
    {
      title: "Mutual Funds Basics for Beginners",
      description: "Learn how mutual funds work, types of funds, risks, and returns.",
      icon: <TrendingUp className="w-6 h-6 text-secondary" />,
      link: "/learn/mutual-funds-basics"
    },
    {
      title: "What is SIP and How Does it Work?",
      description: "Systematic Investment Plans explained in simple words with examples.",
      icon: <PiggyBank className="w-6 h-6 text-secondary" />,
      link: "/learn/sip-guide"
    },
    {
      title: "Personal Finance Tips for 2025",
      description: "Smart money management, budgeting hacks, and wealth-building strategies.",
      icon: <BookOpen className="w-6 h-6 text-secondary" />,
      link: "/learn/personal-finance-tips"
    }
  ];

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
     

      <main className="flex-1 max-w-[1200px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary mb-8">Learn & Grow</h1>
        <p className="text-neutral-700 mb-10 max-w-2xl">
          Explore our guides and tutorials to make smarter financial decisions. 
          From credit cards to mutual funds, we’ve got you covered.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <Link
              key={i}
              to={a.link}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                {a.icon}
                <h2 className="text-xl font-semibold text-primary">{a.title}</h2>
              </div>
              <p className="text-neutral-700">{a.description}</p>
              <span className="text-secondary font-medium hover:underline">Read More →</span>
            </Link>
          ))}
        </div>
      </main>

    
    </div>
  );
};

export default Learn;
