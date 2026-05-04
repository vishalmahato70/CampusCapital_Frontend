import { Calculator, TrendingUp, PiggyBank, Briefcase } from "lucide-react";

const ToolsPreview = () => {
  const tools = [
    {
      name: "SIP Calculator",
      desc: "Plan your investments with monthly SIP returns.",
      icon: <Calculator className="w-8 h-8 text-secondary" />,
    },
    {
      name: "EMI Calculator",
      desc: "Estimate monthly installments for loans.",
      icon: <PiggyBank className="w-8 h-8 text-secondary" />,
    },
    {
      name: "Retirement Planner",
      desc: "Plan a secure retirement with goal-based savings.",
      icon: <Briefcase className="w-8 h-8 text-secondary" />,
    },
    {
      name: "Tax Calculator",
      desc: "Check your tax liability and optimize savings.",
      icon: <TrendingUp className="w-8 h-8 text-secondary" />,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-2xl font-semibold text-primary mb-8">Tools</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="bg-[#F9F5F3] rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col items-start"
            >
              <div className="mb-4">{tool.icon}</div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-neutral700">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsPreview;
