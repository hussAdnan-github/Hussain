import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/base/Toast";

interface SiteSettings {
  hero_title: string;
  hero_title_highlight: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_photo_url: string;
  hero_tools: { name: string; icon: string }[];
  about_name: string;
  about_title: string;
  about_heading: string;
  about_title_highlight: string;
  about_bio_1: string;
  about_bio_2: string;
  about_years_exp: string;
  about_photo_url: string;
  about_specializations: { icon: string; label: string }[];
  about_tools: string[];
  about_timeline: { year: string; title: string; desc: string }[];
  navbar_logo_text: string;
  navbar_logo_subtitle: string;
  navbar_logo_url: string;
  whatsapp_number: string;
  email_address: string;
  show_blog: boolean;
  show_books: boolean;
  show_portfolio: boolean;
  show_services: boolean;
  show_prompts: boolean;
}

const defaultSettings: SiteSettings = {
  hero_title: "",
  hero_title_highlight: "",
  hero_subtitle: "",
  hero_badge: "",
  hero_photo_url: "",
  hero_tools: [],
  about_name: "",
  about_title: "",
  about_heading: "أدمج الحس البصري مع",
  about_title_highlight: "",
  about_bio_1: "",
  about_bio_2: "",
  about_years_exp: "",
  about_photo_url: "",
  about_specializations: [],
  about_tools: [],
  about_timeline: [],
  navbar_logo_text: "",
  navbar_logo_subtitle: "",
  navbar_logo_url: "",
  whatsapp_number: "",
  email_address: "",
  show_blog: true,
  show_books: true,
  show_portfolio: true,
  show_services: true,
  show_prompts: true,
};

const DashboardSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "payment" | "email">("content");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [form, setForm] = useState<SiteSettings>(defaultSettings);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingHeroPhoto, setUploadingHeroPhoto] = useState(false);

  // Text-based fields for textarea editing
  const [heroToolsText, setHeroToolsText] = useState("");
  const [aboutToolsText, setAboutToolsText] = useState("");
  const [specializationsText, setSpecializationsText] = useState("");
  const [timelineText, setTimelineText] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setForm(defaultSettings);
        setLoading(false);
        return;
      }

      const settings: SiteSettings = {
        hero_title: data.hero_title || "",
        hero_title_highlight: data.hero_title_highlight || "",
        hero_subtitle: data.hero_subtitle || "",
        hero_badge: data.hero_badge || "",
        hero_photo_url: data.hero_photo_url || "",
        hero_tools: data.hero_tools || [],
        about_name: data.about_name || "",
        about_title: data.about_title || "",
        about_heading: data.about_heading || "أدمج الحس البصري مع",
        about_title_highlight: data.about_title_highlight || "",
        about_bio_1: data.about_bio_1 || "",
        about_bio_2: data.about_bio_2 || "",
        about_years_exp: data.about_years_exp || "",
        about_photo_url: data.about_photo_url || "",
        about_specializations: data.about_specializations || [],
        about_tools: data.about_tools || [],
        about_timeline: data.about_timeline || [],
        navbar_logo_text: data.navbar_logo_text || "",
        navbar_logo_subtitle: data.navbar_logo_subtitle || "",
        navbar_logo_url: data.navbar_logo_url || "",
        whatsapp_number: data.whatsapp_number || "",
        email_address: data.email_address || "",
        show_blog: data.show_blog !== false,
        show_books: data.show_books !== false,
        show_portfolio: data.show_portfolio !== false,
        show_services: data.show_services !== false,
        show_prompts: data.show_prompts !== false,
      };

      setForm(settings);
        setHeroToolsText(settings.hero_tools.map((t: { name: string; icon: string }) => `${t.name}|${t.icon}`).join("\n"));
      setAboutToolsText(settings.about_tools.join("\n"));
      setSpecializationsText(settings.about_specializations.map((s: { icon: string; label: string }) => `${s.label}|${s.icon}`).join("\n"));
      setTimelineText(settings.about_timeline.map((t: { year: string; title: string; desc: string }) => `${t.year}|${t.title}|${t.desc}`).join("\n"));
    } catch {
      setMessage({ type: "error", text: "فشل تحميل الإعدادات" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const heroTools = heroToolsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split("|");
          return { name: parts[0]?.trim() || "", icon: parts[1]?.trim() || "ri-tools-line" };
        });

      const aboutTools = aboutToolsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const specializations = specializationsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split("|");
          return { label: parts[0]?.trim() || "", icon: parts[1]?.trim() || "ri-star-line" };
        });

      const timeline = timelineText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split("|");
          return { year: parts[0]?.trim() || "", title: parts[1]?.trim() || "", desc: parts[2]?.trim() || "" };
        });

      const { error } = await supabase
        .from("site_settings")
        .upsert({
          id: 1,
          hero_title: form.hero_title,
          hero_title_highlight: form.hero_title_highlight,
          hero_subtitle: form.hero_subtitle,
          hero_badge: form.hero_badge,
          hero_photo_url: form.hero_photo_url,
          hero_tools: heroTools,
          about_name: form.about_name,
          about_title: form.about_title,
          about_heading: form.about_heading,
          about_title_highlight: form.about_title_highlight,
          about_bio_1: form.about_bio_1,
          about_bio_2: form.about_bio_2,
          about_years_exp: form.about_years_exp,
          about_photo_url: form.about_photo_url,
          about_specializations: specializations,
          about_tools: aboutTools,
          about_timeline: timeline,
          navbar_logo_text: form.navbar_logo_text,
          navbar_logo_subtitle: form.navbar_logo_subtitle,
          navbar_logo_url: form.navbar_logo_url,
          whatsapp_number: form.whatsapp_number,
          email_address: form.email_address,
          show_blog: form.show_blog,
          show_books: form.show_books,
          show_portfolio: form.show_portfolio,
          show_services: form.show_services,
          show_prompts: form.show_prompts,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      showToast("تم حفظ جميع الإعدادات بنجاح", "success");
      setMessage({ type: "success", text: "تم حفظ جميع الإعدادات بنجاح! 🎉" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "فشل حفظ الإعدادات" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SiteSettings, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (file: File, field: "about_photo_url" | "hero_photo_url") => {
    const setUploading = field === "about_photo_url" ? setUploadingPhoto : setUploadingHeroPhoto;
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop() || "png";
      const fileName = `site-photos/${field === "about_photo_url" ? "about" : "hero"}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("public").upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("public").getPublicUrl(fileName);
      if (urlData?.publicUrl) {
        updateField(field, urlData.publicUrl);
        showToast("تم رفع الصورة بنجاح", "success");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل رفع الصورة";
      setMessage({ type: "error", text: msg });
    } finally {
      setUploading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors";
  const textareaClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors resize-none";
  const labelClass = "block text-sm font-medium text-white/70 mb-1.5";
  const hintClass = "text-white/25 text-xs mt-1";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6" dir="rtl">
        <h1 className="text-2xl font-black text-white">إعدادات الموقع</h1>
        <p className="text-white/40 text-sm mt-1">تحكم بكل محتوى الموقع من مكان واحد</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-8 flex-wrap" dir="rtl">
        {(["content", "seo", "payment", "email"] as const).map((tab) => {
          const labels: Record<string, string> = { content: "محتوى الموقع", seo: "SEO", payment: "الدفع", email: "البريد" };
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

      {/* Status Message */}
      {message && (
        <div className={`border rounded-xl p-4 mb-6 flex items-center gap-3 max-w-3xl ${message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`} dir="rtl">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i className={message.type === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"}></i>
          </div>
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {activeTab === "content" && (
        <div className="space-y-6 max-w-3xl" dir="rtl">
          {/* ===== SECTION TOGGLES ===== */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <i className="ri-toggle-line text-orange-400"></i>
              </div>
              <h3 className="font-bold text-white">إظهار / إخفاء الأقسام</h3>
            </div>
            <p className="text-white/30 text-xs mb-5">تحكم في ظهور وإخفاء الأقسام في الموقع وصفحاتها الفرعية</p>

            <div className="space-y-3">
              {([
                { key: "show_blog" as keyof SiteSettings, icon: "ri-article-line", label: "المدونة", desc: "صفحة المدونة وقسم المقالات في الرئيسية" },
                { key: "show_books" as keyof SiteSettings, icon: "ri-book-open-line", label: "الكتب", desc: "صفحة المتجر وقسم الكتب في الرئيسية" },
                { key: "show_portfolio" as keyof SiteSettings, icon: "ri-gallery-line", label: "الأعمال", desc: "صفحة الأعمال وقسم البورتفوليو في الرئيسية" },
                { key: "show_services" as keyof SiteSettings, icon: "ri-briefcase-4-line", label: "الخدمات", desc: "صفحة الخدمات وقسم الخدمات في الرئيسية" },
                { key: "show_prompts" as keyof SiteSettings, icon: "ri-code-box-line", label: "البرومبتات", desc: "صفحة معرض البرومبتات وقسم المولد في الرئيسية" },
              ] as { key: keyof SiteSettings; icon: string; label: string; desc: string }[]).map((section) => (
                <div key={section.key} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`${section.icon} text-white/60`}></i>
                    </div>
                    <div>
                      <span className="text-white text-sm font-medium block">{section.label}</span>
                      <span className="text-white/30 text-xs">{section.desc}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => updateField(section.key, !form[section.key])}
                    className={`relative w-12 h-7 rounded-full transition-all duration-300 cursor-pointer flex-shrink-0 ${
                      form[section.key] ? "bg-emerald-500" : "bg-white/15"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ${
                        form[section.key] ? "right-0.5" : "right-5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ===== HERO SECTION ===== */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <i className="ri-home-4-line text-blue-400"></i>
              </div>
              <h3 className="font-bold text-white">قسم البطل (Hero)</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>النص الرئيسي (العنوان الكامل)</label>
                <input type="text" value={form.hero_title} onChange={(e) => updateField("hero_title", e.target.value)} className={inputClass} placeholder="من فكرة خام إلى مشهد سينمائي جاهز للنشر باستخدام AI" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>الكلمة المظللة في العنوان</label>
                  <input type="text" value={form.hero_title_highlight} onChange={(e) => updateField("hero_title_highlight", e.target.value)} className={inputClass} placeholder="مشهد سينمائي" />
                  <p className={hintClass}>الجزء الذي يظهر بلون مختلف في العنوان</p>
                </div>
                <div>
                  <label className={labelClass}>الشارة العلوية</label>
                  <input type="text" value={form.hero_badge} onChange={(e) => updateField("hero_badge", e.target.value)} className={inputClass} placeholder="فني AI" />
                </div>
              </div>
              <div>
                <label className={labelClass}>النص الفرعي</label>
                <textarea value={form.hero_subtitle} onChange={(e) => updateField("hero_subtitle", e.target.value)} className={textareaClass} rows={3} placeholder="أصنع صورًا واعلانات سينمائية..." maxLength={200}></textarea>
                <p className={hintClass}>200 حرف كحد أقصى</p>
              </div>
              <div>
                <label className={labelClass}>الصورة الشخصية (Hero)</label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-white/15 bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {form.hero_photo_url ? (
                      <img src={form.hero_photo_url} alt="صورة Hero" className="w-full h-full object-cover" />
                    ) : (
                      <i className="ri-image-line text-white/20 text-3xl"></i>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="relative cursor-pointer">
                      <span className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap">
                        {uploadingHeroPhoto ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            جاري الرفع...
                          </>
                        ) : (
                          <>
                            <i className="ri-upload-cloud-2-line"></i>
                            رفع صورة جديدة
                          </>
                        )}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingHeroPhoto}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file, "hero_photo_url");
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      value={form.hero_photo_url}
                      onChange={(e) => updateField("hero_photo_url", e.target.value)}
                      className={inputClass}
                      placeholder="أو الصق رابط الصورة هنا..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== ABOUT SECTION ===== */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <i className="ri-user-3-line text-emerald-400"></i>
              </div>
              <h3 className="font-bold text-white">قسم من أنا</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>الاسم</label>
                  <input type="text" value={form.about_name} onChange={(e) => updateField("about_name", e.target.value)} className={inputClass} placeholder="حسن جمال الليل" />
                </div>
                <div>
                  <label className={labelClass}>المسمى الوظيفي</label>
                  <input type="text" value={form.about_title} onChange={(e) => updateField("about_title", e.target.value)} className={inputClass} placeholder="فني AI" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>مقدمة العنوان</label>
                  <input type="text" value={form.about_heading} onChange={(e) => updateField("about_heading", e.target.value)} className={inputClass} placeholder="أدمج الحس البصري مع" />
                </div>
                <div>
                  <label className={labelClass}>الكلمة المظللة في العنوان</label>
                  <input type="text" value={form.about_title_highlight} onChange={(e) => updateField("about_title_highlight", e.target.value)} className={inputClass} placeholder="قوة الذكاء الاصطناعي" />
                </div>
              </div>
              <div>
                <label className={labelClass}>النص التعريفي الأول</label>
                <textarea value={form.about_bio_1} onChange={(e) => updateField("about_bio_1", e.target.value)} className={textareaClass} rows={3} placeholder="أنا حسن جمال الليل، فني AI..." maxLength={500}></textarea>
                <p className={hintClass}>500 حرف كحد أقصى</p>
              </div>
              <div>
                <label className={labelClass}>النص التعريفي الثاني</label>
                <textarea value={form.about_bio_2} onChange={(e) => updateField("about_bio_2", e.target.value)} className={textareaClass} rows={3} placeholder="أدمج بين الحس البصري..." maxLength={500}></textarea>
                <p className={hintClass}>500 حرف كحد أقصى</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>سنوات الخبرة</label>
                  <input type="text" value={form.about_years_exp} onChange={(e) => updateField("about_years_exp", e.target.value)} className={inputClass} placeholder="7+" />
                </div>
              <div>
                <label className={labelClass}>الصورة الشخصية</label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-xl border-2 border-dashed border-white/15 bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {form.about_photo_url ? (
                      <img src={form.about_photo_url} alt="الصورة الشخصية" className="w-full h-full object-cover" />
                    ) : (
                      <i className="ri-user-3-line text-white/20 text-3xl"></i>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="relative cursor-pointer">
                      <span className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap">
                        {uploadingPhoto ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            جاري الرفع...
                          </>
                        ) : (
                          <>
                            <i className="ri-upload-cloud-2-line"></i>
                            رفع صورة جديدة
                          </>
                        )}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingPhoto}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(file, "about_photo_url");
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      value={form.about_photo_url}
                      onChange={(e) => updateField("about_photo_url", e.target.value)}
                      className={inputClass}
                      placeholder="أو الصق رابط الصورة هنا..."
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* ===== TOOLS SECTION ===== */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-amber-600/20 rounded-lg flex items-center justify-center">
                <i className="ri-tools-line text-amber-400"></i>
              </div>
              <h3 className="font-bold text-white">قائمة الأدوات</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>أدوات Hero (مع أيقونات)</label>
                <textarea value={heroToolsText} onChange={(e) => setHeroToolsText(e.target.value)} className={textareaClass} rows={4} placeholder="Nano Banana|ri-image-ai-line&#10;Seedance|ri-film-ai-line&#10;Kling|ri-video-ai-line&#10;Premiere|ri-scissors-cut-line"></textarea>
                <p className={hintClass}>كل سطر: اسم الأداة|أيقونة (Remix Icon). مثال: Nano Banana|ri-image-ai-line</p>
              </div>
              <div>
                <label className={labelClass}>أدوات About (نص فقط)</label>
                <textarea value={aboutToolsText} onChange={(e) => setAboutToolsText(e.target.value)} className={textareaClass} rows={4} placeholder="Claude Code&#10;Chat GPT&#10;Nano Banana&#10;Seedance&#10;Kling&#10;Premiere"></textarea>
                <p className={hintClass}>كل سطر اسم أداة واحدة</p>
              </div>
            </div>
          </div>

          {/* ===== SPECIALIZATIONS ===== */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <i className="ri-award-line text-purple-400"></i>
              </div>
              <h3 className="font-bold text-white">التخصصات</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>قائمة التخصصات</label>
                <textarea value={specializationsText} onChange={(e) => setSpecializationsText(e.target.value)} className={textareaClass} rows={4} placeholder="AI Photography|ri-camera-ai-line&#10;Film Editing|ri-film-line&#10;Prompt Engineering|ri-code-s-slash-line&#10;Visual Direction|ri-palette-line"></textarea>
                <p className={hintClass}>كل سطر: اسم التخصص|أيقونة (Remix Icon). مثال: AI Photography|ri-camera-ai-line</p>
              </div>
            </div>
          </div>

          {/* ===== TIMELINE ===== */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-rose-600/20 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-rose-400"></i>
              </div>
              <h3 className="font-bold text-white">الخط الزمني (صفحة عن حسن)</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>محطات الخط الزمني</label>
                <textarea value={timelineText} onChange={(e) => setTimelineText(e.target.value)} className={textareaClass} rows={6} placeholder="2017|بداية الرحلة|بدأت كمصور تقليدي...&#10;2019|دخول عالم المونتاج|تخصصت في مونتاج الأفلام...&#10;2022|اكتشاف AI|بدأت تجربة Midjourney...&#10;2023|التحول الكامل|انتقلت للعمل بالكامل...&#10;2024|خبير معتمد|+200 مشروع منجز..."></textarea>
                <p className={hintClass}>كل سطر: السنة|العنوان|الوصف. مفصولة بـ |</p>
              </div>
            </div>
          </div>

          {/* ===== NAVBAR & CONTACT ===== */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <i className="ri-menu-2-line text-cyan-400"></i>
              </div>
              <h3 className="font-bold text-white">الشعار والتواصل</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>نص الشعار</label>
                  <input type="text" value={form.navbar_logo_text} onChange={(e) => updateField("navbar_logo_text", e.target.value)} className={inputClass} placeholder="حسن جمال الليل" />
                </div>
                <div>
                  <label className={labelClass}>نص أسفل الشعار</label>
                  <input type="text" value={form.navbar_logo_subtitle} onChange={(e) => updateField("navbar_logo_subtitle", e.target.value)} className={inputClass} placeholder="فني AI" />
                </div>
              </div>
              <div>
                <label className={labelClass}>رابط صورة الشعار</label>
                <input type="url" value={form.navbar_logo_url} onChange={(e) => updateField("navbar_logo_url", e.target.value)} className={inputClass} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>رقم الواتساب (دون +)</label>
                  <input type="text" value={form.whatsapp_number} onChange={(e) => updateField("whatsapp_number", e.target.value)} className={inputClass} placeholder="966500000000" />
                </div>
                <div>
                  <label className={labelClass}>البريد الإلكتروني</label>
                  <input type="email" value={form.email_address} onChange={(e) => updateField("email_address", e.target.value)} className={inputClass} placeholder="hassan@example.com" />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-2 pb-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  جاري الحفظ...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <i className="ri-save-line"></i>
                  حفظ جميع الإعدادات
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 max-w-2xl" dir="rtl">
          <h3 className="font-bold text-white mb-5">إعدادات SEO</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>عنوان الصفحة الرئيسية</label>
              <input type="text" defaultValue="حسن جمال الليل | مصور ومونتير AI احترافي" className={inputClass} />
              <p className={hintClass}>60 حرف كحد أقصى</p>
            </div>
            <div>
              <label className={labelClass}>وصف الموقع (Meta Description)</label>
              <textarea className={textareaClass} rows={3} defaultValue="مصور ومونتير أفلام متخصص في الإنتاج البصري بالذكاء الاصطناعي. صور وأفلام سينمائية للعلامات التجارية." maxLength={160}></textarea>
              <p className={hintClass}>160 حرف كحد أقصى</p>
            </div>
            <div>
              <label className={labelClass}>الكلمات المفتاحية</label>
              <input type="text" defaultValue="AI Photography, مصور AI, برومبت, Midjourney, تصوير منتجات" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Google Analytics ID</label>
              <input type="text" placeholder="G-XXXXXXXXXX" className={inputClass} />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm">
              حفظ إعدادات SEO
            </button>
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 max-w-2xl" dir="rtl">
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
              <label className={labelClass}>بوابة الدفع</label>
              <select className={`${inputClass} cursor-pointer`}>
                <option className="bg-[#0d1b2e]">Stripe</option>
                <option className="bg-[#0d1b2e]">PayPal</option>
                <option className="bg-[#0d1b2e]">تحويل بنكي</option>
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm">
              حفظ إعدادات الدفع
            </button>
          </div>
        </div>
      )}

      {activeTab === "email" && (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 max-w-2xl" dir="rtl">
          <h3 className="font-bold text-white mb-5">إعدادات البريد الإلكتروني</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>SMTP Host</label>
              <input type="text" placeholder="smtp.gmail.com" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>SMTP Port</label>
                <input type="text" placeholder="587" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>التشفير</label>
                <select className={`${inputClass} cursor-pointer`}>
                  <option className="bg-[#0d1b2e]">TLS</option>
                  <option className="bg-[#0d1b2e]">SSL</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>البريد المرسل</label>
              <input type="email" placeholder="noreply@hassanjamal.com" className={inputClass} />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm">
              حفظ إعدادات البريد
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardSettingsPage;