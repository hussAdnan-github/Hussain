import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { supabase } from "@/lib/supabase";
import { Eye, Trash2 } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string | null;
  read: boolean | null;
  created_at: string | null;
}

interface ComposeForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emptyCompose: ComposeForm = { name: "", email: "", subject: "", message: "" };

const DashboardMessagesPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [reply, setReply] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState<ComposeForm>(emptyCompose);
  const [sending, setSending] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSelect = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      await supabase.from("contact_messages").update({ read: true }).eq("id", msg.id);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
      );
    }
  };

  const handleCompose = async () => {
    if (!compose.name.trim() || !compose.email.trim()) return;
    setSending(true);
    try {
      const { error: insertError } = await supabase.from("contact_messages").insert({
        name: compose.name.trim(),
        email: compose.email.trim(),
        subject: compose.subject || null,
        message: compose.message || null,
        read: true,
      });
      if (insertError) throw insertError;
      setShowCompose(false);
      setCompose(emptyCompose);
      await fetchMessages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل إرسال الرسالة");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("contact_messages").delete().eq("id", id);
      setDeleteConfirm(null);
      if (selected?.id === id) setSelected(null);
      await fetchMessages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل الحذف");
    }
  };

  const handleReply = async (msg: Message) => {
    if (!reply.trim()) return;
    try {
      const { error: insertError } = await supabase.from("contact_messages").insert({
        name: "حسن جمال الليل",
        email: "admin@gmail.com",
        subject: `رد: ${msg.subject || "بدون عنوان"}`,
        message: reply.trim(),
        read: true,
      });
      if (insertError) throw insertError;
      setReply("");
      await fetchMessages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل إرسال الرد");
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffHrs < 1) return "منذ دقائق";
    if (diffHrs < 24) return `منذ ${diffHrs} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return d.toLocaleDateString("ar-SA");
  };

  return (
    <DashboardLayout>
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => { setError(""); fetchMessages(); }} className="text-red-400 hover:text-red-300 cursor-pointer px-2">إعادة المحاولة</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">الرسائل والطلبات</h1>
          <p className="text-white/40 text-sm mt-1">{unreadCount} رسائل غير مقروءة</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-add-line"></i>
          </div>
          رسالة جديدة
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-250px)]">
        <div className="lg:w-80 bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line text-white/40 text-sm"></i>
              </div>
              <input type="text" placeholder="بحث..." className="bg-transparent text-sm text-white/70 placeholder-white/30 focus:outline-none flex-1" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-white/30 text-sm">لا توجد رسائل</p>
              </div>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full flex items-start gap-3 p-4 hover:bg-white/5 transition-colors text-right cursor-pointer ${selected?.id === msg.id ? "bg-blue-600/20" : ""} ${!msg.read ? "bg-blue-600/10" : ""}`}
                >
                  <div className="w-9 h-9 bg-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold text-sm">{msg.name?.[0] || "?"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${!msg.read ? "text-white" : "text-white/60"}`}>{msg.name}</span>
                      <span className="text-xs text-white/30">{formatTime(msg.created_at)}</span>
                    </div>
                    <p className="text-xs text-white/40 truncate mt-0.5">{msg.subject || "بدون عنوان"}</p>
                  </div>
                  {!msg.read && <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5"></div>}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 bg-[#0d1b2e] border border-white/10 rounded-2xl flex flex-col min-h-0">
          {selected ? (
            <>
              <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold">{selected.name?.[0] || "?"}</span>
                  </div>
                  <div>
                    <div className="font-bold text-white">{selected.name}</div>
                    <div className="text-white/40 text-sm">{selected.email}</div>
                  </div>
                  <div className="mr-auto flex gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/messages/${selected.id}`)}
                      className="w-8 h-8 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors cursor-pointer"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(selected.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto">
                <h3 className="font-bold text-white mb-3">{selected.subject || "بدون عنوان"}</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/60 text-sm leading-relaxed">
                  {selected.message || "لا يوجد محتوى"}
                </div>
                <div className="text-xs text-white/30 mt-2">{formatTime(selected.created_at)}</div>
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex gap-3">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="اكتب ردك هنا..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <button
                    onClick={() => handleReply(selected)}
                    disabled={!reply.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 rounded-xl transition-colors cursor-pointer whitespace-nowrap self-end py-3"
                  >
                    إرسال الرد
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-message-3-line text-white/30 text-2xl"></i>
                </div>
                <p className="text-white/30 text-sm">اختر رسالة لعرضها</p>
                <button onClick={() => setShowCompose(true)} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">
                  أو أنشئ رسالة جديدة
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white">رسالة جديدة</h3>
              <button onClick={() => { setShowCompose(false); setCompose(emptyCompose); }} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">اسم المرسل *</label>
                  <input
                    type="text"
                    value={compose.name}
                    onChange={(e) => setCompose({ ...compose, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    placeholder="الاسم"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">البريد *</label>
                  <input
                    type="email"
                    value={compose.email}
                    onChange={(e) => setCompose({ ...compose, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">الموضوع</label>
                <input
                  type="text"
                  value={compose.subject}
                  onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500"
                  placeholder="موضوع الرسالة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">الرسالة</label>
                <textarea
                  value={compose.message}
                  onChange={(e) => setCompose({ ...compose, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500 resize-none"
                  rows={5}
                  maxLength={500}
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCompose}
                disabled={sending || !compose.name.trim() || !compose.email.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                {sending ? "جاري الإرسال..." : "إرسال الرسالة"}
              </button>
              <button
                onClick={() => { setShowCompose(false); setCompose(emptyCompose); }}
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
            <p className="text-white/50 text-sm text-center mb-5">هل أنت متأكد من حذف هذه الرسالة؟</p>
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

export default DashboardMessagesPage;