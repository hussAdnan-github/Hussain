import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string | null;
  read: boolean | null;
  created_at: string | null;
}

const DashboardMessageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [msg, setMsg] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data, error: fetchError } = await supabase
          .from("contact_messages")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (fetchError) throw fetchError;
        setMsg(data);
        if (data && !data.read) {
          await supabase.from("contact_messages").update({ read: true }).eq("id", data.id);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !msg) {
    return (
      <DashboardLayout>
        <button onClick={() => navigate("/dashboard/messages")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للرسائل
        </button>
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-white/30 text-2xl"></i>
          </div>
          <p className="text-white/40 text-sm">{error || "الرسالة غير موجودة"}</p>
          <button onClick={() => navigate("/dashboard/messages")} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">العودة للقائمة</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button onClick={() => navigate("/dashboard/messages")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للرسائل
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-14 h-14 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-400 font-black text-lg">
              {msg.name?.[0] || "؟"}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white">{msg.name}</h1>
              <p className="text-white/40 text-sm">{msg.email}</p>
              <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${msg.read ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
                {msg.read ? "مقروءة" : "جديدة"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-white/40 mb-1">المرسل</div>
              <div className="text-white font-bold text-sm">{msg.name}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-xs text-white/40 mb-1">البريد</div>
              <div className="text-white font-bold text-sm break-all">{msg.email}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-bold text-sm mb-3">الموضوع</h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm font-medium">
              {msg.subject || "بدون عنوان"}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-white font-bold text-sm mb-3">الرسالة</h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/60 text-sm leading-relaxed min-h-[80px]">
              {msg.message || "لا يوجد محتوى"}
            </div>
          </div>

          {msg.created_at && (
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-white/30 text-xs">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-calendar-line"></i></div>
              تاريخ الاستلام: {formatTime(msg.created_at)}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={() => navigate("/dashboard/messages")} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm">
            <i className="ri-arrow-right-line ml-2"></i> العودة للقائمة
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardMessageDetailPage;