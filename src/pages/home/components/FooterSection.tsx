import { useNavigate } from "react-router-dom";

const FooterSection = () => {
  const navigate = useNavigate();

  const footerLinks = {
    الخدمات: [
      { label: "تصوير AI", href: "/services/ai-product-photography", isPage: true },
      { label: "مونتاج فيديو", href: "/services/video-editing", isPage: true },
      { label: "هندسة البرومبتات", href: "/services/prompt-engineering", isPage: true },
      { label: "استشارات", href: "/services/consultation", isPage: true },
    ],
    المنتجات: [
      { label: "كتاب AI Photography", href: "/books", isPage: true },
      { label: "البرومبت السينمائي", href: "/books", isPage: true },
      { label: "العضويات", href: "/memberships", isPage: true },
      { label: "المدونة", href: "/blog", isPage: true },
    ],
    تواصل: [
      { label: "صفحة التواصل", href: "/contact", isPage: true },
      { label: "Instagram", href: "#", isPage: false },
      { label: "YouTube", href: "#", isPage: false },
      { label: "Twitter / X", href: "#", isPage: false },
    ],
  };

  const scrollTo = (href: string) => {
    if (!href || href === "#") return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLinkClick = (href: string, isPage: boolean) => {
    if (isPage) {
      navigate(href);
    } else if (href.startsWith("#") && href !== "#") {
      scrollTo(href);
    }
  };

  return (
    <footer className="bg-[#0a1628] pt-16 pb-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 mb-12">
          {/* Brand */}
          <div className="lg:w-80 flex-shrink-0">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }} className="inline-block mb-4 cursor-pointer">
              <img
                src="https://static.readdy.ai/image/8d67d4b5b60a62e7b1df4167f7b5245a/063058724ec35e84d75517ddfc59765d.png"
                alt="حسن جمال الليل"
                className="h-12 w-auto object-contain"
              />
            </a>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              مصور ومونتير أفلام متخصص في الإنتاج البصري بالذكاء الاصطناعي. أحوّل الأفكار إلى محتوى بصري سينمائي يبيع ويؤثر.
            </p>

            {/* Social */}
            <div className="flex gap-3 mb-8">
              {[
                { icon: "ri-instagram-line", href: "#" },
                { icon: "ri-youtube-line", href: "#" },
                { icon: "ri-twitter-x-line", href: "#" },
                { icon: "ri-tiktok-line", href: "#" },
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="w-9 h-9 bg-white/5 hover:bg-blue-600 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <i className={`${social.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white font-bold text-sm mb-5">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleLinkClick(link.href, (link as { isPage?: boolean }).isPage ?? false)}
                        className="text-white/50 hover:text-white text-sm transition-colors duration-200 cursor-pointer"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2026 حسن جمال الليل. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer">سياسة الخصوصية</a>
            <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
