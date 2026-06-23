import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Prompt {
  id: string;
  title: string;
  prompt_text: string | null;
  category: string | null;
  example_url: string | null;
  created_at: string | null;
}

interface PromptForm {
  title: string;
  category: string;
  prompt_text: string;
  description: string;
}

const emptyPromptForm: PromptForm = { title: "", category: "بورتريه", prompt_text: "", description: "" };

const promptCategories = ["بورتريه", "منتجات", "أفلام", "أزياء", "عقار", "سيارات"];

const DashboardPromptsPage = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PromptForm>(emptyPromptForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase.from("prompts").select("*");

      if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);
      if (filterCategory) query = query.eq("category", filterCategory);

      query = query.order("created_at", { ascending: false });

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setPrompts(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally { setLoading(false); }
  }, [searchQuery, filterCategory]);

  useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

  const handleSearch = () => setSearchQuery(searchInput);
  const handleClear = () => { setSearchInput(""); setSearchQuery(""); setFilterCategory(""); };

  const categoriesFromData = [...new Set(prompts.map((p) => p.category || "عام"))];

  const openAddModal = () => { setEditingId(null); setForm(emptyPromptForm); setShowModal(true); };

  const openEditModal = (prompt: Prompt) => {
    setEditingId(prompt.id);
    setForm({ title: prompt.title, category: prompt.category || "بورتريه", prompt_text: prompt.prompt_text || "", description: "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = { title: form.title.trim(), prompt_text: form.prompt_text || null, category: form.category, example_url: null };
    try {
      if (editingId) await supabase.from("prompts").update(payload).eq("id", editingId);
      else await supabase.from("prompts").insert(payload);
      setShowModal(false);
      await fetchPrompts();
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "فشل الحفظ"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await supabase.from("prompts").delete().eq("id", id); setDeleteConfirm(null); await fetchPrompts(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "فشل الحذف"); }
  };

  return (
    <DashboardLayout>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => { setError(""); fetchPrompts(); }} className="text-red-400 hover:text-red-300 cursor-pointer px-2">إعادة المحاولة</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">إدارة البرومبتات</h1><p className="text-white/40 text-sm mt-1">قوالب البرومبتات والمكتبة</p></div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-add-line"></i></div>إضافة برومبت
        </button>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4"><div className="text-2xl font-black text-white">{prompts.length}</div><div className="text-white/40 text-sm">إجمالي البرومبتات</div></div>
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4"><div className="text-2xl font-black text-white">{categoriesFromData.length}</div><div className="text-white/40 text-sm">تصنيف</div></div>
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4"><div className="text-2xl font-black text-white">{prompts.length}</div><div className="text-white/40 text-sm">نشطة</div></div>
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4"><div className="text-2xl font-black text-white">{categoriesFromData[0] || "—"}</div><div className="text-white/40 text-sm">أكثر تصنيف</div></div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className="ri-search-line text-white/40"></i></div>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} placeholder="بحث في البرومبتات..." className="flex-1 text-sm text-white/70 placeholder-white/30 focus:outline-none bg-transparent min-w-0" />
          <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line"></i></div>بحث
          </button>
          {(searchQuery || filterCategory) && (
            <button onClick={handleClear} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60 cursor-pointer flex-shrink-0"><i className="ri-close-line text-sm"></i></button>
          )}
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer flex-shrink-0">
          <option value="" className="bg-[#0d1b2e]">كل التصنيفات</option>
          {categoriesFromData.map((c) => (<option key={c} value={c} className="bg-[#0d1b2e]">{c}</option>))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : prompts.length === 0 ? (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i className="ri-magic-line text-white/30 text-2xl"></i></div>
          <p className="text-white/40 text-sm">لا توجد برومبتات{searchQuery ? " تطابق بحثك" : ""}</p>
          {searchQuery || filterCategory ? (
            <button onClick={handleClear} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">مسح الفلاتر</button>
          ) : (
            <button onClick={openAddModal} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">أضف أول برومبت</button>
          )}
        </div>
      ) : (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-white/5 border-b border-white/10">
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">البرومبت</th>
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">التصنيف</th>
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">النص</th>
                <th className="text-right text-xs text-white/40 font-medium px-5 py-3">إجراءات</th>
              </tr></thead>
              <tbody>
                {prompts.map((prompt) => (
                  <tr key={prompt.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-white max-w-[200px] truncate">{prompt.title}</td>
                    <td className="px-5 py-4"><span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">{prompt.category || "عام"}</span></td>
                    <td className="px-5 py-4 text-sm text-white/40 max-w-[300px] truncate font-mono text-xs">{prompt.prompt_text || "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/dashboard/prompts/${prompt.id}`)} className="w-8 h-8 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer" title="عرض التفاصيل"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditModal(prompt)} className="w-8 h-8 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-600/20 rounded-lg transition-colors cursor-pointer" title="تعديل"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(prompt.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer" title="حذف"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">{editingId ? "تعديل البرومبت" : "إضافة برومبت جديد"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"><i className="ri-close-line text-xl"></i></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-white/70 mb-1.5">عنوان البرومبت *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="بورتريه سينمائي درامي" /></div>
              <div><label className="block text-sm font-medium text-white/70 mb-1.5">التصنيف</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">{promptCategories.map((c) => (<option key={c} className="bg-[#0d1b2e]">{c}</option>))}</select></div>
              <div><label className="block text-sm font-medium text-white/70 mb-1.5">نص البرومبت</label><textarea value={form.prompt_text} onChange={(e) => setForm({ ...form, prompt_text: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none font-mono" rows={4} maxLength={2000} placeholder="أدخل نص البرومبت هنا..." /></div>
              <div><label className="block text-sm font-medium text-white/70 mb-1.5">وصف إضافي</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none" rows={2} maxLength={500} placeholder="شرح استخدام البرومبت..." /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving || !form.title.trim()} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap">{saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة البرومبت"}</button>
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
            <p className="text-white/50 text-sm text-center mb-5">هل أنت متأكد من حذف هذا البرومبت؟ لا يمكن التراجع.</p>
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

export default DashboardPromptsPage;