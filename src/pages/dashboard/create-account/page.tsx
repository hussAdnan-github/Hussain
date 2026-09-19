import { useState } from "react";
import DashboardLayout from "@/pages/dashboard/components/DashboardLayout";
import { supabase } from "@/lib/supabase";

export default function CreateAccountPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: { email, password, fullName, avatarUrl, bio },
      });

      if (error) {
        setMessage({ type: "error", text: error.message || "فشل إنشاء الحساب" });
        setLoading(false);
        return;
      }

      const response = data as { success?: boolean; error?: string; message?: string };

      if (response?.error) {
        setMessage({ type: "error", text: response.error });
      } else if (response?.success) {
        setMessage({ type: "success", text: response.message || "تم إنشاء الحساب بنجاح!" });
        setFullName("");
        setEmail("");
        setPassword("");
        setAvatarUrl("");
        setBio("");
      } else {
        setMessage({ type: "error", text: "حدث خطأ غير معروف" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "تعذر الاتصال بالخادم" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto" dir="rtl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">إنشاء حساب جديد</h1>
          <p className="text-white/40 text-sm mt-1">إضافة مسؤول أو مستخدم جديد للوحة التحكم</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`border rounded-xl p-4 mb-6 flex items-center gap-3 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <i className={message.type === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"}></i>
            </div>
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                الاسم الكامل <span className="text-white/30 text-xs">(اختياري)</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="مثال: أحمد محمد"
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                رابط الصورة الشخصية <span className="text-white/30 text-xs">(اختياري)</span>
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors text-left"
                placeholder="https://..."
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                نبذة تعريفية <span className="text-white/30 text-xs">(اختياري)</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                rows={3}
                maxLength={500}
                placeholder="نبذة مختصرة عن المستخدم..."
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                البريد الإلكتروني <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors text-left"
                placeholder="user@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                كلمة المرور <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                dir="ltr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors text-left"
                placeholder="4 أحرف على الأقل"
              />
              <p className="text-white/20 text-xs mt-1.5">الحد الأدنى 4 أحرف</p>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-user-add-line"></i>
                    </span>
                    إنشاء الحساب
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setAvatarUrl("");
                  setBio("");
                  setMessage(null);
                }}
                className="text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                إعادة تعيين
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 bg-[#0d1b2e]/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-information-line text-white/30 text-sm"></i>
            </div>
            <div className="text-white/30 text-xs leading-relaxed">
              الحسابات الجديدة ستتمكن من تسجيل الدخول فوراً إلى لوحة التحكم. كلمة المرور مشفرة بالكامل ولا يمكن لأحد الاطلاع عليها.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}