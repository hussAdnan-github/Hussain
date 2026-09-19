import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "@/lib/supabase";

interface Prompt {
  id: string;
  title: string;
  prompt_text: string | null;
  category: string | null;
  example_url: string | null;
  created_at: string | null;
}

const DashboardPromptDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data, error: fetchError } = await supabase
          .from("prompts")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (fetchError) throw fetchError;
        setPrompt(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const handleCopy = () => {
    if (prompt?.prompt_text) {
      navigator.clipboard.writeText(prompt.prompt_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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

  if (error || !prompt) {
    return (
      <DashboardLayout>
        <button onClick={() => navigate("/dashboard/prompts")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للبرومبتات
        </button>
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-white/30 text-2xl"></i>
          </div>
          <p className="text-white/40 text-sm">{error || "البرومبت غير موجود"}</p>
          <button onClick={() => navigate("/dashboard/prompts")} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">العودة للقائمة</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button onClick={() => navigate("/dashboard/prompts")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للبرومبتات
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <i className="ri-magic-line text-blue-400 text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white">{prompt.title}</h1>
              {prompt.category && (
                <span className="inline-block mt-1 bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">{prompt.category}</span>
              )}
            </div>
          </div>

          {prompt.example_url && (
            <div className="mb-6">
              <h3 className="text-white font-bold text-sm mb-3">مثال</h3>
              <div className="aspect-video rounded-xl overflow-hidden">
                <img src={prompt.example_url} alt={prompt.title} className="w-full h-full object-cover object-top" />
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">نص البرومبت</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
              >
                <div className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className={copied ? "ri-check-line" : "ri-clipboard-line"}></i>
                </div>
                {copied ? "تم النسخ" : "نسخ"}
              </button>
            </div>
            <div className="bg-[#0a1628] border border-white/10 rounded-xl p-4 text-white/60 text-sm leading-relaxed font-mono whitespace-pre-wrap min-h-[100px]">
              {prompt.prompt_text || "لا يوجد نص"}
            </div>
          </div>

          {prompt.created_at && (
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-white/30 text-xs">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-calendar-line"></i></div>
              تاريخ الإنشاء: {new Date(prompt.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={() => navigate("/dashboard/prompts")} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm">
            <i className="ri-arrow-right-line ml-2"></i> العودة للقائمة
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPromptDetailPage;