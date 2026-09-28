import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/base/Toast";

interface ContactItem {
  icon: string;
  label: string;
  value: string;
  sub: string;
  href: string;
  visible: boolean;
}

interface Faq {
  q: string;
  a: string;
  visible: boolean;
}

interface ContactContent {
  show_contact: boolean;
  show_consultation: boolean;
  contact_items: ContactItem[];
  contact_faqs: Faq[];
  whatsapp_number: string;
  whatsapp_consultation_message: string;
}

const emptyContact: ContactContent = {
  show_contact: true,
  show_consultation: true,
  contact_items: [],
  contact_faqs: [],
  whatsapp_number: "",
  whatsapp_consultation_message: "",
};

const iconOptions = [
  { value: "ri-mail-line", label: "البريد الإلكتروني" },
  { value: "ri-whatsapp-line", label: "واتساب" },
  { value: "ri-instagram-line", label: "إنستغرام" },
  { value: "ri-map-pin-line", label: "الموقع" },
  { value: "ri-global-line", label: "موقع إلكتروني" },
  { value: "ri-phone-line", label: "هاتف" },
  { value: "ri-youtube-line", label: "يوتيوب" },
  { value: "ri-twitter-x-line", label: "تويتر / X" },
  { value: "ri-tiktok-line", label: "تيك توك" },
  { value: "ri-facebook-line", label: "فيسبوك" },
  { value: "ri-linkedin-line", label: "لينكد إن" },
  { value: "ri-telegram-line", label: "تيليجرام" },
  { value: "ri-send-plane-line", label: "أخرى" },
];

const DashboardContactPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [content, setContent] = useState<ContactContent>(emptyContact);

  const fetchContact = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("show_contact, show_consultation, contact_items, contact_faqs, whatsapp_number, whatsapp_consultation_message")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setContent({
          show_contact: data.show_contact !== false,
          show_consultation: data.show_consultation !== false,
          contact_items: data.contact_items || [],
          contact_faqs: data.contact_faqs || [],
          whatsapp_number: data.whatsapp_number || "",
          whatsapp_consultation_message: data.whatsapp_consultation_message || "",
        });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "فشل تحميل محتوى التواصل" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContact(); }, [fetchContact]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase.from("site_settings").upsert({
        id: 1,
        show_contact: content.show_contact,
        show_consultation: content.show_consultation,
        contact_items: content.contact_items,
        contact_faqs: content.contact_faqs,
        whatsapp_number: content.whatsapp_number,
        whatsapp_consultation_message: content.whatsapp_consultation_message,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      showToast("تم حفظ إعدادات التواصل بنجاح", "success");
      setMessage({ type: "success", text: "تم حفظ إعدادات التواصل بنجاح" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "فشل حفظ إعدادات التواصل" });
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setContent((prev) => ({
      ...prev,
      contact_items: [...prev.contact_items, { icon: "ri-mail-line", label: "", value: "", sub: "", href: "", visible: true }],
    }));
  };
  const updateItem = (index: number, field: keyof ContactItem, value: string | boolean) => {
    setContent((prev) => {
      const updated = [...prev.contact_items];
      updated[index] = { ...updated[index], [field]: value } as ContactItem;
      return { ...prev, contact_items: updated };
    });
  };
  const removeItem = (index: number) => {
    setContent((prev) => ({ ...prev, contact_items: prev.contact_items.filter((_, i) => i !== index) }));
  };

  const addFaq = () => {
    setContent((prev) => ({
      ...prev,
      contact_faqs: [...prev.contact_faqs, { q: "", a: "", visible: true }],
    }));
  };
  const updateFaq = (index: number, field: keyof Faq, value: string | boolean) => {
    setContent((prev) => {
      const updated = [...prev.contact_faqs];
      updated[index] = { ...updated[index], [field]: value } as Faq;
      return { ...prev, contact_faqs: updated };
    });
  };
  const removeFaq = (index: number) => {
    setContent((prev) => ({ ...prev, contact_faqs: prev.contact_faqs.filter((_, i) => i !== index) }));
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors";
  const labelClass = "block text-sm font-medium text-white/70 mb-1";

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer flex-shrink-0 ${value ? "bg-emerald-500" : "bg-white/15"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${value ? "right-0.5" : "right-5"}`} />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-start justify-between flex-col sm:flex-row gap-4" dir="rtl">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة التواصل</h1>
          <p className="text-white/40 text-sm mt-1">تحكم بظهور صفحة التواصل ومعلومات الاتصال ورسالة الاستشارة المجانية</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              جاري الحفظ...
            </>
          ) : (
            <>
              <i className="ri-save-line"></i>
              حفظ الإعدادات
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`border rounded-xl p-4 mb-6 flex items-center gap-3 ${message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`} dir="rtl">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className={message.type === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"}></i></div>
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-6 max-w-4xl" dir="rtl">
          {/* Visibility toggle */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center"><i className="ri-eye-line text-orange-400"></i></div>
              <h3 className="font-bold text-white">إظهار / إخفاء صفحة التواصل</h3>
            </div>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0"><i className="ri-message-3-line text-white/60"></i></div>
                <div>
                  <span className="text-white text-sm font-medium block">صفحة التواصل</span>
                  <span className="text-white/30 text-xs">إظهار أو إخفاء صفحة التواصل بالكامل ورابطها في القائمة</span>
                </div>
              </div>
              <Toggle value={content.show_contact} onChange={() => setContent((prev) => ({ ...prev, show_contact: !prev.show_contact }))} />
            </div>
          </div>

          {/* Contact info items */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600/20 rounded-lg flex items-center justify-center"><i className="ri-contacts-line text-teal-400"></i></div>
                <h3 className="font-bold text-white">معلومات التواصل</h3>
              </div>
              <button onClick={addItem} className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></div>
                إضافة معلومة
              </button>
            </div>
            <p className="text-white/30 text-xs mb-5">البريد الإلكتروني، واتساب، إنستغرام، الموقع، وأي طريقة تواصل أخرى تظهر ككروت في صفحة التواصل</p>

            <div className="space-y-3">
              {content.contact_items.map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0"><i className={`${item.icon} text-white/70 text-lg`}></i></div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>الأيقونة</label>
                        <select value={item.icon} onChange={(e) => updateItem(index, "icon", e.target.value)} className={`${inputClass} cursor-pointer`}>
                          {iconOptions.map((o) => (<option key={o.value} value={o.value} className="bg-[#0d1b2e]">{o.label}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>العنوان</label>
                        <input type="text" value={item.label} onChange={(e) => updateItem(index, "label", e.target.value)} className={inputClass} placeholder="البريد الإلكتروني" />
                      </div>
                      <div>
                        <label className={labelClass}>القيمة</label>
                        <input type="text" value={item.value} onChange={(e) => updateItem(index, "value", e.target.value)} className={inputClass} placeholder="hassan@aiartist.com" />
                      </div>
                      <div>
                        <label className={labelClass}>الوصف الفرعي</label>
                        <input type="text" value={item.sub} onChange={(e) => updateItem(index, "sub", e.target.value)} className={inputClass} placeholder="رد خلال 24 ساعة" />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>الرابط (اختياري — يجعل الكرت قابلاً للنقر)</label>
                        <input type="text" value={item.href} onChange={(e) => updateItem(index, "href", e.target.value)} className={inputClass} placeholder="mailto:... أو https://wa.me/... أو https://instagram.com/..." />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Toggle value={item.visible} onChange={() => updateItem(index, "visible", !item.visible)} />
                      <button onClick={() => removeItem(index)} className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer" title="حذف"><i className="ri-delete-bin-line"></i></button>
                    </div>
                  </div>
                </div>
              ))}
              {content.contact_items.length === 0 && <p className="text-white/30 text-sm text-center py-4">لا توجد معلومات تواصل</p>}
            </div>
          </div>

          {/* Consultation WhatsApp */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center"><i className="ri-whatsapp-line text-emerald-400"></i></div>
                <h3 className="font-bold text-white">الاستشارة المجانية عبر واتساب</h3>
              </div>
              <Toggle value={content.show_consultation} onChange={() => setContent((prev) => ({ ...prev, show_consultation: !prev.show_consultation }))} />
            </div>
            <p className="text-white/30 text-xs mb-5">عند الضغط على "احجز الآن" في صفحة التواصل، يفتح واتساب برسالة جاهزة إلى هذا الرقم</p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>رقم الواتساب (بدون +)</label>
                <input type="text" value={content.whatsapp_number} onChange={(e) => setContent((prev) => ({ ...prev, whatsapp_number: e.target.value }))} className={inputClass} placeholder="966500000000" />
              </div>
              <div>
                <label className={labelClass}>نص الرسالة الجاهزة</label>
                <textarea value={content.whatsapp_consultation_message} onChange={(e) => setContent((prev) => ({ ...prev, whatsapp_consultation_message: e.target.value }))} className={`${inputClass} resize-none`} rows={3} placeholder="مرحباً حسن، أرغب بحجز استشارة مجانية لمناقشة مشروعي." />
                <p className="text-white/25 text-xs mt-1">هذه الرسالة تُرسل تلقائياً عند الضغط على "احجز الآن"</p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center"><i className="ri-question-answer-line text-purple-400"></i></div>
                <h3 className="font-bold text-white">الأسئلة الشائعة</h3>
              </div>
              <button onClick={addFaq} className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></div>
                إضافة سؤال
              </button>
            </div>
            <p className="text-white/30 text-xs mb-5">قسم "الأسئلة الشائعة" في صفحة التواصل — أضف، عدّل، احذف، أو أخفي أي سؤال</p>

            <div className="space-y-3">
              {content.contact_faqs.map((faq, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className={labelClass}>السؤال</label>
                        <input type="text" value={faq.q} onChange={(e) => updateFaq(index, "q", e.target.value)} className={inputClass} placeholder="كم يستغرق تنفيذ المشروع؟" />
                      </div>
                      <div>
                        <label className={labelClass}>الإجابة</label>
                        <textarea value={faq.a} onChange={(e) => updateFaq(index, "a", e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="اكتب الإجابة هنا..." />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Toggle value={faq.visible} onChange={() => updateFaq(index, "visible", !faq.visible)} />
                      <button onClick={() => removeFaq(index)} className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer" title="حذف"><i className="ri-delete-bin-line"></i></button>
                    </div>
                  </div>
                </div>
              ))}
              {content.contact_faqs.length === 0 && <p className="text-white/30 text-sm text-center py-4">لا توجد أسئلة شائعة</p>}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardContactPage;