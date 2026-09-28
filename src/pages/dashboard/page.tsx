import { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface StatCards {
  portfolio: number;
  blog: number;
  books: number;
  prompts: number;
  messages: number;
  services: number;
  testimonials: number;
  unreadMessages: number;
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
    portfolio: 0, blog: 0, books: 0, prompts: 0, messages: 0, services: 0, testimonials: 0, unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<Array<{ id: string; name: string; subject: string | null; read: boolean | null; created_at: string | null }>>([]);
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
          { data: messagesData, count: messagesCount },
        ] = await Promise.all([
          supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
          supabase.from("blog_posts").select("*", { count: "exact", head: true }),
          supabase.from("books").select("*", { count: "exact", head: true }),
          supabase.from("prompts").select("*", { count: "exact", head: true }),
          supabase.from("services").select("*", { count: "exact", head: true }),
          supabase.from("testimonials").select("*", { count: "exact", head: true }),
          supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(4),
        ]);

        const unread = (messagesData || []).filter((m: { read: boolean | null }) => !m.read).length;

        setStats({
          portfolio: portfolioCount || 0,
          blog: blogCount || 0,
          books: booksCount || 0,
          prompts: promptsCount || 0,
          messages: messagesCount || 0,
          services: servicesCount || 0,
          testimonials: testimonialsCount || 0,
          unreadMessages: unread,
        });

        setRecentMessages(messagesData || []);
      } catch {
        // silently fail, show defaults
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return "منذ دقائق";
    if (diffHrs < 24) return `منذ ${diffHrs} ساعة`;
    return `منذ ${Math.floor(diffHrs / 24)} يوم`;
  };

  const statCards = [
    { icon: "ri-image-line", label: "الأعمال", value: String(stats.portfolio), color: "bg-blue-600" },
    { icon: "ri-article-line", label: "المقالات", value: String(stats.blog), color: "bg-emerald-500" },
    { icon: "ri-book-2-line", label: "الكتب", value: String(stats.books), color: "bg-violet-500" },
    { icon: "ri-magic-line", label: "البرومبتات", value: String(stats.prompts), color: "bg-blue-500" },
    { icon: "ri-customer-service-2-line", label: "الخدمات", value: String(stats.services), color: "bg-amber-500" },
    { icon: "ri-user-3-line", label: "آراء العملاء", value: String(stats.testimonials), color: "bg-emerald-400" },
    { icon: "ri-message-3-line", label: "الرسائل", value: String(stats.messages), color: "bg-violet-400" },
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.slice(0, 4).map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {statCards.slice(4).map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Links */}
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "ri-add-line", label: "عمل جديد", path: "/dashboard/portfolio" },
                  { icon: "ri-add-line", label: "مقال جديد", path: "/dashboard/blog" },
                  { icon: "ri-add-line", label: "برومبت جديد", path: "/dashboard/prompts" },
                  { icon: "ri-add-line", label: "كتاب جديد", path: "/dashboard/books" },
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

            {/* Recent Messages */}
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h3 className="font-bold text-white">آخر الرسائل</h3>
                {stats.unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{stats.unreadMessages}</span>
                )}
              </div>
              <div className="divide-y divide-white/5">
                {recentMessages.length === 0 ? (
                  <div className="p-6 text-center text-white/30 text-sm">لا توجد رسائل</div>
                ) : (
                  recentMessages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => navigate("/dashboard/messages")}
                      className={`w-full flex items-start gap-3 p-4 hover:bg-white/5 transition-colors cursor-pointer text-right ${!msg.read ? "bg-blue-600/10" : ""}`}
                    >
                      <div className="w-9 h-9 bg-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold text-sm">{msg.name?.[0] || "?"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${!msg.read ? "text-white" : "text-white/60"}`}>{msg.name}</span>
                          <span className="text-xs text-white/30">{formatTime(msg.created_at)}</span>
                        </div>
                        <p className="text-xs text-white/40 truncate mt-0.5">{msg.subject || "بدون عنوان"}</p>
                      </div>
                      {!msg.read && <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5"></div>}
                    </button>
                  ))
                )}
              </div>
              {recentMessages.length > 0 && (
                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={() => navigate("/dashboard/messages")}
                    className="text-blue-400 text-sm font-medium hover:text-blue-300 cursor-pointer"
                  >
                    عرض كل الرسائل
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;