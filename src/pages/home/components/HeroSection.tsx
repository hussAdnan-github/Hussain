import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const HeroSection = () => {
  const [stats, setStats] = useState([
    { value: "+200", label: "مشروع منجز" },
    { value: "+50", label: "عميل راضٍ" },
    { value: "2", label: "كتب منشورة" },
    { value: "500k+", label: "مشاهدة" },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          { count: portfolioCount },
          { count: testimonialsCount },
          { count: booksCount },
        ] = await Promise.all([
          supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
          supabase.from("testimonials").select("*", { count: "exact", head: true }),
          supabase.from("books").select("*", { count: "exact", head: true }),
        ]);

        const pCount = portfolioCount || 0;
        const tCount = testimonialsCount || 0;
        const bCount = booksCount || 0;
        const totalContent = pCount + bCount;
        const estimatedViews = totalContent > 0 ? `${Math.floor(totalContent * 340 / 1000)}k+` : "500k+";

        setStats([
          { value: `+${pCount || 200}`, label: "مشروع منجز" },
          { value: `+${tCount || 50}`, label: "عميل راضٍ" },
          { value: `${bCount || 2}`, label: "كتب منشورة" },
          { value: estimatedViews, label: "مشاهدة" },
        ]);
      } catch {
        // keep default stats
      }
    }
    loadStats();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const tools = [
    { name: "Nano Banana", icon: "ri-image-ai-line" },
    { name: "Seedance", icon: "ri-film-ai-line" },
    { name: "Kling", icon: "ri-video-ai-line" },
    { name: "Premiere", icon: "ri-scissors-cut-line" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      dir="rtl"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=cinematic%20dark%20blue%20abstract%20background%20with%20light%20rays%20and%20particles%2C%20professional%20photography%20studio%20atmosphere%2C%20deep%20navy%20blue%20gradient%2C%20subtle%20bokeh%20effects%2C%20ultra%20high%20quality&width=1920&height=1080&seq=hero-bg&orientation=landscape"
          alt="background"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2e]/80 via-[#0d1b2e]/60 to-[#0d1b2e]/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2e]/70 via-transparent to-[#0d1b2e]/40"></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/10 animate-pulse"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 12}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-20 pb-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-blue-300 text-sm font-medium">فني AI&nbsp;</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              من فكرة خام إلى{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-300 italic">
                مشهد سينمائي
              </span>{" "}
              جاهز للنشر باستخدام AI
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
              أصنع صورًا واعلانات سينمائية بالذكاء الاصطناعي للعلامات التجارية وصناع المحتوى. بجودة عالية وتكلفة أقل.
            </p>

            <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection("#portfolio")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap text-sm"
              >
                <i className="ri-play-circle-line ml-2"></i>
                شاهد الأعمال
              </button>
              <button
                onClick={() => scrollToSection("#services")}
                className="border-2 border-white/30 hover:border-blue-400 text-white hover:text-blue-300 font-bold px-6 py-3 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap text-sm"
              >
                <i className="ri-arrow-left-line ml-2"></i>
                اطلب مشروعك
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 justify-items-center lg:justify-items-start">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl md:text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-white/50 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Tools */}
            <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
              <span className="text-white/40 text-sm">أدوات:</span>
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className={`${tool.icon} text-blue-400 text-xs`}></i>
                  </div>
                  <span className="text-white/60 text-xs">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Personal Photo */}
          <div className="flex-1 hidden lg:flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="relative rounded-3xl overflow-hidden border border-white/20" style={{ height: "480px" }}>
                <img
                  src="https://storage.readdy-site.link/project_files/89593955-b165-4908-8cef-673a8d5d832b/53fb9054-62a0-41bc-8464-18a6e2a73acb_hf_20260123_215330_37846dd6-76eb-434c-977b-73104a61e09f-copy.png?v=7c51afc402940992b54af964c096aa25"
                  alt="حسن جمال الليل"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d1b2e]/80 to-transparent"></div>
              </div>

              {/* Floating card - rating */}
              <div className="absolute -top-3 -right-3 bg-[#0d1b2e]/90 backdrop-blur-sm border border-white/20 rounded-xl p-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-star-fill text-amber-400 text-xs"></i>
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">4.9/5</div>
                    <div className="text-white/40 text-[10px]">تقييم العملاء</div>
                  </div>
                </div>
              </div>

              {/* Floating card - AI */}
              <div className="absolute -bottom-3 -left-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-magic-line text-white text-xs"></i>
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">AI Artist</div>
                    <div className="text-white/60 text-[10px]">فني AI محترف</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default HeroSection;
