import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "@/lib/supabase";

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

const DashboardBlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data, error: fetchError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (fetchError) throw fetchError;
        setPost(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !post) {
    return (
      <DashboardLayout>
        <button onClick={() => navigate("/dashboard/blog")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
          <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للمدونة
        </button>
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-white/30 text-2xl"></i>
          </div>
          <p className="text-white/40 text-sm">{error || "المقال غير موجود"}</p>
          <button onClick={() => navigate("/dashboard/blog")} className="text-blue-400 text-sm mt-2 hover:text-blue-300 cursor-pointer">العودة للقائمة</button>
        </div>
      </DashboardLayout>
    );
  }

  const tags = post.tags || [];
  const category = tags[0] || "عام";
  const keywords = tags.slice(1);

  return (
    <DashboardLayout>
      <button onClick={() => navigate("/dashboard/blog")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 cursor-pointer">
        <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line"></i></div> العودة للمدونة
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0d1b2e] border border-white/10 rounded-2xl overflow-hidden">
          {post.cover_url && (
            <div className="aspect-[21/9] overflow-hidden">
              <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover object-top" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium">{category}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${post.published ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                {post.published ? "منشور" : "مسودة"}
              </span>
              {post.slug && <span className="bg-white/10 text-white/50 text-xs px-2.5 py-1 rounded-full font-mono">{post.slug}</span>}
            </div>

            <h1 className="text-xl md:text-2xl font-black text-white mb-4">{post.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-white/40 mb-1">التصنيف</div>
                <div className="text-white font-bold text-sm">{category}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-white/40 mb-1">الكلمات المفتاحية</div>
                <div className="text-white font-bold text-sm">{keywords.length > 0 ? keywords.join("، ") : "—"}</div>
              </div>
            </div>

            {post.excerpt && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm mb-3">الوصف المختصر (SEO)</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/60 text-sm leading-relaxed">
                  {post.excerpt}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-white font-bold text-sm mb-3">محتوى المقال</h3>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/60 text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                {post.content || "لا يوجد محتوى"}
              </div>
            </div>

            {post.created_at && (
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-white/30 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 flex items-center justify-center"><i className="ri-calendar-line"></i></div>
                  تاريخ الإنشاء: {new Date(post.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={() => navigate("/dashboard/blog")} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap text-sm">
            <i className="ri-arrow-right-line ml-2"></i> العودة للقائمة
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardBlogDetailPage;