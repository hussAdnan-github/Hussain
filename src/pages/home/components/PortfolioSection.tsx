import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  video_url: string | null;
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
      <section id="portfolio" className="py-14 md:py-20 bg-background-100" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground-600 mt-4 text-sm">جاري تحميل الأعمال...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="py-14 md:py-20 bg-background-100" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <p className="text-red-400 text-sm">حدث خطأ: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-primary-500 text-sm underline cursor-pointer">إعادة المحاولة</button>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-14 md:py-20 bg-background-100" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-foreground-950 leading-tight mb-2">
            مشاريع مختارة
          </h2>
          <p className="text-foreground-600 text-sm max-w-md mx-auto">
            نماذج من أعمالي في الإنتاج البصري بالذكاء الاصطناعي
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" data-product-shop>
          {items.map((item) => {
            const hasVideo = !!item.video_url;
            return (
              <div
                key={item.id}
                className="group relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate("/portfolio")}
              >
                <div className="w-full aspect-[4/5] overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />

                  {hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <i className="ri-play-fill text-white text-xl md:text-2xl ml-0.5"></i>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-background-100/95 via-background-100/20 to-transparent"></div>

                <div className="absolute bottom-0 right-0 left-0 p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary-500 text-xs font-medium">
                      {item.category}
                    </span>
                    {hasVideo && (
                      <span className="bg-accent-500/20 text-accent-500 text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                        <div className="w-3 h-3 flex items-center justify-center">
                          <i className="ri-video-line text-[8px]"></i>
                        </div>
                        فيديو
                      </span>
                    )}
                  </div>
                  <h3 className="text-foreground-950 font-bold text-xs md:text-sm leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-background-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-image-line text-foreground-400 text-xl"></i>
            </div>
            <p className="text-foreground-500 text-sm">لا توجد أعمال بعد</p>
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/portfolio")}
            className="border border-background-300/60 hover:border-background-400 text-foreground-950 px-6 py-3 rounded-full font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            عرض جميع الأعمال
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;