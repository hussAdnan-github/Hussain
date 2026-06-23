import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Eye, Edit, Trash2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  tags: string[] | null;
  published: boolean | null;
  created_at: string | null;
}

interface BlogForm {
  title: string;
  category: string;
  status: "منشور" | "مسودة";
  excerpt: string;
  content: string;
  keywords: string;
}

const emptyBlogForm: BlogForm = {
  title: "",
  category: "AI Photography",
  status: "مسودة",
  excerpt: "",
  content: "",
  keywords: "",
};

const blogCategories = ["AI Photography", "Prompt Engineering", "AI Film", "أدوات", "تسويق", "دروس"];

function generateSlug(title: string): string {
  return title
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .toLowerCase()
    .slice(0, 80) || "post";
}

const DashboardBlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyBlogForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = posts.filter((post) => {
    const tags = post.tags || [];
    const category = tags[0] || "عام";
    const matchCategory = !filterCategory || category === filterCategory;
    const matchStatus = !filterStatus || (filterStatus === "منشور" ? post.published : !post.published);
    return matchCategory && matchStatus;
  });

  const categoriesFromData = [...new Set(posts.map((p) => (p.tags || [])[0] || "عام"))];

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase.from("blog_posts").select("*");

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSearch = () => setSearchQuery(search);
  const handleClearFilters = () => { setSearch(""); setSearchQuery(""); setFilterCategory(""); setFilterStatus(""); };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyBlogForm);
    setShowModal(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingId(post.id);
    const tags = post.tags || [];
    setForm({
      title: post.title,
      category: tags[0] || "AI Photography",
      status: post.published ? "منشور" : "مسودة",
      excerpt: post.excerpt || "",
      content: post.content || "",
      keywords: tags.join("، "),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);

    const keywordTags = form.keywords
      .split(/[،,]/)
      .map((k) => k.trim())
      .filter(Boolean);

    const tags = [form.category, ...keywordTags];

    const slug = editingId
      ? (posts.find((p) => p.id === editingId)?.slug || generateSlug(form.title))
      : generateSlug(form.title) + "-" + Date.now().toString(36);

    const payload = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      tags,
      published: form.status === "منشور",
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("blog_posts")
          .insert(payload);
        if (insertError) throw insertError;
      }

      setShowModal(false);
      await fetchPosts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;
      setDeleteConfirm(null);
      await fetchPosts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحذف");
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-SA", { year: "numeric", month: "2-digit", day: "2-digit" });
  };

  return (
    <DashboardLayout>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => { setError(""); fetchPosts(); }} className="text-red-400 hover:text-red-300 cursor-pointer px-2">إعادة المحاولة</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة المدونة</h1>
          <p className="text-white/40 text-sm mt-1">{posts.length} مقال</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-add-line"></i>
          </div>
          مقال جديد
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i className="ri-search-line text-white/40"></i>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder="بحث في المقالات..."
            className="flex-1 text-sm text-white/70 placeholder-white/30 focus:outline-none bg-transparent min-w-0"
          />
          <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line"></i></div>بحث
          </button>
          {(searchQuery || filterCategory || filterStatus) && (
            <button onClick={handleClearFilters} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60 cursor-pointer flex-shrink-0"><i className="ri-close-line text-sm"></i></button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="" className="bg-[#0d1b2e]">كل التصنيفات</option>
            {categoriesFromData.map((c) => (
              <option key={c} value={c} className="bg-[#0d1b2e]">{c}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="" className="bg-[#0d1b2e]">كل الحالات</option>
            <option value="منشور" className="bg-[#0d1b2e]">منشور</option>
            <option value="مسودة" className="bg-[#0d1b2e]">مسودة</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-article-line text-white/30 text-2xl"></i>
          </div>
          <p className="text-white/40 text-sm">لا توجد مقالات بعد</p>
          <button onClick={openAddModal} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">
            اكتب أول مقال
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-search-line text-white/30 text-2xl"></i>
          </div>
          <p className="text-white/40 text-sm">لا توجد نتائج تطابق بحثك</p>
          <button onClick={handleClearFilters} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">
            مسح الفلاتر
          </button>
        </div>
      ) : (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">العنوان</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">التصنيف</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">المشاهدات</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">التاريخ</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">الحالة</th>
                  <th className="text-right text-xs text-white/40 font-medium px-5 py-3">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, idx) => {
                  const tags = post.tags || [];
                  const category = tags[0] || "عام";
                  const views = 5600 - idx * 700;
                  return (
                    <tr key={post.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-white max-w-xs truncate">{post.title}</td>
                      <td className="px-5 py-4">
                        <span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">{category}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/50">{Math.max(views, 100).toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm text-white/30">{formatDate(post.created_at)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${post.published ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                          {post.published ? "منشور" : "مسودة"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/blog/${post.id}`)}
                            className="w-8 h-8 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(post)}
                            className="w-8 h-8 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-600/20 rounded-lg transition-colors cursor-pointer"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(post.id)}
                            className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">
                {editingId ? "تعديل المقال" : "مقال جديد"}
              </h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">عنوان المقال *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                  placeholder="أدخل عنوان المقال"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">التصنيف</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {blogCategories.map((c) => (
                      <option key={c} className="bg-[#0d1b2e]">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">الحالة</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "منشور" | "مسودة" })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option className="bg-[#0d1b2e]">مسودة</option>
                    <option className="bg-[#0d1b2e]">منشور</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">وصف مختصر (SEO)</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none"
                  rows={2}
                  maxLength={160}
                  placeholder="وصف مختصر للمقال..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">محتوى المقال</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none"
                  rows={8}
                  maxLength={50000}
                  placeholder="اكتب محتوى المقال هنا..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">الكلمات المفتاحية</label>
                <input
                  type="text"
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                  placeholder="AI Photography, Midjourney, برومبت..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : form.status === "منشور" ? "نشر المقال" : "حفظ كمسودة"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-white/10 text-white/60 font-medium py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-line text-red-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-black text-white text-center mb-2">تأكيد الحذف</h3>
            <p className="text-white/50 text-sm text-center mb-5">
              هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-sm"
              >
                نعم، احذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-white/10 text-white/60 font-medium py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardBlogPage;