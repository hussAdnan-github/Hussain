import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  tags: string[];
  featured: boolean;
}

const PortfolioSection = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data, error: supaError } = await supabase
          .from("portfolio_items")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

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

  if (loading) {
    return (
      <section id="portfolio" className="py-14 md:py-20 bg-[#0d1b2e]" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 mt-4 text-sm">جاري تحميل الأعمال...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="py-14 md:py-20 bg-[#0d1b2e]" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <p className="text-red-400 text-sm">حدث خطأ: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-blue-400 text-sm underline cursor-pointer">إعادة المحاولة</button>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-14 md:py-20 bg-[#0d1b2e]" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
            مشاريع مختارة
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            نماذج من أعمالي في الإنتاج البصري بالذكاء الاصطناعي
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" data-product-shop>
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg overflow-hidden cursor-pointer"
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

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/portfolio")}
            className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            عرض جميع الأعمال
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;