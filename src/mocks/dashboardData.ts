export const dashboardStats = {
  totalRevenue: "12,450$",
  revenueGrowth: "+18%",
  totalOrders: 87,
  ordersGrowth: "+12%",
  totalClients: 54,
  clientsGrowth: "+8%",
  totalViews: "48,320",
  viewsGrowth: "+24%",
};

export const recentOrders = [
  { id: "ORD-001", client: "أحمد الرشيدي", product: "Bundle الكامل", amount: "149$", status: "مكتمل", date: "2026-04-25" },
  { id: "ORD-002", client: "سارة المنصوري", product: "البرومبت السينمائي", amount: "79$", status: "مكتمل", date: "2026-04-24" },
  { id: "ORD-003", client: "خالد العمري", product: "باقة المخرج", amount: "1000$", status: "قيد التنفيذ", date: "2026-04-23" },
  { id: "ORD-004", client: "نورة الزهراني", product: "أساسيات AI Photography", amount: "49$", status: "مكتمل", date: "2026-04-22" },
  { id: "ORD-005", client: "محمد الغامدي", product: "باقة النمو - تصوير", amount: "600$", status: "معلق", date: "2026-04-21" },
];

export const recentMessages = [
  { id: 1, name: "فيصل الحربي", email: "faisal@example.com", subject: "استفسار عن تصوير منتجات", time: "منذ ساعة", read: false },
  { id: 2, name: "ليلى الأحمدي", email: "layla@example.com", subject: "طلب عرض سعر - هوية بصرية", time: "منذ 3 ساعات", read: false },
  { id: 3, name: "عمر السعيد", email: "omar@example.com", subject: "سؤال عن Bundle الكتب", time: "منذ يوم", read: true },
  { id: 4, name: "هند الشمري", email: "hind@example.com", subject: "حجز جلسة استشارية", time: "منذ يومين", read: true },
];

export const portfolioItems = [
  { id: 1, title: "تصوير ساعة فاخرة", category: "منتجات", type: "صورة", tool: "Midjourney", views: 1240, status: "منشور" },
  { id: 2, title: "إعلان أزياء", category: "أزياء", type: "فيديو", tool: "Runway", views: 890, status: "منشور" },
  { id: 3, title: "مشهد سينمائي", category: "أفلام", type: "فيديو", tool: "Kling", views: 2100, status: "منشور" },
  { id: 4, title: "تصوير قهوة", category: "منتجات", type: "صورة", tool: "Midjourney", views: 670, status: "مسودة" },
  { id: 5, title: "بوستر فيلم", category: "أفلام", type: "بوستر", tool: "Midjourney", views: 1560, status: "منشور" },
];

export const booksData = [
  { id: 1, title: "أساسيات AI Photography", price: "49$", sales: 234, revenue: "11,466$", status: "نشط" },
  { id: 2, title: "البرومبت السينمائي", price: "79$", sales: 189, revenue: "14,931$", status: "نشط" },
  { id: 3, title: "دليل تصوير المنتجات", price: "59$", sales: 156, revenue: "9,204$", status: "نشط" },
  { id: 4, title: "Bundle الكامل", price: "149$", sales: 98, revenue: "14,602$", status: "نشط" },
];

export const clientsData = [
  { id: 1, name: "أحمد الرشيدي", email: "ahmed@example.com", country: "السعودية", orders: 3, totalSpent: "1,450$", membership: "Pro", joinDate: "2025-01-15" },
  { id: 2, name: "سارة المنصوري", email: "sara@example.com", country: "الإمارات", orders: 2, totalSpent: "228$", membership: "Basic", joinDate: "2025-02-20" },
  { id: 3, name: "خالد العمري", email: "khalid@example.com", country: "الكويت", orders: 5, totalSpent: "2,100$", membership: "Studio", joinDate: "2024-11-10" },
  { id: 4, name: "نورة الزهراني", email: "noura@example.com", country: "السعودية", orders: 1, totalSpent: "49$", membership: "مجاني", joinDate: "2026-03-05" },
  { id: 5, name: "محمد الغامدي", email: "mohammed@example.com", country: "البحرين", orders: 4, totalSpent: "1,800$", membership: "Business", joinDate: "2025-06-18" },
];

export const promptsData = [
  { id: 1, title: "بورتريه سينمائي درامي", category: "بورتريه", uses: 1240, rating: 4.9, status: "نشط" },
  { id: 2, title: "منتج فاخر - خلفية داكنة", category: "منتجات", uses: 890, rating: 4.8, status: "نشط" },
  { id: 3, title: "مشهد خيال علمي", category: "أفلام", uses: 670, rating: 4.7, status: "نشط" },
  { id: 4, title: "إعلان أزياء Editorial", category: "أزياء", uses: 540, rating: 4.6, status: "نشط" },
  { id: 5, title: "تصوير معماري Golden Hour", category: "عقار", uses: 320, rating: 4.5, status: "مسودة" },
];

export const blogPosts = [
  { id: 1, title: "كيف تصنع صورة منتج بالذكاء الاصطناعي", category: "AI Photography", views: 4200, status: "منشور", date: "2026-04-20" },
  { id: 2, title: "أفضل تركيب لبرومبت سينمائي", category: "Prompt Engineering", views: 3100, status: "منشور", date: "2026-04-15" },
  { id: 3, title: "مقارنة بين Midjourney وDALL·E", category: "أدوات", views: 5600, status: "منشور", date: "2026-04-10" },
  { id: 4, title: "كيف تحول فكرة إلى مشهد فيديو", category: "AI Film", views: 2800, status: "مسودة", date: "2026-04-05" },
  { id: 5, title: "استخدام صور AI في إعلاناتك", category: "تسويق", views: 1900, status: "منشور", date: "2026-03-28" },
];

export const servicesData = [
  { id: 1, title: "تصوير المنتجات بالـ AI", packages: 3, activeOrders: 5, revenue: "4,200$", status: "نشط" },
  { id: 2, title: "مفاهيم الأفلام بالـ AI", packages: 3, activeOrders: 2, revenue: "3,500$", status: "نشط" },
  { id: 3, title: "الإعلانات الإبداعية", packages: 3, activeOrders: 4, revenue: "5,100$", status: "نشط" },
  { id: 4, title: "هندسة البرومبتات", packages: 3, activeOrders: 3, revenue: "2,800$", status: "نشط" },
  { id: 5, title: "مونتاج الفيديو", packages: 3, activeOrders: 6, revenue: "6,200$", status: "نشط" },
  { id: 6, title: "الهوية البصرية AI", packages: 3, activeOrders: 1, revenue: "1,500$", status: "نشط" },
  { id: 7, title: "الاستشارات والتدريب", packages: 3, activeOrders: 8, revenue: "3,200$", status: "نشط" },
];

export const analyticsData = {
  topPages: [
    { page: "الصفحة الرئيسية", views: 18400, bounce: "42%" },
    { page: "معرض الأعمال", views: 9200, bounce: "35%" },
    { page: "مولد البرومبت", views: 7800, bounce: "28%" },
    { page: "المتجر", views: 5600, bounce: "38%" },
    { page: "الخدمات", views: 4100, bounce: "45%" },
  ],
  trafficSources: [
    { source: "بحث Google", percentage: 45 },
    { source: "Instagram", percentage: 28 },
    { source: "YouTube", percentage: 15 },
    { source: "مباشر", percentage: 8 },
    { source: "أخرى", percentage: 4 },
  ],
};