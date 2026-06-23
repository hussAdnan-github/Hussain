import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Eye, Edit, Trash2 } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  price: string | null;
  features: string[] | null;
  order_index: number | null;
  status: string | null;
  category: string | null;
  created_at: string | null;
}

interface ServiceForm {
  title: string;
  description: string;
  icon: string;
  price: string;
  features: string;
  order_index: number;
  status: string;
  category: string;
}

const emptyForm: ServiceForm = {
  title: "",
  description: "",
  icon: "ri-camera-line",
  price: "",
  features: "",
  order_index: 0,
  status: "نشط",
  category: "",
};

const iconOptions = [
  "ri-camera-line", "ri-film-line", "ri-advertisement-line", "ri-magic-line",
  "ri-scissors-line", "ri-palette-line", "ri-customer-service-2-line",
];

const serviceCategories = ["تصوير", "أفلام", "إعلانات", "تصميم", "استشارات"];

const DashboardServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase.from("services").select("*");

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }
      if (filterStatus) {
        query = query.eq("status", filterStatus);
      }
      if (filterCategory) {
        query = query.eq("category", filterCategory);
      }

      query = query.order("order_index", { ascending: true });

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setServices(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus, filterCategory]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setFilterStatus("");
    setFilterCategory("");
  };

  const categoriesFromData = [...new Set(services.map((s) => s.category || "عام"))];

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm, order_index: services.length });
    setShowModal(true);
  };

  const openEditModal = (service: Service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description || "",
      icon: service.icon || "ri-camera-line",
      price: service.price || "",
      features: (service.features || []).join("\n"),
      order_index: service.order_index || 0,
      status: service.status || "نشط",
      category: service.category || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);

    const featuresList = form.features.split("\n").map((f) => f.trim()).filter(Boolean);

    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      icon: form.icon,
      price: form.price || null,
      features: featuresList.length > 0 ? featuresList : null,
      order_index: form.order_index,
      status: form.status || "نشط",
      category: form.category || null,
    };

    try {
      if (editingId) {
        await supabase.from("services").update(payload).eq("id", editingId);
      } else {
        await supabase.from("services").insert(payload);
      }

      setShowModal(false);
      await fetchServices();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("services").delete().eq("id", id);
      setDeleteConfirm(null);
      await fetchServices();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحذف");
    }
  };

  return (
    <DashboardLayout>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => { setError(""); fetchServices(); }} className="text-red-400 hover:text-red-300 cursor-pointer px-2">إعادة المحاولة</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة الخدمات</h1>
          <p className="text-white/40 text-sm mt-1">الباقات والأسعار</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors">
          <div className="w-5 h-5 flex items-center justify-center"><i className="ri-add-line"></i></div>
          إضافة خدمة
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"><i className="ri-search-line text-white/40"></i></div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder="بحث في الخدمات..."
            className="flex-1 text-sm text-white/70 placeholder-white/30 focus:outline-none bg-transparent min-w-0"
          />
          <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5">
            <div className="w-4 h-4 flex items-center justify-center"><i className="ri-search-line"></i></div>
            بحث
          </button>
          {(searchQuery || filterStatus || filterCategory) && (
            <button onClick={handleClear} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white/60 cursor-pointer flex-shrink-0">
              <i className="ri-close-line text-sm"></i>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="" className="bg-[#0d1b2e]">كل الحالات</option>
            <option value="نشط" className="bg-[#0d1b2e]">نشط</option>
            <option value="مسودة" className="bg-[#0d1b2e]">مسودة</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-blue-500 cursor-pointer">
            <option value="" className="bg-[#0d1b2e]">كل التصنيفات</option>
            {categoriesFromData.map((c) => (<option key={c} value={c} className="bg-[#0d1b2e]">{c}</option>))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : services.length === 0 ? (
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><i className="ri-search-line text-white/30 text-2xl"></i></div>
          <p className="text-white/40 text-sm">لا توجد خدمات{searchQuery ? " تطابق بحثك" : ""}</p>
          {searchQuery || filterStatus || filterCategory ? (
            <button onClick={handleClear} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">مسح الفلاتر</button>
          ) : (
            <button onClick={openAddModal} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">أضف أول خدمة</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div key={service.id} className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-5 hover:border-blue-500/30 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                    <i className={`${service.icon || "ri-camera-line"} text-blue-400`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{service.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {service.category && <span className="text-white/30 text-xs">{service.category}</span>}
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${service.status === "مسودة" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>{service.status === "مسودة" ? "مسودة" : "نشط"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate(`/dashboard/services/${service.id}`)} className="w-7 h-7 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer" title="عرض التفاصيل"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => openEditModal(service)} className="w-7 h-7 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-600/20 rounded-lg transition-colors cursor-pointer" title="تعديل"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteConfirm(service.id)} className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer" title="حذف"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-white/40 text-xs mb-4 line-clamp-2">{service.description || "—"}</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-lg font-black text-white">{(service.features || []).length}</div><div className="text-xs text-white/40">ميزات</div></div>
                <div className="bg-blue-600/20 rounded-xl p-3 text-center"><div className="text-lg font-black text-blue-400">{service.price || "—"}</div><div className="text-xs text-white/40">السعر</div></div>
                <div className="bg-emerald-500/20 rounded-xl p-3 text-center"><div className="text-sm font-black text-emerald-400">#{service.order_index ?? 0}</div><div className="text-xs text-white/40">الترتيب</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">{editingId ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"><i className="ri-close-line text-xl"></i></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">اسم الخدمة *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="تصوير المنتجات بالـ AI" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">الأيقونة</label>
                  <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    {iconOptions.map((icon) => (<option key={icon} className="bg-[#0d1b2e]">{icon}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">السعر</label>
                  <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500" placeholder="يبدأ من 500$" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">التصنيف</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                    <option value="" className="bg-[#0d1b2e]">بدون تصنيف</option>
                    {serviceCategories.map((c) => (<option key={c} className="bg-[#0d1b2e]">{c}</option>))}
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
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none" rows={2} maxLength={300} placeholder="وصف مختصر للخدمة..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">المميزات (كل سطر ميزة)</label>
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none" rows={4} maxLength={1000} placeholder="تسليم خلال 48 ساعة&#10;3 مراجعات مجانية&#10;ملفات عالية الدقة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">الترتيب</label>
                <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" min={0} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving || !form.title.trim()} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap">
                {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الخدمة"}
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
            <p className="text-white/50 text-sm text-center mb-5">هل أنت متأكد من حذف هذه الخدمة؟</p>
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

export default DashboardServicesPage;