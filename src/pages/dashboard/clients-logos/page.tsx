import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DashboardLayout from "../components/DashboardLayout";
import SortableClientRow, { type ClientLogo } from "./components/SortableClientRow";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/base/Toast";

interface ClientForm {
  name: string;
  logo_url: string;
  website_url: string;
}

const emptyForm: ClientForm = { name: "", logo_url: "", website_url: "" };

const DashboardClientsLogosPage = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let query = supabase
        .from("client_logos")
        .select("id, name, logo_url, website_url, sort_order, created_at, is_active");

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      query = query
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setClients((data as ClientLogo[]) || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const sanitizeFileName = (name: string) => {
    const ext = (name.split(".").pop() || "png")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    return `client-logos/logo-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext || "png"}`;
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = sanitizeFileName(file.name);
      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(path, file, { cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from("public")
        .getPublicUrl(path);
      if (urlData?.publicUrl) {
        setForm((prev) => ({ ...prev, logo_url: urlData.publicUrl }));
      }
    } catch {
      setError("فشل رفع الشعار");
      showToast("فشل رفع الشعار", "error");
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (c: ClientLogo) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      logo_url: c.logo_url || "",
      website_url: c.website_url || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const basePayload = {
        name: form.name.trim(),
        logo_url: form.logo_url || null,
        website_url: form.website_url.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("client_logos")
          .update(basePayload)
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const maxOrder = clients.reduce(
          (max, c) => Math.max(max, c.sort_order ?? 0),
          0
        );
        const { error: insertError } = await supabase
          .from("client_logos")
          .insert({
            ...basePayload,
            is_active: true,
            sort_order: maxOrder + 1,
          });
        if (insertError) throw insertError;
      }

      setShowModal(false);
      showToast(
        editingId ? "تم تعديل الشريك بنجاح" : "تم إضافة الشريك بنجاح",
        "success"
      );
      await fetchClients();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحفظ");
      showToast("فشل حفظ البيانات", "error");
    } finally {
      setSaving(false);
    }
  };

  const persistOrder = async (ordered: ClientLogo[]) => {
    try {
      await Promise.all(
        ordered.map((item, index) =>
          supabase
            .from("client_logos")
            .update({ sort_order: index + 1 })
            .eq("id", item.id)
        )
      );
      showToast("تم حفظ ترتيب الشركاء بنجاح", "success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل حفظ الترتيب");
      showToast("فشل حفظ الترتيب", "error");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = clients.findIndex((c) => c.id === active.id);
    const newIndex = clients.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(clients, oldIndex, newIndex);
    setClients(reordered);
    await persistOrder(reordered);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error: delError } = await supabase
        .from("client_logos")
        .delete()
        .eq("id", id);
      if (delError) throw delError;
      setDeleteConfirm(null);
      showToast("تم حذف الشريك بنجاح", "success");
      await fetchClients();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحذف");
      showToast("فشل حذف الشريك", "error");
    }
  };

  const isFiltering = !!searchQuery;

  return (
    <DashboardLayout>
      {error && (
        <div
          className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm flex items-center justify-between"
          dir="rtl"
        >
          <span>{error}</span>
          <button
            onClick={() => {
              setError("");
              fetchClients();
            }}
            className="text-red-400 hover:text-red-300 cursor-pointer px-2"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6" dir="rtl">
        <div>
          <h1 className="text-2xl font-black text-white">شركاء النجاح</h1>
          <p className="text-white/40 text-sm mt-1">
            {clients.length} شريك في القائمة — يتم عرضهم في الموقع حسب الترتيب أدناه
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-add-line"></i>
          </div>
          إضافة شريك
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3" dir="rtl">
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i className="ri-search-line text-white/40"></i>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="بحث عن شريك بالاسم..."
            className="bg-transparent text-sm text-white placeholder-white/30 focus:outline-none flex-1"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="text-white/40 hover:text-white text-xs cursor-pointer px-1"
            >
              <i className="ri-close-line text-base"></i>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap flex-1 sm:flex-none text-center"
          >
            بحث
          </button>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="bg-white/5 hover:bg-white/10 text-white/60 text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              مسح الفلتر
            </button>
          )}
        </div>
      </div>

      {/* Info banner */}
      <div
        className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-5 text-blue-300 text-xs flex items-center gap-2"
        dir="rtl"
      >
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          <i className="ri-drag-move-2-line"></i>
        </div>
        <span>
          يمكنك إعادة ترتيب الشركاء عبر <strong>السحب والإفلات</strong> باستخدام أيقونة الترتيب في يمين كل صف. الترتيب ينعكس فوراً وتلقائياً على السلايدر في الصفحة الرئيسية وصفحة الشركاء.
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : clients.length === 0 ? (
        <div
          className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center"
          dir="rtl"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-building-2-line text-white/30 text-2xl"></i>
          </div>
          <p className="text-white/40 text-sm">
            {searchQuery ? "لا يوجد شركاء يطابقون بحثك" : "لا يوجد شركاء بعد"}
          </p>
          {searchQuery ? (
            <button
              onClick={handleClearSearch}
              className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer"
            >
              مسح البحث
            </button>
          ) : (
            <button
              onClick={openAddModal}
              className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer"
            >
              أضف أول شريك
            </button>
          )}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden" dir="rtl">
            {isFiltering && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/10 text-white/40 text-xs">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-information-line"></i>
                </div>
                الترتيب بالسحب معطّل أثناء البحث — امسح البحث أولاً لتفعيل السحب والإفلات.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="text-center text-xs text-white/40 font-medium px-3 py-3 w-12">
                      ترتيب
                    </th>
                    <th className="text-center text-xs text-white/40 font-medium px-2 py-3 w-8">
                      #
                    </th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">
                      الشريك
                    </th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">
                      رابط الموقع
                    </th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">
                      تاريخ الإضافة
                    </th>
                    <th className="text-right text-xs text-white/40 font-medium px-5 py-3">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <SortableContext
                    items={clients.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {clients.map((client, index) => (
                      <SortableClientRow
                        key={client.id}
                        client={client}
                        index={index}
                        disabled={isFiltering}
                        onEdit={openEditModal}
                        onDelete={(id) => setDeleteConfirm(id)}
                      />
                    ))}
                  </SortableContext>
                </tbody>
              </table>
            </div>
          </div>
        </DndContext>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div
            className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">
                {editingId ? "تعديل الشريك" : "إضافة شريك جديد"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  اسم الشريك *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                  placeholder="اسم الشريك"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  رابط الموقع (اختياري)
                </label>
                <input
                  type="url"
                  value={form.website_url}
                  onChange={(e) =>
                    setForm({ ...form, website_url: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="https://example.com"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  الشعار (PNG شفاف)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 p-2">
                    {form.logo_url ? (
                      <img
                        src={form.logo_url}
                        alt="معاينة"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <i className="ri-image-line text-white/30 text-2xl"></i>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/60 hover:text-white hover:border-blue-500 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50"
                    >
                      {uploading ? "جاري الرفع..." : "رفع شعار جديد"}
                    </button>
                    {form.logo_url && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, logo_url: "" })}
                        className="text-red-400 hover:text-red-300 text-xs cursor-pointer text-right"
                      >
                        إزالة الشعار
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="url"
                  value={form.logo_url}
                  onChange={(e) =>
                    setForm({ ...form, logo_url: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 mt-3 font-mono"
                  placeholder="أو الصق رابط الشعار هنا..."
                  dir="ltr"
                />
                <p className="text-white/25 text-xs mt-1">
                  اتركه فارغاً لعرض اسم الشريك كنص بدل الشعار
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim() || uploading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                {saving
                  ? "جاري الحفظ..."
                  : editingId
                  ? "حفظ التعديلات"
                  : "إضافة الشريك"}
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
          <div
            className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-sm p-6"
            dir="rtl"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-line text-red-400 text-xl"></i>
            </div>
            <h3 className="text-lg font-black text-white text-center mb-2">
              تأكيد الحذف
            </h3>
            <p className="text-white/50 text-sm text-center mb-5">
              هل أنت متأكد من حذف هذا الشريك من القائمة؟
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

export default DashboardClientsLogosPage;