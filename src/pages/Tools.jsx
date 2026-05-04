// import Header from "../components/Header";
// import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Calculator, TrendingUp, CreditCard, BarChart3 } from "lucide-react";

const Tools = () => {
  const tools = [
    {
      name: "SIP Calculator",
      description: "Estimate returns on your monthly SIP investments.",
      icon: <Calculator className="w-6 h-6 text-[#00A7A7]" />,
      link: "/tools/sip-calculator",
      cta: "Try Now →",
    },
    {
      name: "Lumpsum Calculator",
      description: "Calculate returns on one-time mutual fund investments.",
      icon: <TrendingUp className="w-6 h-6 text-[#00A7A7]" />,
      link: "/tools/lumpsum-calculator",
      cta: "Try Now →",
    },
    {
      name: "Credit Card EMI Calculator",
      description: "Plan your EMI payments for large purchases.",
      icon: <CreditCard className="w-6 h-6 text-[#00A7A7]" />,
      link: "/tools/emi-calculator",
      cta: "Try Now →",
    },
    {
      name: "Retirement Calculator",
      description: "See how much you need to retire comfortably.",
      icon: <BarChart3 className="w-6 h-6 text-[#00A7A7]" />,
      link: "/tools/retirement-calculator",
      cta: "Try Now →",
    },
  ];

  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
      {/* <Header /> */}

      <main className="flex-1 max-w-[1200px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-[#0D1B2A] mb-8">Financial Tools</h1>

        <section aria-label="Financial tools list">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.link}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A7A7]/30"
                aria-label={`Open ${tool.name}`}
              >
                <div className="flex items-center gap-3">
                  {tool.icon}
                  <h2 className="text-xl font-semibold text-[#0D1B2A]">{tool.name}</h2>
                </div>

                <p className="text-neutral-700">{tool.description}</p>

                <span className="text-[#00A7A7] font-medium group-hover:underline">
                  {tool.cta}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default Tools;
