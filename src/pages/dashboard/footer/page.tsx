import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/base/Toast";

interface SocialLink { icon: string; label: string; url: string; visible: boolean; }
interface FooterLink { label: string; href: string; page_key: string; visible: boolean; }
interface FooterColumn { title: string; visible: boolean; links: FooterLink[]; }
interface BottomLink { label: string; href: string; visible: boolean; }

interface FooterContent {
  footer_description: string;
  footer_social_links: SocialLink[];
  footer_columns: FooterColumn[];
  footer_copyright: string;
  footer_bottom_links: BottomLink[];
}

const emptyFooter: FooterContent = {
  footer_description: "",
  footer_social_links: [],
  footer_columns: [],
  footer_copyright: "",
  footer_bottom_links: [],
};

const socialIconOptions = [
  { value: "ri-instagram-line", label: "Instagram" },
  { value: "ri-youtube-line", label: "YouTube" },
  { value: "ri-twitter-x-line", label: "Twitter / X" },
  { value: "ri-tiktok-line", label: "TikTok" },
  { value: "ri-facebook-line", label: "Facebook" },
  { value: "ri-linkedin-line", label: "LinkedIn" },
  { value: "ri-whatsapp-line", label: "WhatsApp" },
  { value: "ri-telegram-line", label: "Telegram" },
  { value: "ri-dribbble-line", label: "Dribbble" },
  { value: "ri-behance-line", label: "Behance" },
  { value: "ri-global-line", label: "موقع إلكتروني" },
];

const pageKeyOptions = [
  { value: "", label: "بدون ربط (دائم الظهور)" },
  { value: "blog", label: "المدونة" },
  { value: "books", label: "المتجر" },
  { value: "portfolio", label: "الأعمال" },
  { value: "services", label: "الخدمات" },
  { value: "prompts", label: "مولد البرومبت" },
  { value: "contact", label: "التواصل" },
];

const DashboardFooterPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [content, setContent] = useState<FooterContent>(emptyFooter);

  const fetchFooter = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("footer_description, footer_social_links, footer_columns, footer_copyright, footer_bottom_links")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setContent({
          footer_description: data.footer_description || "",
          footer_social_links: data.footer_social_links || [],
          footer_columns: data.footer_columns || [],
          footer_copyright: data.footer_copyright || "",
          footer_bottom_links: data.footer_bottom_links || [],
        });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "فشل تحميل محتوى الفوتر" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFooter(); }, [fetchFooter]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase.from("site_settings").upsert({
        id: 1,
        footer_description: content.footer_description,
        footer_social_links: content.footer_social_links,
        footer_columns: content.footer_columns,
        footer_copyright: content.footer_copyright,
        footer_bottom_links: content.footer_bottom_links,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      showToast("تم حفظ محتوى الفوتر بنجاح", "success");
      setMessage({ type: "success", text: "تم حفظ محتوى الفوتر بنجاح" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "فشل حفظ محتوى الفوتر" });
    } finally {
      setSaving(false);
    }
  };

  // Social links
  const addSocial = () => {
    setContent((prev) => ({ ...prev, footer_social_links: [...prev.footer_social_links, { icon: "ri-instagram-line", label: "", url: "", visible: true }] }));
  };
  const updateSocial = (index: number, field: keyof SocialLink, value: string | boolean) => {
    setContent((prev) => {
      const updated = [...prev.footer_social_links];
      updated[index] = { ...updated[index], [field]: value } as SocialLink;
      return { ...prev, footer_social_links: updated };
    });
  };
  const removeSocial = (index: number) => {
    setContent((prev) => ({ ...prev, footer_social_links: prev.footer_social_links.filter((_, i) => i !== index) }));
  };

  // Columns
  const addColumn = () => {
    setContent((prev) => ({ ...prev, footer_columns: [...prev.footer_columns, { title: "", visible: true, links: [] }] }));
  };
  const updateColumn = (index: number, field: "title" | "visible", value: string | boolean) => {
    setContent((prev) => {
      const updated = [...prev.footer_columns];
      updated[index] = { ...updated[index], [field]: value } as FooterColumn;
      return { ...prev, footer_columns: updated };
    });
  };
  const removeColumn = (index: number) => {
    setContent((prev) => ({ ...prev, footer_columns: prev.footer_columns.filter((_, i) => i !== index) }));
  };

  // Column links
  const addLink = (colIndex: number) => {
    setContent((prev) => {
      const updated = [...prev.footer_columns];
      updated[colIndex] = { ...updated[colIndex], links: [...updated[colIndex].links, { label: "", href: "", page_key: "", visible: true }] };
      return { ...prev, footer_columns: updated };
    });
  };
  const updateLink = (colIndex: number, linkIndex: number, field: keyof FooterLink, value: string | boolean) => {
    setContent((prev) => {
      const updated = [...prev.footer_columns];
      const links = [...updated[colIndex].links];
      links[linkIndex] = { ...links[linkIndex], [field]: value } as FooterLink;
      updated[colIndex] = { ...updated[colIndex], links };
      return { ...prev, footer_columns: updated };
    });
  };
  const removeLink = (colIndex: number, linkIndex: number) => {
    setContent((prev) => {
      const updated = [...prev.footer_columns];
      updated[colIndex] = { ...updated[colIndex], links: updated[colIndex].links.filter((_, i) => i !== linkIndex) };
      return { ...prev, footer_columns: updated };
    });
  };

  // Bottom links
  const addBottomLink = () => {
    setContent((prev) => ({ ...prev, footer_bottom_links: [...prev.footer_bottom_links, { label: "", href: "", visible: true }] }));
  };
  const updateBottomLink = (index: number, field: keyof BottomLink, value: string | boolean) => {
    setContent((prev) => {
      const updated = [...prev.footer_bottom_links];
      updated[index] = { ...updated[index], [field]: value } as BottomLink;
      return { ...prev, footer_bottom_links: updated };
    });
  };
  const removeBottomLink = (index: number) => {
    setContent((prev) => ({ ...prev, footer_bottom_links: prev.footer_bottom_links.filter((_, i) => i !== index) }));
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
          <h1 className="text-2xl font-black text-white">إدارة الفوتر</h1>
          <p className="text-white/40 text-sm mt-1">تحكم كامل بمحتوى الفوتر: الوصف، روابط التواصل الاجتماعي، أعمدة الروابط، والروابط السفلية</p>
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
              حفظ الفوتر
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
          {/* Auto-hide notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 text-sm flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5"><i className="ri-information-line"></i></div>
            <p>عند ربط رابط بصفحة معينة (مثل المدونة أو المتجر)، سيختفي هذا الرابط تلقائياً من الفوتر إذا قمت بإخفاء تلك الصفحة من إعدادات الموقع.</p>
          </div>

          {/* Brand info */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center"><i className="ri-quote-text text-blue-400"></i></div>
              <h3 className="font-bold text-white">وصف العلامة وحقوق النشر</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>وصف مختصر عن العلامة</label>
                <textarea value={content.footer_description} onChange={(e) => setContent((prev) => ({ ...prev, footer_description: e.target.value }))} className={inputClass} rows={3} maxLength={300} placeholder="نبذة مختصرة تظهر بجانب الشعار" />
              </div>
              <div>
                <label className={labelClass}>نص حقوق النشر</label>
                <input type="text" value={content.footer_copyright} onChange={(e) => setContent((prev) => ({ ...prev, footer_copyright: e.target.value }))} className={inputClass} placeholder="© 2026 حسن جمال الليل. جميع الحقوق محفوظة." />
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-600/20 rounded-lg flex items-center justify-center"><i className="ri-share-line text-pink-400"></i></div>
                <h3 className="font-bold text-white">روابط التواصل الاجتماعي</h3>
              </div>
              <button onClick={addSocial} className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></div>
                إضافة منصة
              </button>
            </div>

            <div className="space-y-3">
              {content.footer_social_links.map((social, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0"><i className={`${social.icon} text-white/70 text-lg`}></i></div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>المنصة (الأيقونة)</label>
                        <select value={social.icon} onChange={(e) => updateSocial(index, "icon", e.target.value)} className={`${inputClass} cursor-pointer`}>
                          {socialIconOptions.map((o) => (<option key={o.value} value={o.value} className="bg-[#0d1b2e]">{o.label}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>الاسم الظاهر</label>
                        <input type="text" value={social.label} onChange={(e) => updateSocial(index, "label", e.target.value)} className={inputClass} placeholder="Instagram" />
                      </div>
                      <div>
                        <label className={labelClass}>الرابط</label>
                        <input type="text" value={social.url} onChange={(e) => updateSocial(index, "url", e.target.value)} className={inputClass} placeholder="https://instagram.com/..." />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Toggle value={social.visible} onChange={() => updateSocial(index, "visible", !social.visible)} />
                      <button onClick={() => removeSocial(index)} className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer" title="حذف"><i className="ri-delete-bin-line"></i></button>
                    </div>
                  </div>
                </div>
              ))}
              {content.footer_social_links.length === 0 && <p className="text-white/30 text-sm text-center py-4">لا توجد منصات تواصل</p>}
            </div>
          </div>

          {/* Link columns */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600/20 rounded-lg flex items-center justify-center"><i className="ri-links-line text-teal-400"></i></div>
                <h3 className="font-bold text-white">أعمدة الروابط</h3>
              </div>
              <button onClick={addColumn} className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></div>
                إضافة عمود
              </button>
            </div>

            <div className="space-y-4">
              {content.footer_columns.map((column, colIndex) => (
                <div key={colIndex} className="border border-white/10 rounded-xl overflow-hidden">
                  <div className="bg-white/5 px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3">
                      <input type="text" value={column.title} onChange={(e) => updateColumn(colIndex, "title", e.target.value)} className={`${inputClass} max-w-xs`} placeholder="عنوان العمود" />
                      <span className="text-white/30 text-xs whitespace-nowrap">{column.links.length} رابط</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Toggle value={column.visible} onChange={() => updateColumn(colIndex, "visible", !column.visible)} />
                      <button onClick={() => removeColumn(colIndex)} className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer" title="حذف العمود"><i className="ri-delete-bin-line"></i></button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>النص</label>
                              <input type="text" value={link.label} onChange={(e) => updateLink(colIndex, linkIndex, "label", e.target.value)} className={inputClass} placeholder="اسم الرابط" />
                            </div>
                            <div>
                              <label className={labelClass}>الرابط</label>
                              <input type="text" value={link.href} onChange={(e) => updateLink(colIndex, linkIndex, "href", e.target.value)} className={inputClass} placeholder="/blog أو https://..." />
                            </div>
                            <div>
                              <label className={labelClass}>مرتبط بصفحة (إخفاء تلقائي)</label>
                              <select value={link.page_key} onChange={(e) => updateLink(colIndex, linkIndex, "page_key", e.target.value)} className={`${inputClass} cursor-pointer`}>
                                {pageKeyOptions.map((o) => (<option key={o.value} value={o.value} className="bg-[#0d1b2e]">{o.label}</option>))}
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Toggle value={link.visible} onChange={() => updateLink(colIndex, linkIndex, "visible", !link.visible)} />
                            <button onClick={() => removeLink(colIndex, linkIndex)} className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer" title="حذف الرابط"><i className="ri-close-line"></i></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {column.links.length === 0 && <p className="text-white/30 text-xs text-center py-2">لا توجد روابط في هذا العمود</p>}
                    <button onClick={() => addLink(colIndex)} className="w-full border border-dashed border-white/15 hover:border-white/30 text-white/60 hover:text-white py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      <i className="ri-add-line"></i>
                      إضافة رابط
                    </button>
                  </div>
                </div>
              ))}
              {content.footer_columns.length === 0 && <p className="text-white/30 text-sm text-center py-4">لا توجد أعمدة</p>}
            </div>
          </div>

          {/* Bottom links */}
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center"><i className="ri-file-list-3-line text-emerald-400"></i></div>
                <h3 className="font-bold text-white">الروابط السفلية</h3>
              </div>
              <button onClick={addBottomLink} className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-add-line"></i></div>
                إضافة رابط
              </button>
            </div>

            <div className="space-y-3">
              {content.footer_bottom_links.map((link, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>النص</label>
                      <input type="text" value={link.label} onChange={(e) => updateBottomLink(index, "label", e.target.value)} className={inputClass} placeholder="سياسة الخصوصية" />
                    </div>
                    <div>
                      <label className={labelClass}>الرابط</label>
                      <input type="text" value={link.href} onChange={(e) => updateBottomLink(index, "href", e.target.value)} className={inputClass} placeholder="/privacy أو https://..." />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Toggle value={link.visible} onChange={() => updateBottomLink(index, "visible", !link.visible)} />
                    <button onClick={() => removeBottomLink(index)} className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer" title="حذف"><i className="ri-close-line"></i></button>
                  </div>
                </div>
              ))}
              {content.footer_bottom_links.length === 0 && <p className="text-white/30 text-sm text-center py-4">لا توجد روابط سفلية</p>}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardFooterPage;