const LearnPreview = () => {
  const articles = [
    {
      title: "How to Choose the Best Credit Card",
      desc: "Understand rewards, fees, and features before applying.",
      image:
        "https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Beginner’s Guide to Mutual Funds",
      desc: "Learn types of funds, risks, and expected returns.",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Smart Tax Saving with ELSS Funds",
      desc: "Save taxes while building long-term wealth through ELSS.",
      image:
        "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section className="py-16 bg-[#F7F9FB]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-2xl font-semibold text-primary mb-8">Learn</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.title}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={article.image}
                alt={article.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-neutral700 mb-3">{article.desc}</p>
                <button className="text-secondary text-sm font-medium hover:underline">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnPreview;
