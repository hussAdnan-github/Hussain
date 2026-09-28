import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface Profile {
  full_name: string | null;
}

const DashboardAccountPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "create">("profile");
  const [profile, setProfile] = useState<Profile>({ full_name: "" });
  const [form, setForm] = useState<Profile>({ full_name: "" });

  // Create account form
  const [createFullName, setCreateFullName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user?.id)
          .maybeSingle();

        if (error) throw error;
        const p = { full_name: data?.full_name || "" };
        setProfile(p);
        setForm(p);
      } catch { /* fallback */ }
      finally { setLoading(false); }
    }
    if (user?.id) loadProfile();
  }, [user?.id]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await supabase.from("profiles").upsert({
        id: user!.id,
        full_name: form.full_name || null,
      });
      setProfile(form);
      setMessage({ type: "success", text: "تم حفظ التغييرات بنجاح" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "فشل حفظ البيانات" });
    } finally { setSaving(false); }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMessage(null);
    setCreateLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: { email: createEmail, password: createPassword, fullName: createFullName },
      });
      if (error) { setCreateMessage({ type: "error", text: error.message || "فشل إنشاء الحساب" }); setCreateLoading(false); return; }
      const response = data as { success?: boolean; error?: string; message?: string };
      if (response?.error) setCreateMessage({ type: "error", text: response.error });
      else if (response?.success) {
        setCreateMessage({ type: "success", text: response.message || "تم إنشاء الحساب بنجاح!" });
        setCreateFullName(""); setCreateEmail(""); setCreatePassword("");
      } else setCreateMessage({ type: "error", text: "حدث خطأ غير معروف" });
    } catch { setCreateMessage({ type: "error", text: "تعذر الاتصال بالخادم" }); }
    finally { setCreateLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto" dir="rtl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">الحساب</h1>
          <p className="text-white/40 text-sm mt-1">إدارة بياناتي وإنشاء حسابات جديدة</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-6">
          <button onClick={() => setActiveTab("profile")} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === "profile" ? "bg-blue-600 text-white" : "text-white/50 hover:text-white"}`}>
            <span className="w-4 h-4 inline-flex items-center justify-center ml-1.5"><i className="ri-user-settings-line"></i></span>
            بياناتي
          </button>
          <button onClick={() => setActiveTab("create")} className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === "create" ? "bg-emerald-600 text-white" : "text-white/50 hover:text-white"}`}>
            <span className="w-4 h-4 inline-flex items-center justify-center ml-1.5"><i className="ri-user-add-line"></i></span>
            إنشاء حساب جديد
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <>
            {message && (
              <div className={`border rounded-xl p-4 mb-6 flex items-center gap-3 ${message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className={message.type === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"}></i></div>
                <span className="text-sm">{message.text}</span>
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 md:p-8">
                {/* User info header */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {profile.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{profile.full_name || user?.email?.split("@")[0] || "مستخدم"}</div>
                    <div className="text-white/40 text-sm" dir="ltr" style={{ textAlign: "right" }}>{user?.email}</div>
                    <div className="flex items-center gap-1 mt-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span><span className="text-emerald-400 text-xs">مدير</span></div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">الاسم الكامل</label>
                    <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500 transition-colors" placeholder="حسن جمال الليل" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">البريد الإلكتروني</label>
                    <input type="email" value={user?.email || ""} disabled className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/40 cursor-not-allowed" dir="ltr" style={{ textAlign: "right" }} />
                    <p className="text-white/20 text-xs mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                  </div>
                  <button onClick={handleSaveProfile} disabled={saving} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap">
                    {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create Account Tab */}
        {activeTab === "create" && (
          <>
            {createMessage && (
              <div className={`border rounded-xl p-4 mb-6 flex items-center gap-3 ${createMessage.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className={createMessage.type === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"}></i></div>
                <span className="text-sm">{createMessage.text}</span>
              </div>
            )}
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 md:p-8">
              <form onSubmit={handleCreateAccount} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">البريد الإلكتروني <span className="text-red-400">*</span></label>
                  <input type="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} required dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors text-left" placeholder="user@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">كلمة المرور <span className="text-red-400">*</span></label>
                  <input type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} required minLength={4} dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors text-left" placeholder="4 أحرف على الأقل" />
                  <p className="text-white/20 text-xs mt-1.5">الحد الأدنى 4 أحرف</p>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <button type="submit" disabled={createLoading} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2">
                    {createLoading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>جاري الإنشاء...</>
                    ) : (
                      <><span className="w-4 h-4 flex items-center justify-center"><i className="ri-user-add-line"></i></span>إنشاء الحساب</>
                    )}
                  </button>
                  <button type="button" onClick={() => { setCreateEmail(""); setCreatePassword(""); setCreateMessage(null); }} className="text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer whitespace-nowrap">إعادة تعيين</button>
                </div>
              </form>
            </div>
            <div className="mt-6 bg-[#0d1b2e]/50 border border-white/5 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5"><i className="ri-information-line text-white/30 text-sm"></i></div>
                <div className="text-white/30 text-xs leading-relaxed">الحسابات الجديدة ستتمكن من تسجيل الدخول فوراً إلى لوحة التحكم. كلمة المرور مشفرة بالكامل ولا يمكن لأحد الاطلاع عليها.</div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardAccountPage;