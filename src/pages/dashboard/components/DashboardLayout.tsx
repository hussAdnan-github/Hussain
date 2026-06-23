import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: "ri-dashboard-line", label: "الرئيسية", path: "/dashboard" },
  { icon: "ri-image-line", label: "الأعمال", path: "/dashboard/portfolio" },
  { icon: "ri-book-2-line", label: "الكتب والمتجر", path: "/dashboard/books" },
  { icon: "ri-user-3-line", label: "العملاء", path: "/dashboard/clients" },
  { icon: "ri-magic-line", label: "البرومبتات", path: "/dashboard/prompts" },
  { icon: "ri-article-line", label: "المدونة", path: "/dashboard/blog" },
  { icon: "ri-customer-service-2-line", label: "الخدمات", path: "/dashboard/services" },
  { icon: "ri-message-3-line", label: "الرسائل", path: "/dashboard/messages" },
  { icon: "ri-bar-chart-2-line", label: "التحليلات", path: "/dashboard/analytics" },
  // { icon: "ri-settings-3-line", label: "الإعدادات", path: "/dashboard/settings" },
  { icon: "ri-user-settings-line", label: "الحساب", path: "/dashboard/account" },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    async function loadUserProfile() {
      if (!user?.id) return;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .maybeSingle();
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        if (data?.full_name) setDisplayName(data.full_name);
      } catch { /* ignore */ }
    }
    loadUserProfile();
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const userInitial = displayName?.[0] || user?.email?.[0]?.toUpperCase() || "ح";

  return (
    <div className="min-h-screen bg-[#0a1628] flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-[#0d1b2e] border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <i className="ri-film-line text-white text-base"></i>
            </div>
            <div>
              <div className="text-white text-sm font-bold leading-tight">حسن جمال الليل</div>
              <div className="text-blue-400 text-xs leading-tight">لوحة التحكم</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden w-8 h-8 flex items-center justify-center text-white/50 hover:text-white cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* Admin badge with avatar */}
        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                userInitial
              )}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate">{displayName || user?.email || "حسن جمال الليل"}</div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span className="text-emerald-400 text-xs">مدير</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 cursor-pointer text-right ${
                  isActive ? "bg-blue-600 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <i className={`${item.icon} text-base`}></i>
                </div>
                <span className="text-sm font-medium flex-1">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-2 text-white/40 hover:text-white text-sm py-2 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-external-link-line"></i></div>
            عرض الموقع
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-400/60 hover:text-red-400 text-sm py-2 px-3 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-logout-box-r-line"></i></div>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:mr-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-[#0d1b2e] border-b border-white/10 px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-9 h-9 flex items-center justify-center text-white/60 hover:text-white cursor-pointer">
              <i className="ri-menu-line text-xl"></i>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="relative w-9 h-9 flex items-center justify-center text-white/50 hover:text-red-400 cursor-pointer transition-colors" title="تسجيل الخروج">
              <i className="ri-logout-box-r-line text-xl"></i>
            </button>
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                userInitial
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;