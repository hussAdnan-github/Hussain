import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import PortfolioSection from "./components/PortfolioSection";
import ServicesSection from "./components/ServicesSection";
import PromptGeneratorSection from "./components/PromptGeneratorSection";
import BooksSection from "./components/BooksSection";
import BlogSection from "./components/BlogSection";
import FooterSection from "./components/FooterSection";

const HomePage = () => {
  return (
    <div className="min-h-screen font-sans" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ServicesSection />
      <PromptGeneratorSection />
      <BooksSection />
      <BlogSection />
      <FooterSection />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/966500000000"
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