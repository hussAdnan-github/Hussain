import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Testimonial {
  id: string;
  client_name: string;
  client_role: string | null;
  client_avatar: string | null;
  content: string | null;
  rating: number | null;
  featured: boolean | null;
  created_at: string | null;
}

interface TestimonialForm {
  client_name: string;
  client_role: string;
  client_avatar: string;
  content: string;
  rating: number;
  featured: boolean;
}

const emptyForm: TestimonialForm = {
  client_name: "", client_role: "", client_avatar: "", content: "", rating: 5, featured: false,
};

const DashboardClientsPage = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFeatured, setFilterFeatured] = useState(""); // "" | "مميز" | "عادي"
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase.from("testimonials").select("*");

      if (searchQuery) query = query.ilike("client_name", `%${searchQuery}%`);
      if (filterFeatured === "مميز") query = query.eq("featured", true);
      else if (filterFeatured === "عادي") query = query.eq("featured", false);

      query = query.order("created_at", { ascending: false });

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setTestimonials(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally { setLoading(false); }
  }, [searchQuery, filterFeatured]);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const handleSearch = () => setSearchQuery(searchInput);
  const handleClear = () => { setSearchInput(""); setSearchQuery(""); setFilterFeatured(""); };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(data.path);
      setForm({ ...form, client_avatar: publicData.publicUrl });
    } catch {
      setError("فشل رفع الصورة");
    } finally { setUploading(false); }
  };

  const openAddModal = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };

  const openEditModal = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({ client_name: t.client_name, client_role: t.client_role || "", client_avatar: t.client_avatar || "", content: t.content || "", rating: t.rating || 5, featured: t.featured || false });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.client_name.trim()) return;
    setSaving(true);
    const payload = { client_name: form.client_name.trim(), client_role: form.client_role || null, client_avatar: form.client_avatar || null, content: form.content || null, rating: form.rating, featured: form.featured };
    try {
      if (editingId) await supabase.from("testimonials").update(payload).eq("id", editingId);
      else await supabase.from("testimonials").insert(payload);
      setShowModal(false);
      await fetchTestimonials();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "فشل الحفظ"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await supabase.from("testimonials").delete().eq("id", id); setDeleteConfirm(null); await fetchTestimonials(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "فشل الحذف"); }
  };

  const featuredCount = testimonials.filter((t) => t.featured).length;

  return (
    <DashboardLayout>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => { setError(""); fetchTestimonials(); }} className="text-red-400 hover:text-red-300 cursor-pointer px-2">إعادة المحاولة</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">آراء العملاء</h1><p className="text-white/40 text-sm mt-1">{testimonials.length} شهادة · {featuredCount} مميزة</p></div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-add-line"></i></div>إضافة شهادة
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className="ri-search-line text-white/40"></i></div>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} placeholder="بحث بالاسم..." className="flex-1 text-sm text-white/70 placeholder-white/30 focus:outline-none bg-transparent min-w-0" />
          <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line"></i></div>بحث
          </button>
          {(searchQuery || filterFeatured) && (
            <button onClick={handleClear} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60 cursor-pointer flex-shrink-0"><i className="ri-close-line text-sm"></i></button>
          )}
        </div>
        <select value={filterFeatured} onChange={(e) => setFilterFeatured(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer flex-shrink-0">
          <option value="" className="bg-[#0d1b2e]">كل الحالات</option>
          <option value="مميز" className="bg-[#0d1b2e]">مميز</option>
          <option value="عادي" className="bg-[#0d1b2e]">عادي</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : testimonials.length === 0 ? (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i className="ri-user-3-line text-white/30 text-2xl"></i></div>
          <p className="text-white/40 text-sm">لا توجد آراء عملاء بعد</p>
          <button onClick={openAddModal} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">أضف أول شهادة</button>
        </div>
      ) : (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-white/5 border-b border-white/10">
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">العميل</th>
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">الدور</th>
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">التقييم</th>
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">الحالة</th>
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">التاريخ</th>
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">إجراءات</th>
              </tr></thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {t.client_avatar ? <img src={t.client_avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-blue-400 font-bold text-sm">{t.client_name?.[0] || "?"}</span>}
                        </div>
                        <span className="text-sm font-medium text-white">{t.client_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white/50">{t.client_role || "—"}</td>
                    <td className="px-5 py-4"><div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="w-4 h-4 flex items-center justify-center"><i className={`text-xs ${i < (t.rating || 0) ? "ri-star-fill text-amber-400" : "ri-star-line text-white/20"}`}></i></div>))}</div></td>
                    <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.featured ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/50"}`}>{t.featured ? "مميز" : "عادي"}</span></td>
                    <td className="px-5 py-4 text-sm text-white/30">{t.created_at ? new Date(t.created_at).toLocaleDateString("ar-SA") : "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/dashboard/clients/${t.id}`)} className="w-8 h-8 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer" title="عرض التفاصيل"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditModal(t)} className="w-8 h-8 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-600/20 rounded-lg transition-colors cursor-pointer" title="تعديل"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(t.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer" title="حذف"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">{editingId ? "تعديل الشهادة" : "إضافة شهادة جديدة"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"><i className="ri-close-line text-xl"></i></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-white/70 mb-1.5">اسم العميل *</label><input type="text" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="أحمد الرشيدي" /></div>
              <div><label className="block text-sm font-medium text-white/70 mb-1.5">الدور / المنصب</label><input type="text" value={form.client_role} onChange={(e) => setForm({ ...form, client_role: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="مدير تسويق" /></div>
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">الصورة الشخصية</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} className="hidden" />
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/60 hover:text-white hover:border-blue-500 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50">
                    {uploading ? "جاري الرفع..." : "رفع صورة"}
                  </button>
                  {form.client_avatar && (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <img src={form.client_avatar} alt="preview" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      <span className="text-xs text-white/40 truncate">تم الرفع ✓</span>
                      <button onClick={() => setForm({ ...form, client_avatar: "" })} className="text-red-400 hover:text-red-300 text-xs cursor-pointer whitespace-nowrap">إزالة</button>
                    </div>
                  )}
                </div>
              </div>
              <div><label className="block text-sm font-medium text-white/70 mb-1.5">التقييم</label><div className="flex items-center gap-1">{[1,2,3,4,5].map((star) => (<button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className="w-8 h-8 flex items-center justify-center cursor-pointer"><i className={`text-lg ${star <= form.rating ? "ri-star-fill text-amber-400" : "ri-star-line text-white/20"} hover:text-amber-300 transition-colors`}></i></button>))}<span className="text-white/40 text-xs mr-2">{form.rating}/5</span></div></div>
              <div><label className="block text-sm font-medium text-white/70 mb-1.5">نص الشهادة</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none" rows={4} maxLength={500} placeholder="اكتب شهادة العميل هنا..." /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-blue-500 cursor-pointer" /><span className="text-sm text-white/60">شهادة مميزة</span></label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving || !form.client_name.trim() || uploading} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap">{saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الشهادة"}</button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-white/10 text-white/60 font-medium py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><i className="ri-error-warning-line text-red-400 text-xl"></i></div>
            <h3 className="text-lg font-black text-white text-center mb-2">تأكيد الحذف</h3>
            <p className="text-white/50 text-sm text-center mb-5">هل أنت متأكد من حذف هذه الشهادة؟</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-sm">نعم، احذف</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-white/10 text-white/60 font-medium py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-sm">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardClientsPage;