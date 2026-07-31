import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string;
  tags: string[];
  created_at: string;
}

const BlogSection = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error: supaError } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, cover_url, tags, created_at")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(3);

        if (supaError) throw supaError;
        setPosts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return (
      <section className="py-20 md:py-28 px-4 md:px-8 bg-white" dir="rtl">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm">جاري تحميل المقالات...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 md:py-28 px-4 md:px-8 bg-white" dir="rtl">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500 text-sm">حدث خطأ: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 text-sm underline cursor-pointer">إعادة المحاولة</button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 px-4 md:px-8 bg-white" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-blue-500"></div>
              <span className="text-blue-600 text-sm font-semibold">المدونة</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0d1b2e]">
              آخر المقالات
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              تعلم AI Photography وهندسة البرومبتات من خبير المجال
            </p>
          </div>
          <button
            onClick={() => navigate("/blog")}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            عرض كل المقالات
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-left-line"></i>
            </div>
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group bg-[#f8faff] border border-gray-100 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all duration-300 cursor-pointer flex flex-col"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-medium">
                    {post.tags?.[0] || "عام"}
                  </span>
                  <span className="text-gray-400 text-xs">{formatDate(post.created_at)}</span>
                </div>
                <h3 className="text-[#0d1b2e] font-bold text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors flex-1">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                  <span className="text-gray-400 text-xs">{post.tags?.slice(1).join(" · ")}</span>
                  <span className="text-blue-600 text-xs font-medium group-hover:underline">
                    اقرأ المزيد
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;