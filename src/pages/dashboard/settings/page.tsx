import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

const DashboardSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "payment" | "email">("general");

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">الإعدادات</h1>
        <p className="text-white/40 text-sm mt-1">إعدادات الموقع والنظام</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-6 flex-wrap">
        {(["general", "seo", "payment", "email"] as const).map((tab) => {
          const labels = { general: "عام", seo: "SEO", payment: "الدفع", email: "البريد" };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab ? "bg-blue-600 text-white" : "text-white/50 hover:text-white"}`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {activeTab === "general" && (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 max-w-2xl">
          <h3 className="font-bold text-white mb-5">الإعدادات العامة</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">اسم الموقع</label>
              <input type="text" defaultValue="حسن جمال الليل" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">البريد الإلكتروني</label>
              <input type="email" defaultValue="hassan@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">رقم الهاتف / واتساب</label>
              <input type="tel" defaultValue="+966 5X XXX XXXX" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">اللغة الافتراضية</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                <option className="bg-[#0d1b2e]">العربية</option>
                <option className="bg-[#0d1b2e]">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">العملة</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                <option className="bg-[#0d1b2e]">USD - دولار أمريكي</option>
                <option className="bg-[#0d1b2e]">SAR - ريال سعودي</option>
                <option className="bg-[#0d1b2e]">AED - درهم إماراتي</option>
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer">
              حفظ التغييرات
            </button>
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 max-w-2xl">
          <h3 className="font-bold text-white mb-5">إعدادات SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">عنوان الصفحة الرئيسية</label>
              <input type="text" defaultValue="حسن جمال الليل | مصور ومونتير AI احترافي" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
              <p className="text-xs text-white/30 mt-1">60 حرف كحد أقصى</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">وصف الموقع (Meta Description)</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" rows={3} defaultValue="مصور ومونتير أفلام متخصص في الإنتاج البصري بالذكاء الاصطناعي. صور وأفلام سينمائية للعلامات التجارية." maxLength={160}></textarea>
              <p className="text-xs text-white/30 mt-1">160 حرف كحد أقصى</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">الكلمات المفتاحية</label>
              <input type="text" defaultValue="AI Photography, مصور AI, برومبت, Midjourney, تصوير منتجات" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Google Analytics ID</label>
              <input type="text" placeholder="G-XXXXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer">
              حفظ إعدادات SEO
            </button>
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 max-w-2xl">
          <h3 className="font-bold text-white mb-5">إعدادات الدفع</h3>
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-information-line"></i>
                </div>
                لتفعيل بوابة الدفع، يجب ربط Stripe أو PayPal من الإعدادات المتقدمة
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">بوابة الدفع</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                <option className="bg-[#0d1b2e]">Stripe</option>
                <option className="bg-[#0d1b2e]">PayPal</option>
                <option className="bg-[#0d1b2e]">تحويل بنكي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Stripe Public Key</label>
              <input type="text" placeholder="pk_live_..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <input type="checkbox" id="testMode" className="w-4 h-4 cursor-pointer accent-blue-500" />
              <label htmlFor="testMode" className="text-sm text-white/60 cursor-pointer">وضع الاختبار (Test Mode)</label>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer">
              حفظ إعدادات الدفع
            </button>
          </div>
        </div>
      )}

      {activeTab === "email" && (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 max-w-2xl">
          <h3 className="font-bold text-white mb-5">إعدادات البريد الإلكتروني</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">SMTP Host</label>
              <input type="text" placeholder="smtp.gmail.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">SMTP Port</label>
                <input type="text" placeholder="587" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">التشفير</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                  <option className="bg-[#0d1b2e]">TLS</option>
                  <option className="bg-[#0d1b2e]">SSL</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">البريد المرسل</label>
              <input type="email" placeholder="noreply@hassanjamal.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer">
              حفظ إعدادات البريد
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardSettingsPage;
