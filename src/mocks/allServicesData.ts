export const serviceCategories = [
  {
    id: "visual-production",
    icon: "ri-camera-ai-line",
    title: "إنتاج الصور بالـ AI",
    subtitle: "صور سينمائية تبيع وتؤثر",
    description: "إنتاج صور احترافية باستخدام أحدث نماذج الذكاء الاصطناعي. من تصوير المنتجات إلى البورتريه الاحترافي.",
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/20 text-emerald-300",
    services: [
      {
        id: "product-photography",
        title: "تصوير المنتجات",
        description: "صور منتجات احترافية بخلفيات مخصصة وإضاءة سينمائية تزيد من مبيعاتك",
        price: "يبدأ من 300$",
        duration: "2-3 أيام",
        deliverables: ["10 صور عالية الجودة", "3 خلفيات مختلفة", "ملفات RAW", "حقوق استخدام كاملة"],
        image: "https://readdy.ai/api/search-image?query=professional%20AI%20generated%20product%20photography%2C%20luxury%20perfume%20bottle%20on%20dark%20elegant%20background%2C%20cinematic%20studio%20lighting%2C%20ultra%20high%20quality%20commercial%20photography%2C%20dramatic%20shadows&width=600&height=400&seq=srv-prod1&orientation=landscape"
      },
      {
        id: "brand-visuals",
        title: "هوية بصرية للعلامة التجارية",
        description: "مجموعة صور متكاملة تعكس هوية علامتك التجارية وتميزها في السوق",
        price: "يبدأ من 600$",
        duration: "5-7 أيام",
        deliverables: ["20 صورة متناسقة", "دليل الهوية البصرية", "قوالب سوشيال ميديا", "ملفات قابلة للتعديل"],
        image: "https://readdy.ai/api/search-image?query=luxury%20brand%20visual%20identity%20AI%20photography%2C%20elegant%20fashion%20accessories%20flat%20lay%2C%20minimalist%20dark%20background%2C%20professional%20commercial%20photography%2C%20high%20end%20aesthetic&width=600&height=400&seq=srv-brand1&orientation=landscape"
      },
      {
        id: "portrait",
        title: "البورتريه الاحترافي",
        description: "صور شخصية احترافية بإضاءة سينمائية مثالية للـ LinkedIn والمواقع الشخصية",
        price: "يبدأ من 200$",
        duration: "1-2 يوم",
        deliverables: ["5 صور نهائية", "خلفيتان مختلفتان", "تعديل احترافي", "تسليم سريع"],
        image: "https://readdy.ai/api/search-image?query=AI%20generated%20professional%20portrait%20photography%2C%20confident%20businessman%20dark%20studio%20background%2C%20dramatic%20cinematic%20lighting%2C%20ultra%20realistic%20headshot%2C%20professional%20photography&width=600&height=400&seq=srv-port1&orientation=landscape"
      }
    ]
  },
  {
    id: "video-production",
    icon: "ri-film-ai-line",
    title: "إنتاج الفيديو بالـ AI",
    subtitle: "محتوى فيديو سينمائي بتكلفة أقل",
    description: "إنتاج فيديوهات احترافية باستخدام أحدث أدوات الذكاء الاصطناعي مثل Runway وKling. من الإعلانات القصيرة إلى الأفلام المفاهيمية.",
    color: "from-orange-500/20 to-orange-600/10",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400",
    badgeColor: "bg-orange-500/20 text-orange-300",
    services: [
      {
        id: "ad-video",
        title: "إعلان فيديو احترافي",
        description: "إعلانات فيديو قصيرة وجذابة للسوشيال ميديا تزيد من معدلات التحويل",
        price: "يبدأ من 500$",
        duration: "3-5 أيام",
        deliverables: ["فيديو 15-30 ثانية", "3 نسخ مختلفة", "موسيقى مرخصة", "صيغ متعددة"],
        image: "https://readdy.ai/api/search-image?query=cinematic%20AI%20video%20production%20advertisement%2C%20dramatic%20product%20reveal%20dark%20background%2C%20professional%20video%20frame%2C%20motion%20graphics%2C%20high%20quality%20commercial%20video%20production&width=600&height=400&seq=srv-vid1&orientation=landscape"
      },
      {
        id: "short-film",
        title: "فيلم قصير مفاهيمي",
        description: "أفلام قصيرة إبداعية تحكي قصة علامتك التجارية بأسلوب سينمائي مميز",
        price: "يبدأ من 1200$",
        duration: "7-14 يوم",
        deliverables: ["فيلم 1-3 دقائق", "سيناريو كامل", "موسيقى تصويرية", "حقوق كاملة"],
        image: "https://readdy.ai/api/search-image?query=cinematic%20short%20film%20AI%20production%2C%20dramatic%20dark%20moody%20scene%2C%20professional%20cinematography%2C%20artistic%20visual%20storytelling%2C%20high%20quality%20film%20production&width=600&height=400&seq=srv-film1&orientation=landscape"
      }
    ]
  },
  {
    id: "training-consulting",
    icon: "ri-graduation-cap-line",
    title: "التدريب والاستشارات",
    subtitle: "علّمك تصنع بنفسك",
    description: "جلسات تدريبية فردية وورش عمل جماعية لتعليمك كيفية استخدام الذكاء الاصطناعي في الإنتاج البصري.",
    color: "from-amber-500/20 to-amber-600/10",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/20 text-amber-300",
    services: [
      {
        id: "one-on-one",
        title: "جلسة فردية",
        description: "جلسة تدريبية مخصصة 1:1 لتعلم أدوات الذكاء الاصطناعي المناسبة لمجالك",
        price: "150$/ساعة",
        duration: "ساعة واحدة",
        deliverables: ["تدريب مخصص", "ملاحظات مكتوبة", "موارد إضافية", "متابعة لأسبوع"],
        image: "https://readdy.ai/api/search-image?query=professional%20one%20on%20one%20coaching%20session%2C%20dark%20elegant%20office%20setting%2C%20mentor%20and%20student%20working%20together%2C%20professional%20business%20consultation%2C%20modern%20workspace&width=600&height=400&seq=srv-coach1&orientation=landscape"
      },
      {
        id: "workshop",
        title: "ورشة عمل جماعية",
        description: "ورشة عمل تفاعلية لفريقك لتعلم أدوات الذكاء الاصطناعي وتطبيقها في العمل",
        price: "يبدأ من 800$",
        duration: "يوم كامل",
        deliverables: ["8 ساعات تدريب", "مواد تعليمية", "تطبيق عملي", "شهادة حضور"],
        image: "https://readdy.ai/api/search-image?query=professional%20workshop%20training%20session%2C%20group%20of%20professionals%20learning%20AI%20tools%2C%20modern%20conference%20room%20dark%20aesthetic%2C%20collaborative%20learning%20environment&width=600&height=400&seq=srv-work1&orientation=landscape"
      }
    ]
  }
];

export const processSteps = [
  { step: "01", title: "التواصل والفهم", description: "نتحدث عن مشروعك وأهدافك وما تريد تحقيقه بالتفصيل" },
  { step: "02", title: "التخطيط والتصميم", description: "أضع خطة واضحة للمشروع مع الجدول الزمني والتكلفة" },
  { step: "03", title: "التنفيذ والإنتاج", description: "أبدأ العمل باستخدام أحدث أدوات الذكاء الاصطناعي" },
  { step: "04", title: "التسليم والمتابعة", description: "تسليم المشروع مع ضمان رضاك الكامل ودعم ما بعد التسليم" }
];

export const stats = [
  { value: "+200", label: "مشروع منجز", icon: "ri-briefcase-4-line" },
  { value: "+50", label: "عميل راضٍ", icon: "ri-user-smile-line" },
  { value: "4.9", label: "متوسط التقييم", icon: "ri-star-fill" },
  { value: "24h", label: "متوسط وقت الرد", icon: "ri-time-line" }
];
