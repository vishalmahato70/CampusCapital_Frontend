import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


/* Brand Logo unchanged */
function BrandLogo({ size = 40 }) {
  return (
    <div
      className="shrink-0 rounded-xl"
      style={{ width: size, height: size, background: "linear-gradient(135deg, #0D1B2A 0%, #172A3A 100%)" }}
    >
      <svg viewBox="0 0 56 56" className="w-full h-full" role="img" aria-label="CapitalCompass logo">
        <rect x="2" y="2" width="52" height="52" rx="14" fill="transparent" />
        <path d="M10 38 L22 30 L30 34 L44 18" stroke="#00A7A7" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <g transform="translate(28 28)">
          <polygon points="0,-11 4,4 0,1 -4,4" fill="#F4A261" />
          <circle cx="0" cy="0" r="1.8" fill="#F9F5F3" />
        </g>
      </svg>
    </div>
  );
}

/* Keep or edit as desired */
const navItems = [
  { name: "Credit Cards", path: "/credit-cards" },
  { name: "Mutual Funds", path: "/mutual-funds" },
  { name: "Tools", path: "/tools" },
  { name: "Learn", path: "/learn" },
  { name: "Saved", path: "/saved" },
  { name: "Money Tracker", path: "/money-tracker" }, // remove this line if you don't want it in the nav
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();


return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden">
            <BrandLogo size={40} />
          </div>
          <span className="text-xl font-semibold text-[#0D1B2A] group-hover:opacity-90">CapitalCompass</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                [
                  "relative text-sm font-medium transition-colors",
                  isActive ? "text-[#00A7A7]" : "text-neutral-700 hover:text-[#00A7A7]",
                ].join(" ")
              }
              end
            >
              <span className="inline-flex items-center">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <button
              className="hidden md:inline-flex px-4 py-2 text-sm rounded-lg bg-rose-500 text-white hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
              onClick={logout} // Logout function call karein
            >
              Log Out
            </button>
          ) : (
            <button
              className="hidden md:inline-flex px-4 py-2 text-sm rounded-lg bg-[#00A7A7] text-white hover:bg-[#009090] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A7A7]/40"
              onClick={() => {
                navigate("/signin")
              }}
            >
              Log In
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A7A7]/40"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d={open ? "M6 6 L18 18 M6 18 L18 6" : "M3 6h18M3 12h18M3 18h18"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white/90 backdrop-blur">
          <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "px-3 py-2 rounded-lg border text-sm",
                    isActive ? "border-[#00A7A7] text-[#00A7A7] bg-[#E8F6F6]" : "border-slate-200 text-neutral-700 hover:border-slate-300",
                  ].join(" ")
                }
                end
              >
                {item.name}
              </NavLink>
            ))}

            {user ? (
              <button
                className="mt-1 px-3 py-2 rounded-lg bg-rose-500 text-white text-sm hover:bg-rose-600"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Log Out
              </button>
            ) : (
              <button
                className="mt-1 px-3 py-2 rounded-lg bg-[#00A7A7] text-white text-sm hover:bg-[#009090]"
                onClick={() => {
                  navigate("/signin")
                  setOpen(false);
                }}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;