import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface AboutSettings {
  about_name: string;
  about_title: string;
  about_heading: string;
  about_title_highlight: string;
  about_bio_1: string;
  about_bio_2: string;
  about_years_exp: string;
  about_photo_url: string;
  about_specializations: { icon: string; label: string }[];
  about_tools: string[];
  whatsapp_number: string;
}

interface Achievement {
  icon: string;
  value: string;
  label: string;
}

const AboutSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AboutSettings>({
    about_name: "",
    about_title: "",
    about_heading: "",
    about_title_highlight: "",
    about_bio_1: "",
    about_bio_2: "",
    about_years_exp: "",
    about_photo_url: "",
    about_specializations: [],
    about_tools: [],
    whatsapp_number: "",
  });
  const [stats, setStats] = useState<Achievement[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [settingsRes, statsRes] = await Promise.all([
          supabase
            .from("site_settings")
            .select("about_name, about_title, about_heading, about_title_highlight, about_bio_1, about_bio_2, about_years_exp, about_photo_url, about_specializations, about_tools, whatsapp_number")
            .eq("id", 1)
            .maybeSingle(),
          supabase.from("site_settings").select("home_stats").eq("id", 1).maybeSingle(),
        ]);

        if (!mounted) return;

        const s = settingsRes.data;
        if (s) {
          setSettings({
            about_name: s.about_name || "",
            about_title: s.about_title || "",
            about_heading: s.about_heading || "",
            about_title_highlight: s.about_title_highlight || "",
            about_bio_1: s.about_bio_1 || "",
            about_bio_2: s.about_bio_2 || "",
            about_years_exp: s.about_years_exp || "",
            about_photo_url: s.about_photo_url || "",
            about_specializations: Array.isArray(s.about_specializations) ? s.about_specializations : [],
            about_tools: Array.isArray(s.about_tools) ? s.about_tools : [],
            whatsapp_number: s.whatsapp_number || "",
          });
        }

        const st = statsRes.data;
        if (st?.home_stats && Array.isArray(st.home_stats) && st.home_stats.length > 0) {
          setStats(st.home_stats as Achievement[]);
        }
      } catch {
        // leave empty; skeleton disappears once loading completes
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const { about_name, about_title, about_heading, about_title_highlight, about_bio_1, about_bio_2, about_years_exp, about_photo_url, about_specializations, about_tools } = settings;

  return (
    <section id="about" className="py-16 md:py-24 bg-[#f8faff]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* Image */}
          <div className="flex-shrink-0 hidden lg:flex justify-center lg:justify-start">
            {loading ? (
              <div className="w-64 h-72 md:w-72 md:h-80 rounded-2xl bg-gray-200 animate-pulse"></div>
            ) : about_photo_url ? (
              <div className="relative">
                <div className="w-64 h-72 md:w-72 md:h-80 rounded-2xl overflow-hidden border-4 border-blue-500/30 shadow-2xl shadow-blue-200">
                  <img
                    src={about_photo_url}
                    alt={about_name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white rounded-xl p-3 shadow-xl">
                  <div className="text-xl font-black">{about_years_exp}</div>
                  <div className="text-xs text-blue-100">سنوات خبرة</div>
                </div>
              </div>
            ) : (
              <div className="w-64 h-72 md:w-72 md:h-80 rounded-2xl bg-gray-200"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-right">
            {loading ? (
              <div className="animate-pulse space-y-5">
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto lg:mx-0"></div>
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto lg:mx-0"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-1/2 mx-auto lg:mx-0"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto lg:mx-0"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto lg:mx-0"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3 justify-center lg:justify-start">
                  <div className="w-6 h-0.5 bg-blue-500"></div>
                  <span className="text-blue-600 text-xs font-semibold tracking-wider uppercase">من أنا</span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0d1b2e] leading-tight mb-4">
                  {about_heading}{" "}
                  <span className="text-blue-600">{about_title_highlight}</span>
                </h2>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
                  أنا <strong className="text-[#0d1b2e]">{about_name}</strong>، {about_title} متخصص في الإنتاج البصري بالذكاء الاصطناعي. {about_bio_1.replace(`أنا ${about_name}، `, "").replace(`${about_title} `, "")}
                </p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                  {about_bio_2.replace("أدمج بين الحس البصري للمصور، عقلية المونتير، وقوة الذكاء الاصطناعي لصناعة صور وأفلام تخدم هدفًا واضحًا: ", "").replace("أدمج بين الحس البصري للمصور، عقلية المونتير، وقوة الذكاء الاصطناعي ", "")}
                </p>

                {/* Specializations */}
                {about_specializations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5 justify-center lg:justify-start">
                    {about_specializations.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5"
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className={`${spec.icon} text-blue-600 text-xs`}></i>
                        </div>
                        <span className="text-blue-700 text-xs font-medium">{spec.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tools */}
                {about_tools.length > 0 && (
                  <div className="mb-5">
                    <p className="text-gray-400 text-xs mb-2">الأدوات المستخدمة:</p>
                    <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                      {about_tools.map((tool) => (
                        <span
                          key={tool}
                          className="bg-[#0d1b2e] text-white text-xs px-2.5 py-1 rounded-full font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {stats.map((ach) => (
                    <div key={ach.label} className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                      <div className="w-6 h-6 flex items-center justify-center mx-auto mb-1">
                        <i className={`${ach.icon} text-blue-600 text-base`}></i>
                      </div>
                      <div className="text-lg font-black text-[#0d1b2e]">{ach.value}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{ach.label}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/about")}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap inline-flex items-center gap-2 text-sm mx-auto lg:mx-0"
                >
                  اقرأ القصة كاملة
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-arrow-left-line text-sm"></i>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;