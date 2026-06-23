import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";

interface AnalyticsStats {
  portfolio: number;
  blog: number;
  books: number;
  services: number;
  prompts: number;
  testimonials: number;
  messages: number;
  totalOrders: number;
  totalRevenue: number;
  avgRating: number;
}

interface MonthlyRevenue {
  month: string;
  total: number;
}

const DashboardAnalyticsPage = () => {
  const [stats, setStats] = useState<AnalyticsStats>({
    portfolio: 0, blog: 0, books: 0, services: 0, prompts: 0, testimonials: 0, messages: 0, totalOrders: 0, totalRevenue: 0, avgRating: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          { count: portfolioCount },
          { count: blogCount },
          { count: booksCount },
          { count: servicesCount },
          { count: promptsCount },
          { count: testimonialsCount },
          { count: messagesCount },
          { count: ordersCount },
          { data: orderData },
          { data: ratingData },
          { data: monthlyData },
        ] = await Promise.all([
          supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
          supabase.from("blog_posts").select("*", { count: "exact", head: true }),
          supabase.from("books").select("*", { count: "exact", head: true }),
          supabase.from("services").select("*", { count: "exact", head: true }),
          supabase.from("prompts").select("*", { count: "exact", head: true }),
          supabase.from("testimonials").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }),
          supabase.from("order_headers").select("*", { count: "exact", head: true }),
          supabase.from("order_headers").select("subtotal_items"),
          supabase.from("testimonials").select("rating"),
          supabase.from("order_headers").select("subtotal_items, created_at").not("subtotal_items", "is", null),
        ]);

        const totalRevenue = (orderData || []).reduce(
          (sum: number, o: { subtotal_items: number | null }) => sum + (o.subtotal_items || 0),
          0
        );

        const ratings = (ratingData || []).filter((r: { rating: number | null }) => r.rating != null);
        const avgRating = ratings.length > 0
          ? ratings.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / ratings.length
          : 0;

        // Build monthly revenue from orders
        const monthMap: Record<string, number> = {};
        const arMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

        if (monthlyData) {
          for (const o of monthlyData) {
            if (o.created_at) {
              const d = new Date(o.created_at);
              const key = `${d.getFullYear()}-${d.getMonth()}`;
              monthMap[key] = (monthMap[key] || 0) + (o.subtotal_items || 0);
            }
          }
        }

        // Get last 6 months including current
        const now = new Date();
        const last6: MonthlyRevenue[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          last6.push({
            month: arMonths[d.getMonth()],
            total: monthMap[key] || 0,
          });
        }

        setMonthlyRevenue(last6);

        setStats({
          portfolio: portfolioCount || 0,
          blog: blogCount || 0,
          books: booksCount || 0,
          services: servicesCount || 0,
          prompts: promptsCount || 0,
          testimonials: testimonialsCount || 0,
          messages: messagesCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue,
          avgRating,
        });
      } catch {
        // silently fallback
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const totalContent = stats.portfolio + stats.blog + stats.books + stats.services + stats.prompts;
  const estimatedViews = totalContent * 340;

  const contentBreakdown = [
    { label: "الأعمال", value: stats.portfolio, icon: "ri-image-line", color: "text-blue-400" },
    { label: "المقالات", value: stats.blog, icon: "ri-article-line", color: "text-emerald-400" },
    { label: "الكتب", value: stats.books, icon: "ri-book-2-line", color: "text-violet-400" },
    { label: "الخدمات", value: stats.services, icon: "ri-customer-service-2-line", color: "text-amber-400" },
    { label: "البرومبتات", value: stats.prompts, icon: "ri-magic-line", color: "text-blue-300" },
    { label: "الرسائل", value: stats.messages, icon: "ri-message-3-line", color: "text-violet-300" },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.total), 1);

  const topPages = [
    { page: "الصفحة الرئيسية", views: estimatedViews, bounce: "42%" },
    { page: "معرض الأعمال", views: Math.floor(estimatedViews * 0.5), bounce: "35%" },
    { page: "مولد البرومبت", views: Math.floor(estimatedViews * 0.42), bounce: "28%" },
    { page: "المتجر", views: Math.floor(estimatedViews * 0.3), bounce: "38%" },
    { page: "الخدمات", views: Math.floor(estimatedViews * 0.22), bounce: "45%" },
  ];

  const maxPageViews = Math.max(...topPages.map((p) => p.views), 1);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">التحليلات</h1>
        <p className="text-white/40 text-sm mt-1">إحصائيات الموقع والمحتوى</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-blue-400 text-lg"></i>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  {stats.totalOrders} طلب
                </span>
              </div>
              <div className="text-2xl font-black text-white">{stats.totalRevenue.toLocaleString()}$</div>
              <div className="text-white/40 text-sm mt-1">إجمالي الإيرادات</div>
            </div>

            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <i className="ri-file-list-3-line text-emerald-400 text-lg"></i>
                </div>
                <span className="text-xs text-white/30">{totalContent} محتوى</span>
              </div>
              <div className="text-2xl font-black text-white">{totalContent.toLocaleString()}</div>
              <div className="text-white/40 text-sm mt-1">إجمالي المحتوى</div>
            </div>

            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <i className="ri-star-fill text-amber-400 text-lg"></i>
                </div>
                <span className="text-xs text-white/30">{stats.testimonials} تقييم</span>
              </div>
              <div className="text-2xl font-black text-white">{stats.avgRating.toFixed(1)}</div>
              <div className="text-white/40 text-sm mt-1">متوسط التقييم</div>
            </div>

            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <i className="ri-eye-line text-blue-300 text-lg"></i>
                </div>
                <span className="text-xs text-white/30">تقديري</span>
              </div>
              <div className="text-2xl font-black text-white">{estimatedViews.toLocaleString()}</div>
              <div className="text-white/40 text-sm mt-1">تقدير المشاهدات</div>
            </div>
          </div>

          {/* Content Breakdown + Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Content Breakdown */}
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-5">توزيع المحتوى</h3>
              <div className="space-y-4">
                {contentBreakdown.map((item) => {
                  const pct = totalContent > 0 ? (item.value / totalContent) * 100 : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 flex items-center justify-center">
                            <i className={`${item.icon} ${item.color} text-sm`}></i>
                          </div>
                          <span className="text-sm text-white/60">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold text-white">{item.value}</span>
                      </div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color.replace("text", "bg")}`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-5">الإيرادات الشهرية (آخر 6 أشهر)</h3>
              {monthlyRevenue.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-white/30 text-sm">لا توجد بيانات إيرادات بعد</p>
                </div>
              ) : (
                <div className="flex items-end gap-3 h-40">
                  {monthlyRevenue.map((m, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-white/30">{m.total > 0 ? m.total.toLocaleString() + "$" : "—"}</span>
                      <div
                        className="w-full bg-blue-600 rounded-t-lg transition-all duration-500 hover:bg-blue-500"
                        style={{ height: `${maxRevenue > 0 ? (m.total / maxRevenue) * 100 : 0}%`, minHeight: m.total > 0 ? "8px" : "2px" }}
                      ></div>
                      <span className="text-xs text-white/40">{m.month}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div className="bg-[#0d1b2e] border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-blue-400">{stats.portfolio}</div>
              <div className="text-xs text-white/40">أعمال</div>
            </div>
            <div className="bg-[#0d1b2e] border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-emerald-400">{stats.blog}</div>
              <div className="text-xs text-white/40">مقالات</div>
            </div>
            <div className="bg-[#0d1b2e] border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-violet-400">{stats.books}</div>
              <div className="text-xs text-white/40">كتب</div>
            </div>
            <div className="bg-[#0d1b2e] border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-amber-400">{stats.services}</div>
              <div className="text-xs text-white/40">خدمات</div>
            </div>
            <div className="bg-[#0d1b2e] border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-blue-300">{stats.testimonials}</div>
              <div className="text-xs text-white/40">تقييمات</div>
            </div>
            <div className="bg-[#0d1b2e] border border-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-violet-300">{stats.messages}</div>
              <div className="text-xs text-white/40">رسائل</div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-bold text-white">أكثر الصفحات زيارة (تقديري)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">#</th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">الصفحة</th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">المشاهدات</th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">معدل الارتداد</th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">الأداء</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((page, i) => (
                    <tr key={page.page} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 text-sm font-bold text-white/30">{i + 1}</td>
                      <td className="px-5 py-4 text-sm font-medium text-white">{page.page}</td>
                      <td className="px-5 py-4 text-sm font-bold text-blue-400">{page.views.toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm text-white/50">{page.bounce}</td>
                      <td className="px-5 py-4">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${(page.views / maxPageViews) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardAnalyticsPage;