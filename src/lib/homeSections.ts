export interface PortfolioTexts {
  title: string;
  subtitle: string;
  button: string;
}

export interface ServicesTexts {
  badge: string;
  title: string;
  subtitle: string;
  testimonials_title: string;
  testimonials_subtitle: string;
}

export interface PromptsTexts {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
}

export interface BooksTexts {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta_title: string;
  cta_subtitle: string;
}

export interface BlogTexts {
  badge: string;
  title: string;
  subtitle: string;
}

export interface HomeSections {
  portfolio: PortfolioTexts;
  services: ServicesTexts;
  prompts: PromptsTexts;
  books: BooksTexts;
  blog: BlogTexts;
}

export const defaultHomeSections: HomeSections = {
  portfolio: {
    title: "مشاريع مختارة",
    subtitle: "نماذج من أعمالي في الإنتاج البصري بالذكاء الاصطناعي",
    button: "عرض جميع الأعمال",
  },
  services: {
    badge: "الخدمات",
    title: "ما أقدمه لك",
    subtitle: "خدمات متكاملة في الإنتاج البصري بالذكاء الاصطناعي",
    testimonials_title: "ماذا يقول العملاء",
    testimonials_subtitle: "آراء حقيقية من عملاء حقيقيين",
  },
  prompts: {
    badge: "أداة مجانية",
    title: "مولد البرومبت",
    highlight: "الاحترافي",
    subtitle: "حوّل فكرتك إلى برومبت احترافي جاهز للاستخدام في أدوات AI المختلفة",
  },
  books: {
    badge: "المنتجات الرقمية",
    title: "حوّل خبرتي إلى",
    highlight: "أدوات تساعدك",
    subtitle: "كتب ومكتبات برومبتات مصممة لتوفير وقتك وتحسين نتائجك",
    cta_title: "هل تريد مشروعًا مخصصًا؟",
    cta_subtitle: "احجز جلسة استشارية مجانية لمدة 30 دقيقة ونناقش مشروعك",
  },
  blog: {
    badge: "المدونة",
    title: "آخر المقالات",
    subtitle: "تعلم AI Photography وهندسة البرومبتات من خبير المجال",
  },
};

export function mergeHomeSections(data: Partial<HomeSections> | null | undefined): HomeSections {
  return {
    portfolio: { ...defaultHomeSections.portfolio, ...(data?.portfolio || {}) },
    services: { ...defaultHomeSections.services, ...(data?.services || {}) },
    prompts: { ...defaultHomeSections.prompts, ...(data?.prompts || {}) },
    books: { ...defaultHomeSections.books, ...(data?.books || {}) },
    blog: { ...defaultHomeSections.blog, ...(data?.blog || {}) },
  };
}