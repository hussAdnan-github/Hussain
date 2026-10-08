import { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface StatCards {
  portfolio: number;
  blog: number;
  books: number;
  prompts: number;
  services: number;
  testimonials: number;
}

const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
  <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
        <i className={`${icon} text-white text-lg`}></i>
      </div>
    </div>
    <div className="text-2xl font-black text-white mb-1">{value}</div>
    <div className="text-white/40 text-sm">{label}</div>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatCards>({
    portfolio: 0, blog: 0, books: 0, prompts: 0, services: 0, testimonials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          { count: portfolioCount },
          { count: blogCount },
          { count: booksCount },
          { count: promptsCount },
          { count: servicesCount },
          { count: testimonialsCount },
        ] = await Promise.all([
          supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
          supabase.from("blog_posts").select("*", { count: "exact", head: true }),
          supabase.from("books").select("*", { count: "exact", head: true }),
          supabase.from("prompts").select("*", { count: "exact", head: true }),
          supabase.from("services").select("*", { count: "exact", head: true }),
          supabase.from("testimonials").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          portfolio: portfolioCount || 0,
          blog: blogCount || 0,
          books: booksCount || 0,
          prompts: promptsCount || 0,
          services: servicesCount || 0,
          testimonials: testimonialsCount || 0,
        });
      } catch {
        // silently fail, show defaults
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const statCards = [
    { icon: "ri-image-line", label: "الأعمال", value: String(stats.portfolio), color: "bg-blue-600" },
    { icon: "ri-article-line", label: "المقالات", value: String(stats.blog), color: "bg-emerald-500" },
    { icon: "ri-book-2-line", label: "الكتب", value: String(stats.books), color: "bg-violet-500" },
    { icon: "ri-magic-line", label: "البرومبتات", value: String(stats.prompts), color: "bg-blue-500" },
    { icon: "ri-customer-service-2-line", label: "الخدمات", value: String(stats.services), color: "bg-amber-500" },
    { icon: "ri-user-3-line", label: "آراء العملاء", value: String(stats.testimonials), color: "bg-emerald-400" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">لوحة التحكم</h1>
        <p className="text-white/40 text-sm mt-1">مرحباً بك! إليك ملخص المحتوى</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {statCards.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "ri-add-line", label: "عمل جديد", path: "/dashboard/portfolio" },
                  { icon: "ri-add-line", label: "مقال جديد", path: "/dashboard/blog" },
                  { icon: "ri-add-line", label: "برومبت جديد", path: "/dashboard/prompts" },
                  { icon: "ri-add-line", label: "كتاب جديد", path: "/dashboard/books" },
                  { icon: "ri-add-line", label: "خدمة جديدة", path: "/dashboard/services" },
                  { icon: "ri-add-line", label: "شريك جديد", path: "/dashboard/clients-logos" },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:border-blue-500/30 transition-all cursor-pointer"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className={action.icon}></i>
                    </div>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links / Sections */}
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">إدارة وتخصيص الموقع</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "ri-bar-chart-2-line", label: "التحليلات", path: "/dashboard/analytics" },
                  { icon: "ri-building-2-line", label: "شركاء النجاح", path: "/dashboard/clients-logos" },
                  { icon: "ri-user-3-line", label: "العملاء", path: "/dashboard/clients" },
                  { icon: "ri-contacts-book-2-line", label: "التواصل", path: "/dashboard/contact" },
                  { icon: "ri-layout-bottom-2-line", label: "الفوتر", path: "/dashboard/footer" },
                  { icon: "ri-settings-3-line", label: "الإعدادات", path: "/dashboard/settings" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:border-blue-500/30 transition-all cursor-pointer"
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className={item.icon}></i>
                    </div>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;