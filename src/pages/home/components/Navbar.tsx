import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "الرئيسية", href: "/", isPage: true },
    { label: "عن حسن", href: "/about", isPage: true },
    { label: "الأعمال", href: "/portfolio", isPage: true },
    { label: "الخدمات", href: "/services", isPage: true },
    { label: "مولد البرومبت", href: "/prompt", isPage: true },
    { label: "الكتب", href: "/books", isPage: true },
    { label: "المدونة", href: "/blog", isPage: true },
    { label: "تواصل", href: "/contact", isPage: true },
  ];

  const handleNavClick = (href: string, isPage: boolean) => {
    setMenuOpen(false);
    if (isPage) {
      navigate(href);
    } else if (isHome) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + href);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0d1b2e]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src="https://storage.readdy-site.link/project_files/89593955-b165-4908-8cef-673a8d5d832b/27ae0e4b-d2c7-4ab7-a16a-71f26279656a_-.png?v=cac9cb95e33eb6a02a25ac228832c0e3"
              alt="حسن جمال الليل"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm leading-tight">حسن جمال الليل</span>
            <span className="text-blue-400 text-xs leading-tight">فني AI</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href, link.isPage)}
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                (link.isPage && location.pathname === link.href) || (!link.isPage && isHome && location.hash === link.href)
                  ? "text-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/services/ai-product-photography")}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            احجز مشروعك
          </button>
        </div>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-white cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-xl ${menuOpen ? "ri-close-line" : "ri-menu-line"}`}></i>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0d1b2e]/98 backdrop-blur-md border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href, link.isPage)}
              className="text-white/80 hover:text-white text-base py-2 border-b border-white/5 cursor-pointer text-right"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); navigate("/services/ai-product-photography"); }}
            className="bg-blue-600 text-white text-center py-3 rounded-full font-semibold mt-2 cursor-pointer"
          >
            احجز مشروعك
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
