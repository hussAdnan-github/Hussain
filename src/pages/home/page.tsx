import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import PortfolioSection from "./components/PortfolioSection";
import ServicesSection from "./components/ServicesSection";
import PromptGeneratorSection from "./components/PromptGeneratorSection";
import BooksSection from "./components/BooksSection";
import BlogSection from "./components/BlogSection";
import FooterSection from "./components/FooterSection";
import { supabase } from "@/lib/supabase";

interface SectionToggles {
  show_blog: boolean;
  show_books: boolean;
  show_portfolio: boolean;
  show_services: boolean;
  show_prompts: boolean;
}

const HomePage = () => {
  const [whatsapp, setWhatsapp] = useState("966500000000");
  const [toggles, setToggles] = useState<SectionToggles>({
    show_blog: true,
    show_books: true,
    show_portfolio: true,
    show_services: true,
    show_prompts: true,
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("whatsapp_number, show_blog, show_books, show_portfolio, show_services, show_prompts")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          if (data.whatsapp_number) setWhatsapp(data.whatsapp_number);
          setToggles({
            show_blog: data.show_blog !== false,
            show_books: data.show_books !== false,
            show_portfolio: data.show_portfolio !== false,
            show_services: data.show_services !== false,
            show_prompts: data.show_prompts !== false,
          });
        }
      })
      .catch(() => {})
      .finally(() => setSettingsLoaded(true));
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <AboutSection />
      {toggles.show_portfolio && <PortfolioSection />}
      {toggles.show_services && <ServicesSection />}
      {toggles.show_prompts && <PromptGeneratorSection />}
      {toggles.show_books && <BooksSection />}
      {toggles.show_blog && <BlogSection />}
      <FooterSection />

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
        aria-label="تواصل عبر واتساب"
      >
        <i className="ri-whatsapp-line text-white text-2xl"></i>
      </a>
    </div>
  );
};

export default HomePage;