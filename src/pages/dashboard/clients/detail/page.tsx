import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "@/lib/supabase";

interface Testimonial {
  id: string;
  client_name: string;
  client_role: string | null;
  client_avatar: string | null;
  content: string | null;
  rating: number | null;
  featured: boolean | null;
  created_at: string | null;
}

const DashboardClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data, error: fetchError } = await supabase
          .from("testimonials")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (fetchError) throw fetchError;
        setTestimonial(data);
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

  if (error || !testimonial) {
    return (
      <DashboardLayout>
        <button onClick={() => navigate("/dashboard/clients")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للعملاء
        </button>
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-white/30 text-2xl"></i>
          </div>
          <p className="text-white/40 text-sm">{error || "العميل غير موجود"}</p>
          <button onClick={() => navigate("/dashboard/clients")} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">العودة للقائمة</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button onClick={() => navigate("/dashboard/clients")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للعملاء
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-16 h-16 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-400 font-black text-xl">
              {testimonial.client_name?.[0] || "؟"}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white">{testimonial.client_name}</h1>
              <p className="text-white/40 text-sm">{testimonial.client_role || "عميل"}</p>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 flex items-center justify-center">
                    <i className={`text-xs ${i < (testimonial.rating || 0) ? "ri-star-fill text-amber-400" : "ri-star-line text-white/20"}`}></i>
                  </div>
                ))}
                <span className="text-white/30 text-xs mr-1">{testimonial.rating || 0}/5</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-xl font-black text-amber-400">{testimonial.rating || 0}/5</div>
              <div className="text-xs text-white/40 mt-1">التقييم</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-xl font-black text-emerald-400">{testimonial.featured ? "مميز" : "عادي"}</div>
              <div className="text-xs text-white/40 mt-1">الحالة</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-bold text-sm mb-3">نص الشهادة</h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/60 text-sm leading-relaxed">
              {testimonial.content || "لا يوجد محتوى"}
            </div>
          </div>

          {testimonial.client_avatar && (
            <div className="mb-6">
              <h3 className="text-white font-bold text-sm mb-3">صورة العميل</h3>
              <div className="w-20 h-20 rounded-xl overflow-hidden">
                <img src={testimonial.client_avatar} alt={testimonial.client_name} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {testimonial.created_at && (
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-white/30 text-xs">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-calendar-line"></i></div>
              تاريخ الإنشاء: {new Date(testimonial.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={() => navigate("/dashboard/clients")} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm">
            <i className="ri-arrow-right-line ml-2"></i> العودة للقائمة
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardClientDetailPage;