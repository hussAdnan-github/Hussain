import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "../home/components/Navbar";
import FooterSection from "../home/components/FooterSection";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  tags: string[];
  featured: boolean;
}

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState("الكل");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data, error: supaError } = await supabase
          .from("portfolio_items")
          .select("*")
          .order("created_at", { ascending: false });

        if (supaError) throw supaError;
        setItems(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const filtered = items.filter((item) => {
    if (activeType === "الكل") return true;
    return item.tags?.includes(activeType);
  });

  const selected = selectedItem ? items.find((i) => i.id === selectedItem) : null;

  const portfolioTypes = ["الكل", "صورة", "فيديو"];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1b2e] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 mt-4 text-sm">جاري تحميل الأعمال...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1b2e] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-400 text-sm">حدث خطأ: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-blue-400 text-sm underline cursor-pointer">إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1b2e]" dir="rtl">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/40 hover:text-white text-xs mb-6 transition-colors cursor-pointer"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-right-line text-sm"></i>
            </div>
            العودة للرئيسية
          </button>

          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
            أعمالي
          </h1>
          <p className="text-white/40 text-sm">
            نماذج من مشاريع الإنتاج البصري بالذكاء الاصطناعي
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {portfolioTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeType === type
                    ? "bg-white text-[#0d1b2e] font-bold"
                    : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Two Column Grid */}
      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-3 md:gap-4" data-product-shop>
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item.id)}
              >
                <div className="w-full aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2e]/95 via-[#0d1b2e]/20 to-transparent"></div>

                <div className="absolute bottom-0 right-0 left-0 p-3 md:p-4">
                  <span className="text-blue-400 text-xs font-medium mb-1 block">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-xs md:text-sm leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="ri-image-line text-white/20 text-xl"></i>
              </div>
              <h3 className="text-white/50 font-bold text-sm mb-1">لا توجد أعمال بهذه الفلاتر</h3>
              <p className="text-white/30 text-xs">جرب تغيير الفلاتر لرؤية المزيد من الأعمال</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#0d1b2e] rounded-xl overflow-hidden max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img src={selected.image_url} alt={selected.title} className="w-full h-56 md:h-72 object-cover object-top" />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 left-3 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-sm"></i>
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-medium">{selected.category}</span>
                <span className="bg-white/10 text-white/60 text-xs px-2.5 py-1 rounded-full">{(selected.tags || []).join(" · ")}</span>
              </div>
              <h2 className="text-lg font-black text-white mb-2">{selected.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed">{selected.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-14 px-4 md:px-8 bg-[#0a1628] border-t border-white/5">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-black text-white mb-3">
            عندك مشروع في بالك؟
          </h2>
          <p className="text-white/40 text-sm mb-6">
            دعنا نحوّل فكرتك إلى عمل بصري احترافي
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/services/ai-product-photography")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              اطلب مشروعك
            </button>
            <button
              onClick={() => navigate("/about")}
              className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              تعرف عليّ
            </button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default PortfolioPage;