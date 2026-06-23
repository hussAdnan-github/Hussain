import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "@/lib/supabase";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  video_url: string | null;
  tags: string[] | null;
  featured: boolean | null;
  created_at: string | null;
}

const DashboardPortfolioDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data, error: fetchError } = await supabase
          .from("portfolio_items")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (fetchError) throw fetchError;
        setItem(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !item) {
    return (
      <DashboardLayout>
        <button onClick={() => navigate("/dashboard/portfolio")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للأعمال
        </button>
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-white/30 text-2xl"></i>
          </div>
          <p className="text-white/40 text-sm">{error || "العمل غير موجود"}</p>
          <button onClick={() => navigate("/dashboard/portfolio")} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">العودة للقائمة</button>
        </div>
      </DashboardLayout>
    );
  }

  const tags = item.tags || [];
  const displayType = tags[0] || "—";
  const displayTool = tags[1] || "—";

  return (
    <DashboardLayout>
      <button onClick={() => navigate("/dashboard/portfolio")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للأعمال
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden">
          {item.image_url && (
            <div className="aspect-video overflow-hidden">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover object-top" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {item.category && (
                <span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">{item.category}</span>
              )}
              <span className="bg-white/10 text-white/50 text-xs px-2.5 py-1 rounded-full font-medium">{displayType}</span>
              <span className="bg-white/10 text-white/50 text-xs px-2.5 py-1 rounded-full font-medium">{displayTool}</span>
              {item.featured && (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium">مميز</span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-black text-white mb-4">{item.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-lg font-black text-white">{displayType}</div>
                <div className="text-xs text-white/40 mt-1">النوع</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-lg font-black text-white">{displayTool}</div>
                <div className="text-xs text-white/40 mt-1">الأداة</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-lg font-black text-white">{item.category || "—"}</div>
                <div className="text-xs text-white/40 mt-1">التصنيف</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-bold text-sm mb-3">الوصف</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/60 text-sm leading-relaxed">
                {item.description || "لا يوجد وصف"}
              </div>
            </div>

            {item.video_url && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm mb-3">رابط الفيديو</h3>
                <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:text-blue-300 break-all">
                  {item.video_url}
                </a>
              </div>
            )}

            {item.created_at && (
              <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-white/30 text-xs">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-calendar-line"></i></div>
                تاريخ الإنشاء: {new Date(item.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={() => navigate("/dashboard/portfolio")} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm">
            <i className="ri-arrow-right-line ml-2"></i> العودة للقائمة
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPortfolioDetailPage;