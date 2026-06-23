import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/pages/home/components/Navbar";
import FooterSection from "@/pages/home/components/FooterSection";
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

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { value: "+200", label: "مشروع منجز", icon: "ri-briefcase-4-line" },
    { value: "+50", label: "عميل راضٍ", icon: "ri-user-smile-line" },
    { value: "4.9", label: "متوسط التقييم", icon: "ri-star-fill" },
    { value: "24h", label: "متوسط وقت الرد", icon: "ri-time-line" },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const { data: svcData } = await supabase
          .from("services")
          .select("*")
          .order("order_index", { ascending: true });

        setServices(svcData || []);

        const [{ count: portfolioCount }, { count: testimonialsCount }] = await Promise.all([
          supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
          supabase.from("testimonials").select("*", { count: "exact", head: true }),
        ]);

        setStats([
          { value: `+${portfolioCount || 200}`, label: "مشروع منجز", icon: "ri-briefcase-4-line" },
          { value: `+${testimonialsCount || 50}`, label: "عميل راضٍ", icon: "ri-user-smile-line" },
          { value: "4.9", label: "متوسط التقييم", icon: "ri-star-fill" },
          { value: "24h", label: "متوسط وقت الرد", icon: "ri-time-line" },
        ]);
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const processSteps = [
    { step: "01", title: "التواصل والفهم", description: "نتحدث عن مشروعك وأهدافك وما تريد تحقيقه بالتفصيل" },
    { step: "02", title: "التخطيط والتصميم", description: "أضع خطة واضحة للمشروع مع الجدول الزمني والتكلفة" },
    { step: "03", title: "التنفيذ والإنتاج", description: "أبدأ العمل باستخدام أحدث أدوات الذكاء الاصطناعي" },
    { step: "04", title: "التسليم والمتابعة", description: "تسليم المشروع مع ضمان رضاك الكامل ودعم ما بعد التسليم" },
  ];

  const defaultIcon = "ri-customer-service-2-line";

  return (
    <div className="min-h-screen bg-[#0d1b2e]" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=cinematic%20dark%20abstract%20background%20with%20subtle%20light%20rays%2C%20deep%20navy%20blue%20atmosphere%2C%20professional%20creative%20studio%2C%20ultra%20high%20quality%20dark%20background%20with%20minimal%20light%20effects&width=1920&height=600&seq=services-hero-bg&orientation=landscape"
            alt="background"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2e]/85 via-[#0d1b2e]/70 to-[#0d1b2e]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-service-line text-white/70 text-xs"></i>
            </div>
            <span className="text-white/70 text-sm">خدماتي الاحترافية</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            كل ما تحتاجه في{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-300">
              الإنتاج البصري
            </span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            أقدم خدمات متكاملة في الإنتاج البصري والمحتوى الرقمي باستخدام أحدث أدوات الذكاء الاصطناعي. من الفكرة إلى المنتج النهائي.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <i className={`${stat.icon} text-blue-400 text-lg`}></i>
                </div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-white/50 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-blue-400"></div>
              <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">الباقات والأسعار</span>
              <div className="w-6 h-0.5 bg-blue-400"></div>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-2">جميع الخدمات</h2>
            <p className="text-white/50 text-xs max-w-lg mx-auto">{services.length} خدمة متاحة</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-customer-service-2-line text-white/30 text-2xl"></i>
              </div>
              <p className="text-white/40 text-sm">لا توجد خدمات حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                        <i className={`${service.icon || defaultIcon} text-blue-400 text-lg`}></i>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base">{service.title}</h3>
                        {service.price && (
                          <span className="text-blue-400 text-xs font-semibold">{service.price}</span>
                        )}
                      </div>
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
                      {service.description || "—"}
                    </p>

                    {service.features && service.features.length > 0 && (
                      <div className="space-y-2 mb-5">
                        {service.features.slice(0, 4).map((f, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                              <i className="ri-check-line text-emerald-400 text-xs"></i>
                            </div>
                            <span className="text-white/50 text-xs">{f}</span>
                          </div>
                        ))}
                        {service.features.length > 4 && (
                          <p className="text-white/30 text-xs pr-6">+{service.features.length - 4} ميزات إضافية</p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-white font-bold text-sm">{service.price || "اتصل بنا"}</span>
                      <span className="text-white/40 group-hover:text-white text-sm flex items-center gap-1 transition-colors whitespace-nowrap">
                        التفاصيل
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-arrow-left-line text-xs"></i>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-12 md:py-16 bg-white/3 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-blue-400"></div>
              <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">طريقة العمل</span>
              <div className="w-6 h-0.5 bg-blue-400"></div>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-2">كيف نعمل معاً؟</h2>
            <p className="text-white/50 text-xs max-w-lg mx-auto">عملية واضحة وشفافة من البداية للنهاية</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-0 w-full h-0.5 bg-gradient-to-l from-white/20 to-transparent z-0"></div>
                )}
                <div className="relative z-10 bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-400 font-black text-base">{step.step}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="relative bg-gradient-to-br from-blue-600/30 to-blue-800/20 border border-blue-500/30 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-blue-500/10 animate-pulse"
                  style={{
                    width: `${120 + i * 60}px`,
                    height: `${120 + i * 60}px`,
                    top: `${-20 + i * 20}%`,
                    right: `${-10 + i * 5}%`,
                    animationDelay: `${i * 1}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600/30 border border-blue-500/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="ri-rocket-2-line text-blue-400 text-xl"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mb-3">
                جاهز تبدأ مشروعك؟
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-lg mx-auto">
                تواصل معي الآن وسنناقش مشروعك بالتفصيل. أول استشارة مجانية تماماً.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate(services.length > 0 ? `/services/${services[0].id}` : "/contact")}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap text-sm"
                >
                  <i className="ri-calendar-check-line ml-2"></i>
                  احجز استشارة مجانية
                </button>
                <button
                  onClick={() => navigate("/portfolio")}
                  className="border-2 border-white/30 hover:border-white/60 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap text-sm"
                >
                  <i className="ri-gallery-line ml-2"></i>
                  شاهد الأعمال أولاً
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default ServicesPage;