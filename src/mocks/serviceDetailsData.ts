export interface ServiceDetail {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  problem: string;
  solution: string;
  examples: { title: string; image: string; category: string }[];
  workflow: { step: number; title: string; description: string }[];
  deliverables: string[];
  packages: { name: string; price: string; features: string[]; popular?: boolean }[];
  duration: string;
  suitableFor: string[];
  faqs: { question: string; answer: string }[];
}

export const serviceDetails: ServiceDetail[] = [
  {
    id: "ai-product-photography",
    icon: "ri-camera-ai-line",
    title: "توليد الصور بالـ AI",
    subtitle: "AI Product Photography",
    description: "صور منتجات احترافية بدون جلسة تصوير تقليدية. نحول صورك البسيطة إلى صور تجارية سينمائية باستخدام أحدث نماذج الذكاء الاصطناعي.",
    problem: "التصوير التقليدي للمنتجات مكلف ويستغرق أياماً. استوديو، إضاءة، مصور.. كل هذا يأكل الميزانية والوقت. والنتيجة؟ غالباً ما تكون صور عادية لا تبيع.",
    solution: "باستخدام أدوات الذكاء الاصطناعي ننتج صور منتجات احترافية بجودة تجارية في ساعات بدلاً من أيام. صور تبرز منتجك وتجعله يتصدر.",
    examples: [
      { title: "عطر فاخر - حملة إعلانية", image: "https://readdy.ai/api/search-image?query=luxury%20perfume%20bottle%20product%20photography%2C%20dramatic%20lighting%2C%20dark%20elegant%20background%2C%20commercial%20advertising%20style%2C%20high-end%20cosmetic%20product%20shot%2C%20cinematic%20mood&width=600&height=400&seq=prod1&orientation=landscape", category: "منتجات" },
      { title: "ساعة رجالية - إعلان سوشيال", image: "https://readdy.ai/api/search-image?query=premium%20mens%20watch%20product%20photography%2C%20sleek%20metallic%20surface%2C%20dramatic%20shadows%2C%20luxury%20commercial%20style%2C%20dark%20background%20with%20subtle%20reflections&width=600&height=400&seq=prod2&orientation=landscape", category: "منتجات" },
      { title: "قهوة مختصة - تصوير تجاري", image: "https://readdy.ai/api/search-image?query=specialty%20coffee%20product%20photography%2C%20warm%20tones%2C%20rustic%20wooden%20surface%2C%20steam%20rising%20from%20cup%2C%20commercial%20food%20photography%20style%2C%20appetizing%20composition&width=600&height=400&seq=prod3&orientation=landscape", category: "مطاعم" },
    ],
    workflow: [
      { step: 1, title: "تحليل المنتج", description: "نفهم منتجك، جمهورك المستهدف، والأسلوب البصري المناسب" },
      { step: 2, title: "كتابة البرومبت", description: "نصمم برومبتات مخصصة لأدوات AI لضمان أفضل النتيجة" },
      { step: 3, title: "التوليد والتعديل", description: "نولد الصور ونعدلها حتى الوصول للنتيجة المثالية" },
      { step: 4, title: "التلميع النهائي", description: "تعديلات في Photoshop للحصول على صورة جاهزة للنشر" },
    ],
    deliverables: ["5-20 صورة منتج احترافية", "صيغة عالية الدقة (4K)", "خلفيات شفافة متوفرة", "حقوق استخدام كاملة", "ملفات PSD للتعديل"],
    packages: [
      { name: "باقة البداية", price: "300$", features: ["5 صور منتج", "خلفية واحدة", "تسليم خلال 3 أيام", "تعديلتين مجاناً"] },
      { name: "باقة النمو", price: "600$", features: ["12 صورة منتج", "3 خلفيات مختلفة", "تسليم خلال 5 أيام", "تعديلات غير محدودة", "صور بزوايا متعددة"], popular: true },
      { name: "باقة العلامة التجارية", price: "1200$", features: ["25 صورة منتج", "خلفيات مخصصة", "تسليم خلال 7 أيام", "تعديلات غير محدودة", "ستايل جايد", "صور بانورامية"] },
    ],
    duration: "3-7 أيام عمل",
    suitableFor: ["متاجر إلكترونية", "علامات تجارية جديدة", "مصممي منتجات", "وكالات تسويق"],
    faqs: [
      { question: "هل أحتاج صور أولية للمنتج؟", answer: "نعم، نحتاج صورة بسيطة للمنتج لضمان الدقة. لكن حتى الصور من الموبايل كافية!" },
      { question: "هل يمكن تعديل الصور لاحقاً؟", answer: "بالتأكيد. كل الباقات تشمل تعديلات، والباقات الأعلى تتضمن تعديلات غير محدودة." },
      { question: "هل الصور جاهزة للاستخدام التجاري؟", answer: "نعم 100%. تحصل على حقوق استخدام كاملة دون قيود." },
    ],
  },
  {
    id: "ai-film-concept",
    icon: "ri-film-line",
    title: "توليد الفيديو بالـ AI",
    subtitle: "AI Video Generation",
    description: "إنتاج فيديوهات احترافية باستخدام الذكاء الاصطناعي، من الإعلانات القصيرة إلى الأفلام القصيرة بجودة سينمائية.",
    problem: "إنتاج فيديو احترافي مكلف ويحتاج فريق كامل. تصوير، ممثلين، مواقع، مونتاج... كل هذا يأكل الميزانية والوقت. والنتيجة غالباً ما تكون أقل من المتوقع.",
    solution: "ننتج فيديوهات سينمائية كاملة باستخدام الذكاء الاصطناعي. من الإعلانات القصيرة إلى الأفلام القصيرة، بجودة احترافية وتكلفة أقل بكثير.",
    examples: [
      { title: "مشهد درامي - فيلم قصير", image: "https://readdy.ai/api/search-image?query=cinematic%20dramatic%20film%20scene%2C%20moody%20lighting%2C%20silhouette%20figure%2C%20foggy%20atmosphere%2C%20professional%20cinematography%20style%2C%20dark%20tones%2C%20film%20grain%20texture&width=600&height=400&seq=film1&orientation=landscape", category: "أفلام" },
      { title: "لقطة واسعة - فيلم خيال علمي", image: "https://readdy.ai/api/search-image?query=sci-fi%20cinematic%20wide%20shot%2C%20futuristic%20cityscape%2C%20neon%20lights%2C%20cyberpunk%20atmosphere%2C%20professional%20film%20production%20quality%2C%20dramatic%20perspective&width=600&height=400&seq=film2&orientation=landscape", category: "أفلام" },
      { title: "ستوري بورد - إعلان سيارة", image: "https://readdy.ai/api/search-image?query=storyboard%20frames%20for%20car%20commercial%2C%20multiple%20panels%20showing%20sequence%2C%20professional%20storyboard%20style%2C%20cinematic%20car%20shots%2C%20dynamic%20angles&width=600&height=400&seq=film3&orientation=landscape", category: "إعلانات" },
    ],
    workflow: [
      { step: 1, title: "السيناريو والرؤية", description: "نفهم قصتك، أسلوبك، والمزاج البصري المطلوب" },
      { step: 2, title: "تصميم البرومبت", description: "نبني برومبت سينمائي مفصل للكاميرا والإضاءة والحركة" },
      { step: 3, title: "توليد المشاهد", description: "نولد المشاهد بجودة احترافية باستخدام الذكاء الاصطناعي" },
      { step: 4, title: "المونتاج والتلوين", description: "مونتاج احترافي وتصحيح ألوان سينمائي" },
      { step: 5, title: "التسليم", description: "فيديو جاهز للعرض بجودة عالية مع ملفات المصدر" },
    ],
    deliverables: ["فيديو 15-60 ثانية", "ستوري بورد مرئي", "برومبت المستخدم", "ملفات عالية الجودة", "مونتاج احترافي"],
    packages: [
      { name: "باقة المشهد الواحد", price: "500$", features: ["مشهد واحد 15-30 ثانية", "ستوري بورد", "تسليم 5 أيام", "تعديلتين"] },
      { name: "باقة المخرج", price: "1000$", features: ["3 مشاهد متصلة", "ستوري بoard كامل", "تسليم 10 أيام", "تعديلات غير محدودة", "موسيقى خلفية"], popular: true },
      { name: "باقة الإنتاج", price: "2500$", features: ["فيلم قصير كامل", "10 مشاهد", "تسليم 3 أسابيع", "تعديلات غير محدودة", "صوت وموسيقى", "تصحيح ألوان سينمائي"] },
    ],
    duration: "5-21 يوم عمل",
    suitableFor: ["المخرجين", "منتجي الأفلام", "صناع المحتوى", "وكالات إعلانية"],
    faqs: [
      { question: "هل يمكن استخدام الفيديوهات في إنتاج تجاري؟", answer: "نعم، الفيديوهات جاهزة للاستخدام التجاري الكامل." },
      { question: "هل تدعم اللغة العربية؟", answer: "نعم، نستطيع إنتاج فيديوهات بالعربية سواءً نص أو صوت." },
      { question: "ما مدة الفيديو القصوى؟", answer: "نعمل على فيديوهات من 15 ثانية حتى 5 دقائق حسب احتياجك." },
    ],
  },
  {
    id: "ai-ad-creative",
    icon: "ri-advertisement-line",
    title: "الإعلانات الإبداعية بالذكاء الاصطناعي",
    subtitle: "AI Ad Creative",
    description: "إعلانات صور وفيديو احترافية للشركات والعلامات التجارية. محتوى يجذب الانتباه ويحفز على الشراء.",
    problem: "الإعلانات التقليدية مكلفة وتحتاج وقت طويل. والمحتوى الذي ينتجه الفريق الداخلي غالباً ما يكون مكرراً ولا يبرز في زحام المحتوى.",
    solution: "ننتج إعلانات صور وفيديو باستخدام AI بجودة تفوق الإنتاج التقليدي. محتوى فريد، سريع، ومحسّن للتحويل على كل المنصات.",
    examples: [
      { title: "إعلان تطبيق - حملة رقمية", image: "https://readdy.ai/api/search-image?query=mobile%20app%20advertisement%20creative%2C%20phone%20mockup%20with%20glowing%20screen%2C%20modern%20gradient%20background%2C%20social%20media%20ad%20style%2C%20professional%20marketing%20design&width=600&height=400&seq=ad1&orientation=landscape", category: "إعلانات" },
      { title: "إعلان عقار - فيديو قصير", image: "https://readdy.ai/api/search-image?query=luxury%20real%20estate%20advertisement%2C%20modern%20villa%20exterior%2C%20golden%20hour%20lighting%2C%20premium%20property%20marketing%2C%20cinematic%20drone%20shot%20style&width=600&height=400&seq=ad2&orientation=landscape", category: "عقار" },
      { title: "إعلان أزياء - حملة سوشيال", image: "https://readdy.ai/api/search-image?query=fashion%20brand%20social%20media%20advertisement%2C%20elegant%20model%20with%20luxury%20clothing%2C%20editorial%20style%20photography%2C%20bold%20typography%20space%2C%20premium%20fashion%20campaign&width=600&height=400&seq=ad3&orientation=landscape", category: "أزياء" },
    ],
    workflow: [
      { step: 1, title: "استراتيجية الحملة", description: "نفهم هدفك، جمهورك، والمنصات المستهدفة" },
      { step: 2, title: "تصميم المفاهيم", description: "3-5 مفاهيم إبداعية مختلفة للإعلان" },
      { step: 3, title: "الإنتاج", description: "توليد الصور/الفيديوهات بجودة احترافية" },
      { step: 4, title: "النسخ والتصميم", description: "كتابة نصوص الإعلان وتصميم التخطيط النهائي" },
    ],
    deliverables: ["5-15 إعلان صورة", "2-5 إعلان فيديو", "نسخ إعلانية جاهزة", "تصاميم بمقاسات متعددة", "تقرير أداء مقترح"],
    packages: [
      { name: "باقة التجربة", price: "400$", features: ["5 إعلانات صورة", "منصة واحدة", "تسليم 3 أيام", "تعديلتين"] },
      { name: "باقة النمو", price: "900$", features: ["12 إعلان صورة", "3 إعلانات فيديو", "3 منصات", "تسليم 7 أيام", "تعديلات غير محدودة", "نسخ إعلانية"], popular: true },
      { name: "باقة التفوق", price: "1800$", features: ["25 إعلان صورة", "8 إعلانات فيديو", "كل المنصات", "تسليم 14 يوم", "تعديلات غير محدودة", "استراتيجية كاملة", "تقرير أداء"] },
    ],
    duration: "3-14 يوم عمل",
    suitableFor: ["الشركات", "متاجر إلكترونية", "وكالات تسويق", "علامات تجارية"],
    faqs: [
      { question: "هل تدعم كل منصات التواصل؟", answer: "نعم، ننتج بمقاسات Instagram, TikTok, Facebook, LinkedIn, Twitter, وYouTube." },
      { question: "هل تكتبون نصوص الإعلان أيضاً؟", answer: "نعم، الباقات المتوسطة والعليا تشمل كتابة نسخ إعلانية احترافية." },
      { question: "هل يمكن A/B testing؟", answer: "بالتأكيد! ننتج متغيرات متعددة لكل إعلان لاختبار الأداء." },
    ],
  },
  {
    id: "prompt-engineering",
    icon: "ri-magic-line",
    title: "هندسة البرومبتات",
    subtitle: "Prompt Engineering",
    description: "بناء برومبتات مخصصة للمصممين والفرق الإبداعية. برومبتات محسّنة لأفضل النتائج من أدوات AI.",
    problem: "معظم المستخدمين يكتبون برومبتات بسيطة ويحصلون على نتائج عادية. البرومبت الجيد يحتاج فهم عميق للأدوات والتقنيات البصرية.",
    solution: "نبني لك برومبتات احترافية مخصصة لأسلوبك واحتياجاتك. برومبتات tested ومحسّنة للحصول على نتائج متسقة وعالية الجودة.",
    examples: [
      { title: "برومبت بورتريه سينمائي", image: "https://readdy.ai/api/search-image?query=cinematic%20portrait%20prompt%20result%2C%20dramatic%20lighting%20on%20face%2C%20film%20noir%20style%2C%20professional%20photography%20quality%2C%20moody%20atmosphere%2C%20sharp%20details&width=600&height=400&seq=prompt1&orientation=landscape", category: "برومبتات" },
      { title: "برومبت منتج تجاري", image: "https://readdy.ai/api/search-image?query=product%20photography%20prompt%20result%2C%20luxury%20watch%20on%20marble%20surface%2C%20perfect%20lighting%2C%20commercial%20quality%2C%20sharp%20focus%2C%20elegant%20composition&width=600&height=400&seq=prompt2&orientation=landscape", category: "برومبتات" },
      { title: "برومبت معماري", image: "https://readdy.ai/api/search-image?query=architectural%20visualization%20prompt%20result%2C%20modern%20building%20exterior%2C%20golden%20hour%20lighting%2C%20photorealistic%20render%2C%20professional%20architecture%20photography&width=600&height=400&seq=prompt3&orientation=landscape", category: "برومبتات" },
    ],
    workflow: [
      { step: 1, title: "تحليل الاحتياج", description: "نفهم نوع المحتوى، الأسلوب، والأداة المستهدفة" },
      { step: 2, title: "بناء البرومبت", description: "نصمم برومبت مفصل مع negative prompt وإعدادات" },
      { step: 3, title: "الاختبار والتحسين", description: "نختبر البرومبت ونحسنه حتى الوصول للنتيجة المثالية" },
      { step: 4, title: "التسليم والتوثيق", description: "برومبت نهائي + شرح + أمثلة + variations" },
    ],
    deliverables: ["برومبت رئيسي محسّن", "Negative Prompt", "5-10 Variations", "دليل استخدام", "إعدادات مقترحة"],
    packages: [
      { name: "برومبت واحد", price: "150$", features: ["برومبت مخصص واحد", "Negative prompt", "3 variations", "دليل استخدام"] },
      { name: "باقة المصمم", price: "500$", features: ["5 برومبتات مخصصة", "Negative prompts", "10 variations لكل", "دليل استخدام", "جلسة تدريب 30 دقيقة"], popular: true },
      { name: "باقة الفريق", price: "1200$", features: ["15 برومبتات مخصصة", "مكتبة كاملة", "20 variations", "دليل شامل", "جلسة تدريب ساعة", "دعم لمدة شهر"] },
    ],
    duration: "2-7 أيام عمل",
    suitableFor: ["المصممين", "فرق التسويق", "مصوري AI", "وكالات إبداعية"],
    faqs: [
      { question: "لأي أدوات تكتبون البرومبتات؟", answer: "Midjourney, DALL·E, Stable Diffusion, Runway, Kling, Pika, وأي أداة جديدة." },
      { question: "هل البرومبتات سرية؟", answer: "نعم 100%. البرومبتات مخصصة لك ولا نشاركها مع أي عميل آخر." },
      { question: "هل تعلمون كيف نستخدمها؟", answer: "الباقات المتوسطة والعليا تشمل جلسة تدريب لتعليم فريقك استخدام البرومبتات." },
    ],
  },
  {
    id: "video-editing",
    icon: "ri-movie-2-line",
    title: "مونتاج الفيديو",
    subtitle: "Video Editing",
    description: "مونتاج أفلام وإعلانات احترافي لصناع المحتوى. من الخام إلى المنتج النهائي بجودة سينمائية.",
    problem: "المونتاج الجيد يحتاج وقت وخبرة. صناع المحتوى يقضون ساعات في المونتاج بدلاً من الإبداع. والنتيجة غالباً ما تكون أقل من المستوى المطلوب.",
    solution: "نقدم مونتاج احترافي باستخدام Premiere Pro وDaVinci Resolve. مونتاج سريع، تصحيح ألوان سينمائي، صوت محسّن، وإخراج بجودة 4K.",
    examples: [
      { title: "مونتاج يوتيوب - فيديو تعليمي", image: "https://readdy.ai/api/search-image?query=video%20editing%20timeline%20screenshot%2C%20professional%20editing%20software%20interface%2C%20multiple%20video%20tracks%2C%20color%20grading%20panel%2C%20professional%20post%20production%20workspace&width=600&height=400&seq=edit1&orientation=landscape", category: "مونتاج" },
      { title: "إعلان منتج - 30 ثانية", image: "https://readdy.ai/api/search-image?query=product%20video%20advertisement%20frame%2C%20dynamic%20editing%20style%2C%20fast%20cuts%2C%20professional%20color%20grading%2C%20commercial%20video%20production%20quality&width=600&height=400&seq=edit2&orientation=landscape", category: "إعلانات" },
      { title: "فيلم قصير - مونتاج درامي", image: "https://readdy.ai/api/search-image?query=dramatic%20film%20editing%20scene%2C%20cinematic%20color%20grading%2C%20emotional%20moment%2C%20professional%20film%20post%20production%2C%20moody%20atmosphere&width=600&height=400&seq=edit3&orientation=landscape", category: "أفلام" },
    ],
    workflow: [
      { step: 1, title: "استلام الخام", description: "نستلم لقطاتك وننظمها ونحدد أفضل اللقطات" },
      { step: 2, title: "المونتاج الأولي", description: "نركب القصة ونحدد الإيقاع والتوقيت" },
      { step: 3, title: "التصحيح اللوني", description: "تصحيح ألوان سينمائي لإعطاء الفيديو هوية بصرية" },
      { step: 4, title: "المكساج الصوتي", description: "تنقية الصوت، موسيقى خلفية، ومؤثرات صوتية" },
      { step: 5, title: "التسليم النهائي", description: "فيديو جاهز بجودة 4K مع ملفات المصدر" },
    ],
    deliverables: ["فيديو مونتاج نهائي", "تصحيح ألوان", "مكساج صوتي", "ملفات 4K", "ملفات المصدر"],
    packages: [
      { name: "باقة القصير", price: "250$", features: ["فيديو حتى 5 دقائق", "مونتاج أساسي", "تصحيح ألوان", "تسليم 3 أيام", "تعديلتين"] },
      { name: "باقة المحترف", price: "600$", features: ["فيديو حتى 15 دقيقة", "مونتاج متقدم", "تصحيح ألوان سينمائي", "مكساج صوتي", "تسليم 7 أيام", "تعديلات غير محدودة"], popular: true },
      { name: "باقة الإنتاج", price: "1500$", features: ["فيديو حتى 30 دقيقة", "مونتاج سينمائي", "تصحيح ألوان متقدم", "صوت احترافي", "مؤثرات بصرية", "تسليم 14 يوم", "تعديلات غير محدودة"] },
    ],
    duration: "3-14 يوم عمل",
    suitableFor: ["صناع المحتوى", "يوتيوبرز", "شركات", "منتجي الأفلام"],
    faqs: [
      { question: "ما صيغة الملفات التي تقبلونها؟", answer: "نقبل كل الصيغ الشائعة: MP4, MOV, ProRes, RAW من أي كاميرا." },
      { question: "هل تضيفون موسيقى ومؤثرات صوتية؟", answer: "نعم، الباقات المتوسطة والعليا تشمل موسيقى خلفية مرخصة ومؤثرات صوتية." },
      { question: "هل يمكنكم العمل مع فيديوهات AI؟", answer: "بالتأكيد! نمتازج فيديوهات AI مع لقطات حقيقية بشكل سلس." },
    ],
  },
  {
    id: "visual-identity-ai",
    icon: "ri-palette-line",
    title: "باقة الهوية البصرية بالذكاء الاصطناعي",
    subtitle: "Visual Identity AI Pack",
    description: "صور موحدة لعلامتك التجارية باستخدام AI. هوية بصرية متكاملة للمشاريع الجديدة والعلامات الناشئة.",
    problem: "بناء هوية بصرية تقليدية يحتاج مصور، مصمم، ووقت طويل. والتكلفة تبدأ من آلاف الدولارات. المشاريع الجديدة تحتاج حل سريع واقتصادي.",
    solution: "نبني لك هوية بصرية كاملة باستخدام AI. صور متسقة، ستايل جايد، وقوالب جاهزة. كل هذا في أيام بدلاً من أسابيع.",
    examples: [
      { title: "هوية علامة قهوة", image: "https://readdy.ai/api/search-image?query=coffee%20brand%20visual%20identity%2C%20consistent%20style%20photos%2C%20warm%20tones%2C%20rustic%20aesthetic%2C%20professional%20brand%20photography%20collection%2C%20cohesive%20look&width=600&height=400&seq=brand1&orientation=landscape", category: "هوية" },
      { title: "هوية علامة أزياء", image: "https://readdy.ai/api/search-image?query=fashion%20brand%20visual%20identity%20pack%2C%20elegant%20consistent%20photography%20style%2C%20luxury%20aesthetic%2C%20professional%20brand%20imagery%2C%20cohesive%20color%20palette&width=600&height=400&seq=brand2&orientation=landscape", category: "هوية" },
      { title: "هوية تطبيق تقني", image: "https://readdy.ai/api/search-image?query=tech%20app%20brand%20visual%20identity%2C%20modern%20clean%20aesthetic%2C%20consistent%20digital%20imagery%2C%20professional%20tech%20brand%20photography%2C%20sleek%20design&width=600&height=400&seq=brand3&orientation=landscape", category: "هوية" },
    ],
    workflow: [
      { step: 1, title: "اكتشاف العلامة", description: "نفهم رؤيتك، قيمك، وجمهورك المستهدف" },
      { step: 2, title: "تصميم الستايل", description: "نحدد الألوان، الإضاءة، المزاج، والأسلوب البصري" },
      { step: 3, title: "إنتاج الصور", description: "نولد مجموعة صور متسقة ومتنوعة" },
      { step: 4, title: "بناء القوالب", description: "قوالب جاهزة للسوشيال ميديا والإعلانات" },
    ],
    deliverables: ["30-50 صورة هوية", "ستايل جايد PDF", "قوالب سوشيال ميديا", "صور بمقاسات متعددة", "حقوق استخدام كاملة"],
    packages: [
      { name: "باقة البداية", price: "800$", features: ["30 صورة هوية", "ستايل جايد", "قوالب 5 منصات", "تسليم 7 أيام", "تعديلتين"] },
      { name: "باقة العلامة", price: "1500$", features: ["50 صورة هوية", "ستايل جايد كامل", "قوالب 8 منصات", "تسليم 10 أيام", "تعديلات غير محدودة", "فيديو هوية 15 ثانية"], popular: true },
      { name: "باقة الشركة", price: "3000$", features: ["100 صورة هوية", "هوية كاملة", "كل المنصات", "تسليم 3 أسابيع", "تعديلات غير محدودة", "فيديو هوية 60 ثانية", "دليل استخدام"] },
    ],
    duration: "7-21 يوم عمل",
    suitableFor: ["المشاريع الجديدة", "العلامات الناشئة", "المتاجر الإلكترونية", "الشركات الناشئة"],
    faqs: [
      { question: "هل الهوية فريدة؟", answer: "نعم، كل هوية مبنية خصيصاً لعلامتك. لا نستخدم قوالب جاهزة." },
      { question: "هل يمكن التعديل لاحقاً؟", answer: "بالتأكيد. نحتفظ ببرومبتاتك للتوليد المستقبلي بنفس الأسلوب." },
      { question: "هل تشمل الشعار؟", answer: "الهوية البصرية تركز على الصور. الشعار يحتاج مصمم جرافيكي منفصل." },
    ],
  },
  {
    id: "consultation",
    icon: "ri-customer-service-2-line",
    title: "الاستشارات والتدريب",
    subtitle: "Consultation",
    description: "جلسة استشارية للذين يريدون التعلم أو التنفيذ. تعلم كيف تستخدم AI في عملك من خبير متمرس.",
    problem: "أدوات AI تتطور بسرعة. من الصعب متابعة كل التحديثات ومعرفة أي الأدوات تناسب عملك. الوقت المهدور في التجربة والخطأ مكلف.",
    solution: "جلسات استشارية مباشرة مع خبير. نرشدك لأفضل الأدوات، نعلمك التقنيات، ونبني معك خطة عمل عملية.",
    examples: [
      { title: "جلسة تدريب فريق", image: "https://readdy.ai/api/search-image?query=professional%20training%20session%2C%20team%20learning%20AI%20tools%2C%20modern%20office%20setting%2C%20presentation%20screen%2C%20collaborative%20workshop%20atmosphere&width=600&height=400&seq=consult1&orientation=landscape", category: "تدريب" },
      { title: "استشارة فردية", image: "https://readdy.ai/api/search-image?query=one-on-one%20consultation%20meeting%2C%20professional%20advisor%20and%20client%2C%20laptop%20with%20AI%20tools%2C%20modern%20workspace%2C%20focused%20discussion&width=600&height=400&seq=consult2&orientation=landscape", category: "استشارة" },
      { title: "ورشة عمل جماعية", image: "https://readdy.ai/api/search-image?query=group%20workshop%20session%2C%20multiple%20people%20around%20table%2C%20creative%20brainstorming%2C%20sticky%20notes%20and%20laptops%2C%20collaborative%20learning%20environment&width=600&height=400&seq=consult3&orientation=landscape", category: "ورشة" },
    ],
    workflow: [
      { step: 1, title: "تحديد الهدف", description: "نفهم ما تريد تعلمه أو تحقيقه" },
      { step: 2, title: "تقييم المستوى", description: "نحدد نقطة البداية والأدوات المناسبة لك" },
      { step: 3, title: "الجلسة", description: "تدريب عملي مباشر مع أمثلة وتطبيق" },
      { step: 4, title: "خطة العمل", description: "خطة عملية للتطبيق بعد الجلسة" },
    ],
    deliverables: ["جلسة تدريب مباشرة", "تسجيل الجلسة", "ملفات تدريبية", "خطة عمل مخصصة", "دعم لمدة أسبوع"],
    packages: [
      { name: "جلسة واحدة", price: "200$", features: ["جلسة 60 دقيقة", "تسجيل الجلسة", "ملخص مكتوب", "دعم 3 أيام"] },
      { name: "باقة التعلم", price: "500$", features: ["3 جلسات × 60 دقيقة", "تسجيلات", "ملفات تدريبية", "خطة عمل", "دعم أسبوعين"], popular: true },
      { name: "باقة الفريق", price: "1200$", features: ["5 جلسات × 90 دقيقة", "تسجيلات", "ملفات تدريبية", "خطة عمل شاملة", "دعم شهر", "ورشة عمل للفريق"] },
    ],
    duration: "حسب الباقة",
    suitableFor: ["من يريد التعلم", "فرق التسويق", "المصورين", "صناع المحتوى"],
    faqs: [
      { question: "هل الجلسات عبر الإنترنت؟", answer: "نعم، جميع الجلسات عبر Zoom أو Google Meet. يمكن ترتيب جلسات حضورية في دبي." },
      { question: "هل أحتاج خبرة سابقة؟", answer: "لا! نبدأ من أي مستوى. حتى لو لم تستخدم AI من قبل." },
      { question: "هل تدعمون الشركات؟", answer: "نعم، لدينا باقات خاصة للفرق والشركات مع تدريب جماعي." },
    ],
  },
];