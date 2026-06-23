import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Eye, Edit, Trash2 } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  video_url: string | null;
  tags: string[] | null;
  featured: boolean | null;
  created_at: string | null;
}

interface FormData {
  title: string;
  category: string;
  type: string;
  tool: string;
  image_url: string;
  video_url: string;
  description: string;
  featured: boolean;
}

const emptyForm: FormData = {
  title: "",
  category: "منتجات",
  type: "صورة",
  tool: "Midjourney",
  image_url: "",
  video_url: "",
  description: "",
  featured: false,
};

const categories = ["منتجات", "أزياء", "أفلام", "عقار", "مطاعم", "سيارات", "عمارة"];
const types = ["صورة", "فيديو", "إعلان", "بوستر"];
const tools = ["Midjourney", "Runway", "Kling", "Photoshop", "DaVinci", "ComfyUI"];

const DashboardPortfolioPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase.from("portfolio_items").select("*");

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }
      if (filterCategory) {
        query = query.eq("category", filterCategory);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterCategory]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setFilterCategory("");
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from("uploads").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from("uploads").getPublicUrl(data.path);
      setForm({ ...form, image_url: publicData.publicUrl });
    } catch {
      setError("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category || "منتجات",
      type: "صورة",
      tool: "Midjourney",
      image_url: item.image_url || "",
      video_url: item.video_url || "",
      description: item.description || "",
      featured: item.featured || false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);

    const tags = [form.type, form.tool].filter(Boolean);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      description: form.description || null,
      image_url: form.image_url || null,
      video_url: form.video_url || null,
      tags,
      featured: form.featured,
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase.from("portfolio_items").update(payload).eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("portfolio_items").insert(payload);
        if (insertError) throw insertError;
      }

      setShowModal(false);
      await fetchItems();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("portfolio_items").delete().eq("id", id);
      setDeleteConfirm(null);
      await fetchItems();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحذف");
    }
  };

  const categoriesFromData = [...new Set(items.map((i) => i.category || "غير مصنف"))];

  return (
    <DashboardLayout>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => { setError(""); fetchItems(); }} className="text-red-400 hover:text-red-300 cursor-pointer px-2">إعادة المحاولة</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة الأعمال</h1>
          <p className="text-white/40 text-sm mt-1">{items.length} عمل في المعرض</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-add-line"></i></div>
          إضافة عمل
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className="ri-search-line text-white/40"></i></div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder="بحث في الأعمال..."
            className="flex-1 text-sm text-white/70 placeholder-white/30 focus:outline-none bg-transparent min-w-0"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line"></i></div>
            بحث
          </button>
          {(searchQuery || filterCategory) && (
            <button onClick={handleClearSearch} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60 cursor-pointer flex-shrink-0">
              <i className="ri-close-line text-sm"></i>
            </button>
          )}
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer flex-shrink-0"
        >
          <option value="" className="bg-[#0d1b2e]">كل التصنيفات</option>
          {categoriesFromData.map((c) => (<option key={c} value={c} className="bg-[#0d1b2e]">{c}</option>))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : items.length === 0 ? (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i className="ri-image-line text-white/30 text-2xl"></i></div>
          <p className="text-white/40 text-sm">لا توجد أعمال{searchQuery ? " تطابق بحثك" : ""}</p>
          {searchQuery || filterCategory ? (
            <button onClick={handleClearSearch} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">مسح الفلاتر</button>
          ) : (
            <button onClick={openAddModal} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">أضف أول عمل</button>
          )}
        </div>
      ) : (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">العمل</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">التصنيف</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">النوع</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">الأداة</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">الحالة</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const tags = item.tags || [];
                  return (
                    <tr key={item.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-white max-w-[200px] truncate">{item.title}</td>
                      <td className="px-5 py-4"><span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">{item.category || "غير مصنف"}</span></td>
                      <td className="px-5 py-4 text-sm text-white/50">{tags[0] || "صورة"}</td>
                      <td className="px-5 py-4 text-sm text-white/50">{tags[1] || "—"}</td>
                      <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.featured ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/50"}`}>{item.featured ? "مميز" : "عادي"}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/dashboard/portfolio/${item.id}`)} className="w-8 h-8 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer" title="عرض التفاصيل"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => openEditModal(item)} className="w-8 h-8 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-600/20 rounded-lg transition-colors cursor-pointer" title="تعديل"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteConfirm(item.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer" title="حذف"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">{editingId ? "تعديل العمل" : "إضافة عمل جديد"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"><i className="ri-close-line text-xl"></i></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">عنوان العمل *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="مثال: تصوير ساعة فاخرة" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">التصنيف</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    {categories.map((c) => (<option key={c} className="bg-[#0d1b2e]">{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">النوع</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    {types.map((t) => (<option key={t} className="bg-[#0d1b2e]">{t}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">الأداة</label>
                  <select value={form.tool} onChange={(e) => setForm({ ...form, tool: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    {tools.map((t) => (<option key={t} className="bg-[#0d1b2e]">{t}</option>))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-blue-500 cursor-pointer" />
                    <span className="text-sm text-white/60">عمل مميز</span>
                  </label>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">صورة العمل</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} className="hidden" />
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/60 hover:text-white hover:border-blue-500 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50">
                    {uploading ? "جاري الرفع..." : "رفع صورة"}
                  </button>
                  {form.image_url && (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <img src={form.image_url} alt="preview" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <span className="text-xs text-white/40 truncate">تم الرفع ✓</span>
                      <button onClick={() => setForm({ ...form, image_url: "" })} className="text-red-400 hover:text-red-300 text-xs cursor-pointer whitespace-nowrap">إزالة</button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">رابط الفيديو (اختياري)</label>
                <input type="url" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">الوصف</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none" rows={3} placeholder="وصف مختصر للعمل..." maxLength={500} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving || !form.title.trim() || uploading} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap">
                {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة العمل"}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-white/10 text-white/60 font-medium py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><i className="ri-error-warning-line text-red-400 text-xl"></i></div>
            <h3 className="text-lg font-black text-white text-center mb-2">تأكيد الحذف</h3>
            <p className="text-white/50 text-sm text-center mb-5">هل أنت متأكد من حذف هذا العمل؟ لا يمكن التراجع.</p>
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

export default DashboardPortfolioPage;