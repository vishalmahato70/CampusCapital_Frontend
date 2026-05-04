const Footer = () => {
  return (
    <footer className="bg-primary text-neutral-100 py-10 mt-16">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-semibold mb-3">CapitalCompass</h2>
          <p className="text-sm text-neutral-300">
            Helping you make smarter financial decisions with credit cards,
            mutual funds, and tools.
          </p>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li><a href="/about" className="hover:text-white">Our Story</a></li>
            <li><a href="/team" className="hover:text-white">Team</a></li>
            <li><a href="/careers" className="hover:text-white">Careers</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li><a href="/credit-cards" className="hover:text-white">Credit Cards</a></li>
            <li><a href="/mutual-funds" className="hover:text-white">Mutual Funds</a></li>
            <li><a href="/tools" className="hover:text-white">Tools</a></li>
            <li><a href="/learn" className="hover:text-white">Learn</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect</h3>
          <ul className="space-y-2 text-sm text-neutral-300">
            <li><a href="#" className="hover:text-white">Twitter</a></li>
            <li><a href="#" className="hover:text-white">LinkedIn</a></li>
            <li><a href="#" className="hover:text-white">YouTube</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} CapitalCompass. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
