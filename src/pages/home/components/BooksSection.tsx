import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Book {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  price: string;
  category: string;
  featured: boolean;
  buy_url: string;
}

const BooksSection = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error: supaError } = await supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: false });

        if (supaError) throw supaError;
        setBooks(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <section id="books" className="py-16 md:py-24 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm">جاري تحميل المنتجات...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="books" className="py-16 md:py-24 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-red-500 text-sm">حدث خطأ: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-blue-600 text-sm underline cursor-pointer">إعادة المحاولة</button>
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="py-16 md:py-24 bg-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-0.5 bg-blue-500"></div>
              <span className="text-blue-600 text-xs font-semibold tracking-wider uppercase">المنتجات الرقمية</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0d1b2e] leading-tight">
              حوّل خبرتي إلى{" "}
              <span className="text-blue-600">أدوات تساعدك</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm text-right text-sm">
            كتب ومكتبات برومبتات مصممة لتوفير وقتك وتحسين نتائجك
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-product-shop>
          {books.map((book) => (
            <div
              key={book.id}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 transition-all duration-300 flex flex-col"
            >
              {/* Cover */}
              <div className="relative overflow-hidden">
                <div className="w-full h-56 overflow-hidden">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {book.featured && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    مميز
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="mb-2">
                  <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-0.5 rounded-full">{book.category}</span>
                </div>
                <h3 className="text-[#0d1b2e] font-black text-sm mb-1 leading-snug">{book.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{book.description}</p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-blue-600 font-black text-lg">{book.price}</span>
                  <button
                    onClick={() => navigate(book.buy_url || "/books")}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
                  >
                    اشترِ الآن
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-l from-blue-600 to-blue-800 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <h3 className="text-white font-black text-xl md:text-2xl mb-2">
              هل تريد مشروعًا مخصصًا؟
            </h3>
            <p className="text-white/70 text-sm">
              احجز جلسة استشارية مجانية لمدة 30 دقيقة ونناقش مشروعك
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <button
              onClick={() => navigate("/services/consultation")}
              className="bg-white text-blue-700 font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-all duration-200 cursor-pointer whitespace-nowrap text-sm"
            >
              احجز جلسة مجانية
            </button>
            <button
              onClick={() => navigate("/services/ai-product-photography")}
              className="border-2 border-white/40 text-white font-bold px-6 py-3 rounded-full hover:border-white transition-all duration-200 cursor-pointer whitespace-nowrap text-sm"
            >
              اطلب عرض سعر
            </button>
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/books")}
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-3 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap text-sm"
          >
            تصفح كل المنتجات
          </button>
        </div>
      </div>
    </section>
  );
};

export default BooksSection;