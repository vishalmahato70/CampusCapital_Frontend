import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedCreditCards from "../components/FeaturedCreditCards";
import FeaturedFunds from "../components/FeaturedFunds";
import ToolsPreview from "../components/ToolsPreview";
import LearnPreview from "../components/LearnPreview";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="bg-[#F7F9FB] min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <Hero />
        <FeaturedCreditCards />
        <FeaturedFunds />
        <ToolsPreview />
        <LearnPreview />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FrontPage;
