import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const navigate = useNavigate();
  const specializations = [
    { icon: "ri-camera-ai-line", label: "AI Photography" },
    { icon: "ri-film-line", label: "Film Editing" },
    { icon: "ri-code-s-slash-line", label: "Prompt Engineering" },
    { icon: "ri-palette-line", label: "Visual Direction" },
  ];

  const tools = [
    "Claude Code", "Chat GPT", "Nano Banana", "Seedance", "Kling", "Premiere"
  ];

  const achievements = [
    { icon: "ri-folder-check-line", value: "+200", label: "مشروع منجز" },
    { icon: "ri-user-star-line", value: "+50", label: "عميل راضٍ" },
    { icon: "ri-book-2-line", value: "4", label: "كتب منشورة" },
    { icon: "ri-eye-line", value: "5M+", label: "مشاهدة" },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-[#f8faff]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          {/* Image */}
          <div className="flex-shrink-0 hidden lg:flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-64 h-72 md:w-72 md:h-80 rounded-2xl overflow-hidden border-4 border-blue-500/30 shadow-2xl shadow-blue-200">
                <img
                  src="https://static.readdy.ai/image/8d67d4b5b60a62e7b1df4167f7b5245a/063058724ec35e84d75517ddfc59765d.png"
                  alt="حسن جمال الليل"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white rounded-xl p-3 shadow-xl">
                <div className="text-xl font-black">7+</div>
                <div className="text-xs text-blue-100">سنوات خبرة</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-right">
            <div className="flex items-center gap-2 mb-3 justify-center lg:justify-start">
              <div className="w-6 h-0.5 bg-blue-500"></div>
              <span className="text-blue-600 text-xs font-semibold tracking-wider uppercase">من أنا</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0d1b2e] leading-tight mb-4">
              أدمج الحس البصري مع{" "}
              <span className="text-blue-600">قوة الذكاء الاصطناعي</span>
            </h2>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
              أنا <strong className="text-[#0d1b2e]">حسن جمال الليل</strong>، فني AI متخصص في الإنتاج البصري بالذكاء الاصطناعي. بدأت رحلتي في التصوير التقليدي قبل أن أكتشف إمكانيات AI الهائلة في عام 2023.
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
              أدمج بين الحس البصري للمصور، عقلية المونتير، وقوة الذكاء الاصطناعي لصناعة صور وأفلام تخدم هدفًا واضحًا: <strong className="text-blue-600">جذب الانتباه، بناء الثقة، وتحويل الفكرة إلى محتوى قابل للبيع.</strong>
            </p>

            {/* Specializations */}
            <div className="flex flex-wrap gap-2 mb-5 justify-center lg:justify-start">
              {specializations.map((spec) => (
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

            {/* Tools */}
            <div className="mb-5">
              <p className="text-gray-400 text-xs mb-2">الأدوات المستخدمة:</p>
              <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="bg-[#0d1b2e] text-white text-xs px-2.5 py-1 rounded-full font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {achievements.map((ach) => (
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
