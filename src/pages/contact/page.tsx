import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/pages/home/components/Navbar";
import FooterSection from "@/pages/home/components/FooterSection";

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const services = [
    "تصوير المنتجات بالـ AI",
    "مونتاج فيديو احترافي",
    "هندسة البرومبتات",
    "استشارة AI",
    "Bundle الكامل",
    "أخرى",
  ];

  const contactInfo = [
    {
      icon: "ri-mail-line",
      label: "البريد الإلكتروني",
      value: "hassan@aiartist.com",
      sub: "رد خلال 24 ساعة",
    },
    {
      icon: "ri-whatsapp-line",
      label: "واتساب",
      value: "+966 5X XXX XXXX",
      sub: "متاح 9 ص – 10 م",
    },
    {
      icon: "ri-instagram-line",
      label: "إنستغرام",
      value: "@hassan.ai",
      sub: "تابعني للمحتوى اليومي",
    },
    {
      icon: "ri-map-pin-line",
      label: "الموقع",
      value: "الرياض، المملكة العربية السعودية",
      sub: "متاح للعمل عن بُعد عالمياً",
    },
  ];

  const faqs = [
    { q: "كم يستغرق تنفيذ المشروع؟", a: "يعتمد على حجم المشروع. التصوير الفردي 1-2 يوم، المشاريع الكبيرة 3-7 أيام." },
    { q: "هل تعمل مع عملاء خارج السعودية؟", a: "نعم! أعمل مع عملاء من جميع أنحاء العالم عن بُعد بدون أي قيود." },
    { q: "ما طرق الدفع المتاحة؟", a: "بطاقة بنكية، PayPal، تحويل بنكي، أو كريبتو. الدفع 50% مقدماً والباقي عند التسليم." },
    { q: "هل يمكنني طلب تعديلات؟", a: "بالتأكيد! كل مشروع يشمل جولتين من التعديلات المجانية." },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "message") {
      if (value.length > 500) return;
      setCharCount(value.length);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.message.length > 500) return;
    setSubmitting(true);
    try {
      const body = new URLSearchParams();
      body.append("name", formData.name);
      body.append("email", formData.email);
      body.append("subject", formData.subject);
      body.append("service", formData.service);
      body.append("message", formData.message);
      await fetch("https://readdy.ai/api/form/d7oi0m1us6nbnotnosb0", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faff]" dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-8 bg-[#0d1b2e] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("https://readdy.ai/api/search-image?query=abstract%20dark%20blue%20geometric%20pattern%2C%20minimal%20lines%20and%20dots%2C%20technology%20background%2C%20dark%20navy%20blue%2C%20subtle%20grid%20pattern%2C%20professional%20studio%20background&width=1440&height=500&seq=contact-hero&orientation=landscape")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2e]/60 to-[#0d1b2e]"></div>
        <div className="max-w-4xl mx-auto relative text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-white/30"></div>
            <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">تواصل معي</span>
            <div className="w-8 h-0.5 bg-white/30"></div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            لنبني شيئاً <span className="text-white/60">رائعاً</span> معاً
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            سواء كان لديك مشروع، سؤال، أو مجرد فكرة — أنا هنا للاستماع والمساعدة
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-8">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:border-[#0d1b2e]/20 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-[#0d1b2e] rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className={`${item.icon} text-white text-base`}></i>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">{item.label}</p>
                  <p className="text-[#0d1b2e] font-bold text-sm leading-snug">{item.value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main: Form + Sidebar */}
      <section className="pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="bg-[#0d1b2e] px-6 py-5">
                <h2 className="text-white font-black text-xl">أرسل رسالتك</h2>
                <p className="text-white/50 text-sm mt-1">سأرد عليك خلال 24 ساعة كحد أقصى</p>
              </div>

              {submitted ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <i className="ri-check-double-line text-green-600 text-3xl"></i>
                  </div>
                  <h3 className="text-[#0d1b2e] font-black text-2xl mb-3">وصلت رسالتك!</h3>
                  <p className="text-gray-500 text-sm mb-2">شكراً لتواصلك معي. سأراجع رسالتك وأرد عليك في أقرب وقت.</p>
                  <p className="text-gray-400 text-xs mb-8">عادةً ما أرد خلال 12-24 ساعة</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", service: "", message: "" }); setCharCount(0); }}
                      className="bg-[#0d1b2e] text-white px-6 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-[#1a2f4a] transition-colors whitespace-nowrap"
                    >
                      إرسال رسالة أخرى
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer hover:border-gray-300 transition-colors whitespace-nowrap"
                    >
                      العودة للرئيسية
                    </button>
                  </div>
                </div>
              ) : (
                <form data-readdy-form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-600 text-xs font-semibold block mb-1.5">
                        الاسم الكامل <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="أدخل اسمك"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0d1b2e] placeholder-gray-400 focus:outline-none focus:border-[#0d1b2e] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 text-xs font-semibold block mb-1.5">
                        البريد الإلكتروني <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="example@email.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0d1b2e] placeholder-gray-400 focus:outline-none focus:border-[#0d1b2e] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="text-gray-600 text-xs font-semibold block mb-1.5">الخدمة المطلوبة</label>
                    <div className="relative">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0d1b2e] focus:outline-none focus:border-[#0d1b2e] transition-colors appearance-none bg-white cursor-pointer"
                      >
                        <option value="">اختر الخدمة...</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 flex items-center justify-center">
                        <i className="ri-arrow-down-s-line text-gray-400 text-base"></i>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-gray-600 text-xs font-semibold block mb-1.5">
                      موضوع الرسالة <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="مثال: أريد تصوير منتجاتي بالـ AI"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0d1b2e] placeholder-gray-400 focus:outline-none focus:border-[#0d1b2e] transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-gray-600 text-xs font-semibold block mb-1.5">
                      تفاصيل الرسالة <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="اكتب تفاصيل مشروعك أو سؤالك هنا..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#0d1b2e] placeholder-gray-400 focus:outline-none focus:border-[#0d1b2e] transition-colors resize-none"
                    />
                    <div className={`text-xs mt-1 text-left ${charCount > 450 ? "text-rose-500" : "text-gray-400"}`}>
                      {charCount}/500
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting || charCount > 500}
                    className="w-full bg-[#0d1b2e] hover:bg-[#1a2f4a] text-white font-black text-base py-4 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-send-plane-line text-sm"></i>
                        </div>
                        إرسال الرسالة
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Availability */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[#0d1b2e] font-bold text-sm">متاح للمشاريع الجديدة</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">
                أقبل مشاريع محدودة كل شهر لضمان أعلى جودة. احجز مكانك الآن قبل امتلاء الجدول.
              </p>
              <div className="space-y-2">
                {[
                  { label: "وقت الرد", value: "أقل من 24 ساعة" },
                  { label: "بدء المشروع", value: "خلال 3-5 أيام" },
                  { label: "التوقيت", value: "9 ص – 10 م (GMT+3)" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-400 text-xs">{item.label}</span>
                    <span className="text-[#0d1b2e] font-semibold text-xs">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="text-[#0d1b2e] font-bold text-sm mb-4">تابعني على</h3>
              <div className="space-y-3">
                {[
                  { icon: "ri-instagram-line", label: "Instagram", handle: "@hassan.ai", color: "bg-rose-50 text-rose-600" },
                  { icon: "ri-youtube-line", label: "YouTube", handle: "Hassan AI Studio", color: "bg-red-50 text-red-600" },
                  { icon: "ri-twitter-x-line", label: "Twitter / X", handle: "@hassan_ai", color: "bg-gray-100 text-gray-700" },
                  { icon: "ri-tiktok-line", label: "TikTok", handle: "@hassan.creates", color: "bg-[#0d1b2e]/5 text-[#0d1b2e]" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    rel="nofollow"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className={`w-9 h-9 ${social.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <i className={`${social.icon} text-base`}></i>
                    </div>
                    <div>
                      <p className="text-[#0d1b2e] font-semibold text-xs">{social.label}</p>
                      <p className="text-gray-400 text-xs">{social.handle}</p>
                    </div>
                    <div className="mr-auto w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="ri-arrow-left-line text-gray-400 text-xs"></i>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Book */}
            <div className="bg-[#0d1b2e] rounded-2xl p-5 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <i className="ri-calendar-check-line text-white text-xl"></i>
              </div>
              <h3 className="text-white font-black text-base mb-2">استشارة مجانية</h3>
              <p className="text-white/50 text-xs mb-4 leading-relaxed">
                احجز جلسة 15 دقيقة مجانية لمناقشة مشروعك
              </p>
              <button
                onClick={() => navigate("/services/consultation")}
                className="w-full bg-white text-[#0d1b2e] font-black text-sm py-3 rounded-xl cursor-pointer hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                احجز الآن
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-[#0d1b2e]/30"></div>
              <span className="text-[#0d1b2e]/40 text-xs font-semibold tracking-widest uppercase">الأسئلة الشائعة</span>
              <div className="w-6 h-0.5 bg-[#0d1b2e]/30"></div>
            </div>
            <h2 className="text-3xl font-black text-[#0d1b2e]">أسئلة يسألها الجميع</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-right cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span className="text-[#0d1b2e] font-bold text-sm">{question}</span>
        <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <i className="ri-arrow-down-s-line text-gray-400 text-base"></i>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-gray-500 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
