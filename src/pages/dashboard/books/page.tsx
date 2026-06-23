import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Book {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  price: string | null;
  category: string | null;
  featured: boolean | null;
  buy_url: string | null;
  status: string | null;
  created_at: string | null;
}

interface BookForm {
  title: string;
  price: string;
  originalPrice: string;
  description: string;
  cover_url: string;
  buy_url: string;
  category: string;
  featured: boolean;
  status: string;
}

const emptyBookForm: BookForm = {
  title: "",
  price: "",
  originalPrice: "",
  description: "",
  cover_url: "",
  buy_url: "",
  category: "تصوير",
  featured: false,
  status: "نشط",
};

const bookCategories = ["تصوير", "سينمائي", "منتجات", "برومبت", "أعمال كاملة"];

const DashboardBooksPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"books" | "orders">("books");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BookForm>(emptyBookForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase.from("books").select("*");

      if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);
      if (filterCategory) query = query.eq("category", filterCategory);
      if (filterStatus) query = query.eq("status", filterStatus);

      query = query.order("created_at", { ascending: false });

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setBooks(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterCategory, filterStatus]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleSearch = () => setSearchQuery(searchInput);
  const handleClear = () => { setSearchInput(""); setSearchQuery(""); setFilterCategory(""); setFilterStatus(""); };

  const categoriesFromData = [...new Set(books.map((b) => b.category || "غير مصنف"))];

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `book-${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage.from("uploads").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from("uploads").getPublicUrl(data.path);
      setForm({ ...form, cover_url: publicData.publicUrl });
    } catch {
      setError("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => { setEditingId(null); setForm(emptyBookForm); setShowModal(true); };

  const openEditModal = (book: Book) => {
    setEditingId(book.id);
    setForm({
      title: book.title, price: book.price || "", originalPrice: "",
      description: book.description || "", cover_url: book.cover_url || "",
      buy_url: book.buy_url || "", category: book.category || "تصوير",
      featured: book.featured || false, status: book.status || "نشط",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(), price: form.price || null,
      description: form.description || null, cover_url: form.cover_url || null,
      buy_url: form.buy_url || null, category: form.category,
      featured: form.featured, status: form.status,
    };
    try {
      if (editingId) {
        await supabase.from("books").update(payload).eq("id", editingId);
      } else {
        await supabase.from("books").insert(payload);
      }
      setShowModal(false);
      await fetchBooks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحفظ");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await supabase.from("books").delete().eq("id", id); setDeleteConfirm(null); await fetchBooks(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "فشل الحذف"); }
  };

  return (
    <DashboardLayout>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => { setError(""); fetchBooks(); }} className="text-red-400 hover:text-red-300 cursor-pointer px-2">إعادة المحاولة</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-black text-white">الكتب والمتجر</h1><p className="text-white/40 text-sm mt-1">إدارة المنتجات الرقمية</p></div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-add-line"></i></div>إضافة كتاب
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className="ri-search-line text-white/40"></i></div>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }} placeholder="بحث في الكتب..." className="flex-1 text-sm text-white/70 placeholder-white/30 focus:outline-none bg-transparent min-w-0" />
          <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line"></i></div>بحث
          </button>
          {(searchQuery || filterCategory || filterStatus) && (
            <button onClick={handleClear} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60 cursor-pointer flex-shrink-0"><i className="ri-close-line text-sm"></i></button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="" className="bg-[#0d1b2e]">كل التصنيفات</option>
            {categoriesFromData.map((c) => (<option key={c} value={c} className="bg-[#0d1b2e]">{c}</option>))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="" className="bg-[#0d1b2e]">كل الحالات</option>
            <option value="نشط" className="bg-[#0d1b2e]">نشط</option>
            <option value="مسودة" className="bg-[#0d1b2e]">مسودة</option>
          </select>
        </div>
      </div>

      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-5">
        <button onClick={() => setActiveTab("books")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === "books" ? "bg-blue-600 text-white" : "text-white/50 hover:text-white"}`}>المنتجات</button>
        <button onClick={() => setActiveTab("orders")} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === "orders" ? "bg-blue-600 text-white" : "text-white/50 hover:text-white"}`}>الطلبات</button>
      </div>

      {activeTab === "books" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : books.length === 0 ? (
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i className="ri-book-2-line text-white/30 text-2xl"></i></div>
              <p className="text-white/40 text-sm">لا توجد كتب بعد</p>
              <button onClick={openAddModal} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">أضف أول كتاب</button>
            </div>
          ) : (
            <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="bg-white/5 border-b border-white/10">
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">الكتاب</th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">التصنيف</th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">السعر</th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">الحالة</th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">مميز</th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">إجراءات</th>
                  </tr></thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-white max-w-[200px] truncate">{book.title}</td>
                        <td className="px-5 py-4"><span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">{book.category || "غير مصنف"}</span></td>
                        <td className="px-5 py-4 text-sm font-bold text-blue-400">{book.price || "—"}</td>
                        <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${book.status === "مسودة" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>{book.status === "مسودة" ? "مسودة" : "نشط"}</span></td>
                        <td className="px-5 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${book.featured ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/50"}`}>{book.featured ? "مميز" : "عادي"}</span></td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/dashboard/books/${book.id}`)} className="w-8 h-8 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer" title="عرض التفاصيل"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => openEditModal(book)} className="w-8 h-8 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-600/20 rounded-lg transition-colors cursor-pointer" title="تعديل"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteConfirm(book.id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer" title="حذف"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "orders" && (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i className="ri-shopping-bag-line text-white/30 text-2xl"></i></div>
          <p className="text-white/40 text-sm">اربط بوابة دفع (Stripe) لعرض الطلبات هنا</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">{editingId ? "تعديل الكتاب" : "إضافة كتاب جديد"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"><i className="ri-close-line text-xl"></i></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">عنوان الكتاب *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="أساسيات AI Photography" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-white/70 mb-1.5">السعر</label><input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="49$" /></div>
                <div><label className="block text-sm font-medium text-white/70 mb-1.5">السعر الأصلي</label><input type="text" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="79$" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">التصنيف</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    {bookCategories.map((c) => (<option key={c} className="bg-[#0d1b2e]">{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">الحالة</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    <option value="نشط" className="bg-[#0d1b2e]">نشط</option>
                    <option value="مسودة" className="bg-[#0d1b2e]">مسودة</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">الوصف</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none" rows={3} maxLength={500} placeholder="وصف الكتاب..." />
              </div>
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">الغلاف</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} className="hidden" />
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/60 hover:text-white hover:border-blue-500 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50">
                    {uploading ? "جاري الرفع..." : "رفع غلاف"}
                  </button>
                  {form.cover_url && (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <img src={form.cover_url} alt="cover" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <span className="text-xs text-white/40 truncate">تم الرفع ✓</span>
                      <button onClick={() => setForm({ ...form, cover_url: "" })} className="text-red-400 hover:text-red-300 text-xs cursor-pointer whitespace-nowrap">إزالة</button>
                    </div>
                  )}
                </div>
              </div>
              <div><label className="block text-sm font-medium text-white/70 mb-1.5">رابط الشراء</label><input type="url" value={form.buy_url} onChange={(e) => setForm({ ...form, buy_url: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="https://..." /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-blue-500 cursor-pointer" /><span className="text-sm text-white/60">كتاب مميز</span></label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving || !form.title.trim() || uploading} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap">{saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الكتاب"}</button>
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
            <p className="text-white/50 text-sm text-center mb-5">هل أنت متأكد من حذف هذا الكتاب؟ لا يمكن التراجع.</p>
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

export default DashboardBooksPage;