import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../home/components/Navbar";
import FooterSection from "../home/components/FooterSection";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  price: string | null;
  features: string[] | null;
  order_index: number | null;
  created_at: string | null;
}

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        setService(data);
      } catch {
        // not found
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1b2e] flex items-center justify-center" dir="rtl">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0d1b2e] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-blue-400 text-2xl"></i>
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">الخدمة غير موجودة</h1>
          <p className="text-white/50 mb-6">الخدمة التي تبحث عنها غير متوفرة حالياً</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const defaultFaqs = [
    { question: "كيف يمكنني طلب الخدمة؟", answer: "يمكنك التواصل معي مباشرة عبر صفحة التواصل أو البريد الإلكتروني. سنناقش مشروعك بالتفصيل ونحدد الباقة المناسبة." },
    { question: "ما هي مدة التسليم؟", answer: "تختلف المدة حسب الباقة المختارة. عادةً ما تستغرق الخدمة من 3 إلى 7 أيام عمل." },
    { question: "هل يمكن التعديل بعد التسليم؟", answer: "بالتأكيد! جميع الباقات تتضمن تعديلات مجانية حسب الباقة المختارة." },
  ];

  return (
    <div className="min-h-screen bg-[#0d1b2e]" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-arrow-right-line"></i>
            </div>
            العودة للخدمات
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
              <i className={`${service.icon || "ri-customer-service-2-line"} text-blue-400 text-2xl`}></i>
            </div>
            <div>
              <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">خدمة احترافية</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {service.title}
          </h1>
          <p className="text-white/60 text-lg max-w-3xl leading-relaxed">
            {service.description || "خدمة احترافية باستخدام أحدث أدوات الذكاء الاصطناعي"}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-2xl font-black text-white">{service.price || "—"}</div>
              <div className="text-white/50 text-xs mt-1">السعر</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-2xl font-black text-white">{(service.features || []).length}</div>
              <div className="text-white/50 text-xs mt-1">ميزات</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-2xl font-black text-white">#{service.order_index ?? 0}</div>
              <div className="text-white/50 text-xs mt-1">الترتيب</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-2xl font-black text-white">4.9</div>
              <div className="text-white/50 text-xs mt-1">التقييم</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 px-4 md:px-8 bg-[#0f2035]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <i className="ri-close-circle-line text-red-400 text-lg"></i>
              </div>
              <h3 className="text-white font-bold text-lg">المشكلة</h3>
            </div>
            <p className="text-white/60 leading-relaxed">
              الإنتاج البصري التقليدي مكلف ويستغرق وقتاً طويلاً. تحتاج فريق كامل ومعدات باهظة للحصول على نتائج احترافية.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <i className="ri-check-double-line text-emerald-400 text-lg"></i>
              </div>
              <h3 className="text-white font-bold text-lg">الحل</h3>
            </div>
            <p className="text-white/60 leading-relaxed">
              باستخدام أحدث أدوات الذكاء الاصطناعي، ننتج محتوى بصري احترافي بجودة سينمائية في وقت أقل وبتكلفة مناسبة.
            </p>
          </div>
        </div>
      </section>

      {/* Features/Deliverables */}
      {service.features && service.features.length > 0 && (
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-0.5 bg-blue-400"></div>
              <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">المميزات والتسليمات</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8">ماذا تشمل الخدمة</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.features.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-blue-400 text-sm"></i>
                  </div>
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Workflow */}
      <section className="py-16 px-4 md:px-8 bg-[#0f2035]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-0.5 bg-blue-400"></div>
            <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">آلية العمل</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-10">كيف نعمل</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: "تحليل الاحتياج", description: "نفهم مشروعك وأهدافك والأسلوب البصري المناسب" },
              { step: 2, title: "التخطيط", description: "نضع خطة واضحة مع الجدول الزمني والتكلفة" },
              { step: 3, title: "التنفيذ", description: "نبدأ الإنتاج باستخدام أحدث أدوات الذكاء الاصطناعي" },
              { step: 4, title: "التسليم", description: "تسليم المشروع مع ضمان الجودة ودعم ما بعد التسليم" },
            ].map((step) => (
              <div key={step.step} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">
                  {step.step}
                </div>
                <h4 className="text-white font-bold text-sm mb-2">{step.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suitable For */}
      <section className="py-12 px-4 md:px-8 bg-[#0f2035]">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-white font-bold text-lg mb-4">مناسبة لـ</h3>
          <div className="flex flex-wrap gap-3">
            {["العلامات التجارية", "المتاجر الإلكترونية", "صناع المحتوى", "وكالات التسويق", "المصورين", "الشركات الناشئة"].map((item, i) => (
              <span key={i} className="bg-blue-600/20 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 md:px-8 bg-[#0f2035]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-0.5 bg-blue-400"></div>
            <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">الأسئلة الشائعة</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-8">أسئلة متكررة</h2>

          <div className="space-y-4">
            {defaultFaqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-right cursor-pointer"
                >
                  <span className="text-white font-semibold text-sm">{faq.question}</span>
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <i className={`ri-arrow-down-s-line text-white/50 transition-transform ${openFaq === i ? "rotate-180" : ""}`}></i>
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-white/50 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            جاهز تبدأ مشروعك؟
          </h2>
          <p className="text-white/50 mb-8">
            اطلب الخدمة الآن واحصل على استشارة مجانية قبل البدء
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors cursor-pointer whitespace-nowrap">
              اطلب {service.title}
            </button>
            <button
              onClick={() => navigate("/services")}
              className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              شوف خدمات ثانية
            </button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default ServiceDetailPage;