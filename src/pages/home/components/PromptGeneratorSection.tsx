import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PromptForm {
  contentType: string;
  domain: string;
  style: string;
  lighting: string;
  camera: string;
  lens: string;
  mood: string;
  platform: string;
  language: string;
  aspectRatio: string;
  idea: string;
}

interface GeneratedPrompt {
  main: string;
  negative: string;
  settings: string;
  short: string;
  suggestions: string[];
}

const defaultForm: PromptForm = {
  contentType: "",
  domain: "",
  style: "",
  lighting: "",
  camera: "",
  lens: "",
  mood: "",
  platform: "Midjourney",
  language: "إنجليزي",
  aspectRatio: "16:9",
  idea: "",
};

const PromptGeneratorSection = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<PromptForm>(defaultForm);
  const [generated, setGenerated] = useState<GeneratedPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const options = {
    contentType: ["صورة", "فيديو", "بوستر", "إعلان", "غلاف كتاب", "ستوري بورد"],
    domain: ["أزياء", "طعام", "عقار", "منتج", "أفلام", "شخصية", "طبيعة"],
    style: ["سينمائي", "فاخر", "واقعي", "خيالي", "Editorial", "تجريدي"],
    lighting: ["ناعمة", "درامية", "نيون", "ضوء طبيعي", "Golden Hour", "Studio"],
    camera: ["Close-up", "Wide Shot", "Drone", "Macro", "Medium Shot", "POV"],
    lens: ["35mm", "50mm", "85mm", "24mm", "135mm"],
    mood: ["غامض", "فاخر", "حماسي", "هادئ", "رومانسي", "مستقبلي"],
    platform: ["Midjourney", "DALL·E", "Stable Diffusion", "Runway", "Kling"],
    language: ["إنجليزي", "عربي"],
    aspectRatio: ["1:1", "16:9", "9:16", "4:5", "3:2", "2:3"],
  };

  const buildPrompt = (): GeneratedPrompt => {
    const { contentType, domain, style, lighting, camera, lens, mood, platform, aspectRatio, idea } = form;

    const mainParts = [
      idea || "a stunning visual scene",
      domain && `${domain} themed`,
      style && `${style} style`,
      lighting && `${lighting} lighting`,
      camera && `${camera} shot`,
      lens && `${lens} lens`,
      mood && `${mood} mood`,
      "ultra realistic, 8k quality, professional photography",
      "cinematic composition, award winning",
    ].filter(Boolean);

    const main = mainParts.join(", ");

    const negative = "blurry, low quality, distorted, watermark, text overlay, oversaturated, amateur, noise, grain, bad composition";

    const settings = `Platform: ${platform} | Aspect Ratio: ${aspectRatio} | Quality: --q 2 | Style: --style raw`;

    const short = `${idea || "stunning scene"}, ${style || "cinematic"}, ${lighting || "dramatic"} lighting, ${platform}`;

    const suggestions = [
      `أضف "golden ratio composition" لتحسين التكوين البصري`,
      `جرب تغيير الإضاءة إلى "Rembrandt lighting" لمزيد من الدراما`,
      `أضف "depth of field, bokeh background" لتأثير احترافي أكثر`,
    ];

    return { main, negative, settings, short, suggestions };
  };

  const handleGenerate = () => {
    if (!form.idea && !form.contentType) return;
    setLoading(true);
    setTimeout(() => {
      setGenerated(buildPrompt());
      setLoading(false);
    }, 1200);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (field: keyof PromptForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="prompt-generator" className="py-20 md:py-28 bg-[#f0f4ff]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-blue-500"></div>
            <span className="text-blue-600 text-sm font-semibold tracking-wider uppercase">أداة مجانية</span>
            <div className="w-8 h-0.5 bg-blue-500"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0d1b2e] leading-tight mb-4">
            مولد البرومبت{" "}
            <span className="text-blue-600">الاحترافي</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            حوّل فكرتك إلى برومبت احترافي جاهز للاستخدام في أدوات AI المختلفة
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/prompt")}
            className="text-blue-600 hover:text-blue-500 text-sm font-semibold flex items-center gap-1 mx-auto cursor-pointer transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-external-link-line"></i>
            </div>
            فتح المولد في صفحة كاملة
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 border border-gray-100">
            <h3 className="text-[#0d1b2e] font-bold text-xl mb-6 flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-settings-3-line text-blue-600"></i>
              </div>
              إعدادات البرومبت
            </h3>

            {/* Idea input */}
            <div className="mb-5">
              <label className="block text-gray-600 text-sm font-medium mb-2">فكرتك الرئيسية *</label>
              <textarea
                value={form.idea}
                onChange={(e) => handleChange("idea", e.target.value)}
                placeholder="مثال: ساعة فاخرة على خلفية داكنة مع إضاءة درامية..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm resize-none focus:outline-none focus:border-blue-400 transition-colors"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {(["contentType", "domain", "style", "lighting", "camera", "lens", "mood", "platform", "language", "aspectRatio"] as (keyof PromptForm)[]).map((field) => {
                const labels: Record<string, string> = {
                  contentType: "نوع المحتوى",
                  domain: "المجال",
                  style: "الأسلوب",
                  lighting: "الإضاءة",
                  camera: "الكاميرا",
                  lens: "العدسة",
                  mood: "المزاج",
                  platform: "المنصة",
                  language: "اللغة",
                  aspectRatio: "نسبة الأبعاد",
                };
                const fieldOptions = options[field as keyof typeof options] || [];
                return (
                  <div key={field}>
                    <label className="block text-gray-600 text-sm font-medium mb-2">{labels[field]}</label>
                    <select
                      value={form[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-blue-400 transition-colors cursor-pointer"
                    >
                      <option value="">اختر...</option>
                      {fieldOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || (!form.idea && !form.contentType)}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري التوليد...
                </>
              ) : (
                <>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-magic-line"></i>
                  </div>
                  توليد البرومبت
                </>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="flex-1 flex flex-col gap-5">
            {!generated ? (
              <div className="flex-1 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <i className="ri-ai-generate text-blue-400 text-3xl"></i>
                </div>
                <h4 className="text-gray-600 font-semibold mb-2">جاهز لتوليد برومبتك</h4>
                <p className="text-gray-400 text-sm">أدخل فكرتك واضغط على "توليد البرومبت"</p>
              </div>
            ) : (
              <>
                {/* Main Prompt */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[#0d1b2e] font-bold text-sm flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-star-line text-blue-600 text-xs"></i>
                      </div>
                      البرومبت الرئيسي
                    </h4>
                    <button
                      onClick={() => handleCopy(generated.main)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-500 text-xs font-medium cursor-pointer whitespace-nowrap transition-colors"
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className={copied ? "ri-check-line" : "ri-file-copy-line"}></i>
                      </div>
                      {copied ? "تم النسخ!" : "نسخ"}
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm font-mono leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                    {generated.main}
                  </p>
                </div>

                {/* Negative Prompt */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h4 className="text-[#0d1b2e] font-bold text-sm mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-forbid-line text-rose-500 text-xs"></i>
                    </div>
                    Negative Prompt
                  </h4>
                  <p className="text-gray-500 text-xs font-mono leading-relaxed bg-rose-50 rounded-xl p-3 border border-rose-100">
                    {generated.negative}
                  </p>
                </div>

                {/* Settings */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h4 className="text-[#0d1b2e] font-bold text-sm mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-settings-line text-gray-500 text-xs"></i>
                    </div>
                    الإعدادات المقترحة
                  </h4>
                  <p className="text-gray-500 text-xs font-mono bg-gray-50 rounded-xl p-3 border border-gray-100">
                    {generated.settings}
                  </p>
                </div>

                {/* Suggestions */}
                <div className="bg-blue-600 rounded-2xl p-5">
                  <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-lightbulb-line text-xs"></i>
                    </div>
                    اقتراحات تحسين
                  </h4>
                  <ul className="space-y-2">
                    {generated.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/80 text-xs">
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="ri-arrow-left-line text-xs"></i>
                        </div>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromptGeneratorSection;
