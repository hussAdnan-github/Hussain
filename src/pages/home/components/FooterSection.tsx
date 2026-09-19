import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface SocialLink { icon: string; label: string; url: string; visible: boolean; }
interface FooterLink { label: string; href: string; page_key: string; visible: boolean; }
interface FooterColumn { title: string; visible: boolean; links: FooterLink[]; }
interface BottomLink { label: string; href: string; visible: boolean; }

interface FooterSettings {
  navbar_logo_url: string;
  navbar_logo_text: string;
  footer_description: string;
  footer_social_links: SocialLink[];
  footer_columns: FooterColumn[];
  footer_copyright: string;
  footer_bottom_links: BottomLink[];
  show_blog: boolean;
  show_books: boolean;
  show_portfolio: boolean;
  show_services: boolean;
  show_prompts: boolean;
  show_contact: boolean;
}

const defaultSettings: FooterSettings = {
  navbar_logo_url: "https://static.readdy.ai/image/8d67d4b5b60a62e7b1df4167f7b5245a/063058724ec35e84d75517ddfc59765d.png",
  navbar_logo_text: "حسن جمال الليل",
  footer_description: "مصور ومونتير أفلام متخصص في الإنتاج البصري بالذكاء الاصطناعي. أحوّل الأفكار إلى محتوى بصري سينمائي يبيع ويؤثر.",
  footer_social_links: [
    { icon: "ri-instagram-line", label: "Instagram", url: "#", visible: true },
    { icon: "ri-youtube-line", label: "YouTube", url: "#", visible: true },
    { icon: "ri-twitter-x-line", label: "Twitter / X", url: "#", visible: true },
    { icon: "ri-tiktok-line", label: "TikTok", url: "#", visible: true },
  ],
  footer_columns: [],
  footer_copyright: "© 2026 حسن جمال الليل. جميع الحقوق محفوظة.",
  footer_bottom_links: [],
  show_blog: true,
  show_books: true,
  show_portfolio: true,
  show_services: true,
  show_prompts: true,
  show_contact: true,
};

const FooterSection = () => {
  const [settings, setSettings] = useState<FooterSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("navbar_logo_url, navbar_logo_text, footer_description, footer_social_links, footer_columns, footer_copyright, footer_bottom_links, show_blog, show_books, show_portfolio, show_services, show_prompts, show_contact")
        .eq("id", 1)
        .maybeSingle();
      if (data) {
        setSettings({
          navbar_logo_url: data.navbar_logo_url || settings.navbar_logo_url,
          navbar_logo_text: data.navbar_logo_text || settings.navbar_logo_text,
          footer_description: data.footer_description || settings.footer_description,
          footer_social_links: data.footer_social_links || settings.footer_social_links,
          footer_columns: data.footer_columns || [],
          footer_copyright: data.footer_copyright || settings.footer_copyright,
          footer_bottom_links: data.footer_bottom_links || [],
          show_blog: data.show_blog !== false,
          show_books: data.show_books !== false,
          show_portfolio: data.show_portfolio !== false,
          show_services: data.show_services !== false,
          show_prompts: data.show_prompts !== false,
          show_contact: data.show_contact !== false,
        });
      }
    } catch { /* keep defaults */ }
  };

  const pageVisibility: Record<string, boolean> = {
    blog: settings.show_blog,
    books: settings.show_books,
    portfolio: settings.show_portfolio,
    services: settings.show_services,
    prompts: settings.show_prompts,
    contact: settings.show_contact,
  };

  const isLinkHidden = (link: FooterLink) => {
    if (link.visible === false) return true;
    if (link.page_key && pageVisibility[link.page_key] === false) return true;
    return false;
  };

  const visibleColumns = settings.footer_columns
    .map((column) => ({
      ...column,
      links: column.links.filter((link) => !isLinkHidden(link)),
    }))
    .filter((column) => column.visible !== false && column.links.length > 0);

  const visibleSocial = settings.footer_social_links.filter((s) => s.visible !== false);
  const visibleBottomLinks = settings.footer_bottom_links.filter((l) => l.visible !== false);

  const scrollTo = (href: string) => {
    if (!href || href === "#") return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const renderLink = (link: FooterLink) => {
    const isExternal = link.href.startsWith("http");
    const isHash = link.href.startsWith("#");

    if (isExternal) {
      return (
        <a href={link.href} target="_blank" rel="nofollow noopener noreferrer" className="text-white/50 hover:text-white text-sm transition-colors duration-200 cursor-pointer">
          {link.label}
        </a>
      );
    }
    if (isHash) {
      return (
        <button onClick={() => scrollTo(link.href)} className="text-white/50 hover:text-white text-sm transition-colors duration-200 cursor-pointer text-right">
          {link.label}
        </button>
      );
    }
    return (
      <Link to={link.href} className="text-white/50 hover:text-white text-sm transition-colors duration-200 cursor-pointer">
        {link.label}
      </Link>
    );
  };

  return (
    <footer className="bg-[#0a1628] pt-16 pb-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 mb-12">
          {/* Brand */}
          <div className="lg:w-80 flex-shrink-0">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }} className="inline-block mb-4 cursor-pointer">
              <img
                src={settings.navbar_logo_url}
                alt={settings.navbar_logo_text}
                className="h-12 w-auto object-contain"
              />
            </a>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              {settings.footer_description}
            </p>

            {/* Social */}
            {visibleSocial.length > 0 && (
              <div className="flex gap-3 mb-8">
                {visibleSocial.map((social) => (
                  <a
                    key={`${social.icon}-${social.label}`}
                    href={social.url && social.url !== "#" ? social.url : undefined}
                    onClick={social.url && social.url !== "#" ? undefined : (e) => { e.preventDefault(); }}
                    target={social.url && social.url !== "#" ? "_blank" : undefined}
                    rel={social.url && social.url !== "#" ? "nofollow noopener noreferrer" : undefined}
                    title={social.label}
                    className="w-9 h-9 bg-white/5 hover:bg-blue-600 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    <i className={`${social.icon} text-sm`}></i>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {visibleColumns.map((column) => (
              <div key={column.title}>
                <h4 className="text-white font-bold text-sm mb-5">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      {renderLink(link)}
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
            {settings.footer_copyright}
          </p>
          {visibleBottomLinks.length > 0 && (
            <div className="flex gap-6">
              {visibleBottomLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                const isHash = link.href.startsWith("#");
                if (isExternal) {
                  return (
                    <a key={link.label} href={link.href} target="_blank" rel="nofollow noopener noreferrer" className="text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer">{link.label}</a>
                  );
                }
                if (isHash) {
                  return (
                    <button key={link.label} onClick={() => scrollTo(link.href)} className="text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer">{link.label}</button>
                  );
                }
                return (
                  <Link key={link.label} to={link.href} className="text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer">{link.label}</Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;