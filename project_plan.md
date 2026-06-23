# حسن جمال الليل - موقع مصور ومونتير AI

## 1. وصف المشروع
موقع احترافي لـ حسن جمال الليل، خبير في تصوير وإنتاج الفيديو بالذكاء الاصطناعي. يقدم خدماته وأعماله ومنتجاته الرقمية (كتب، برومبتات، دورات). الموقع يستهدف العلامات التجارية وصناع المحتوى الراغبين في الاستفادة من تقنيات AI في الإنتاج البصري.

## 2. هيكل الصفحات
- `/` - الصفحة الرئيسية (صفحة واحدة بأقسام متعددة)
- `/about` - عن حسن
- `/portfolio` - معرض الأعمال
- `/services` - الخدمات
- `/services/:id` - تفاصيل الخدمة
- `/prompt` - مولد البرومبت
- `/books` - الكتب والمنتجات
- `/books/:id` - تفاصيل الكتاب
- `/blog` - المدونة
- `/blog/:slug` - تفاصيل المقال
- `/memberships` - العضويات
- `/contact` - اتصل بنا
- `/dashboard` - لوحة التحكم
- `/dashboard/*` - صفحات إدارة المحتوى
- `*` - 404

## 3. الميزات الأساسية
- [x] Hero Section
- [x] About Section
- [x] Portfolio مع فلاتر
- [x] Services
- [x] Prompt Generator
- [x] Books & Digital Products
- [x] Blog
- [x] Footer + Newsletter
- [x] صفحات فرعية لكل قسم
- [x] لوحة تحكم شاملة

## 4. نموذج البيانات (Supabase)

### Table: profiles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | مفتاح رئيسي، مرتبط بـ auth.users |
| full_name | text | الاسم الكامل |
| avatar_url | text | رابط الصورة الشخصية |
| bio | text | نبذة عن المستخدم |
| updated_at | timestamptz | تاريخ آخر تحديث |

### Table: portfolio_items
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | مفتاح رئيسي |
| title | text | عنوان العمل |
| description | text | وصف العمل |
| category | text | التصنيف (تصوير، مونتاج، AI...) |
| image_url | text | رابط الصورة |
| video_url | text | رابط الفيديو (اختياري) |
| tags | text[] | وسوم |
| featured | boolean | عمل مميز |
| created_at | timestamptz | تاريخ الإضافة |

### Table: services
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | مفتاح رئيسي |
| title | text | اسم الخدمة |
| description | text | وصف الخدمة |
| icon | text | اسم الأيقونة |
| price | text | السعر |
| features | text[] | مميزات الخدمة |
| order_index | int | ترتيب العرض |
| created_at | timestamptz | تاريخ الإضافة |

### Table: books
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | مفتاح رئيسي |
| title | text | عنوان الكتاب |
| description | text | وصف الكتاب |
| cover_url | text | رابط الغلاف |
| price | text | السعر |
| category | text | التصنيف |
| featured | boolean | منتج مميز |
| buy_url | text | رابط الشراء |
| created_at | timestamptz | تاريخ الإضافة |

### Table: blog_posts
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | مفتاح رئيسي |
| title | text | عنوان المقال |
| slug | text | الرابط المختصر (فريد) |
| excerpt | text | ملخص المقال |
| content | text | محتوى المقال |
| cover_url | text | رابط الصورة |
| tags | text[] | وسوم |
| published | boolean | منشور |
| created_at | timestamptz | تاريخ النشر |

### Table: prompts
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | مفتاح رئيسي |
| title | text | اسم البرومبت |
| prompt_text | text | نص البرومبت |
| category | text | التصنيف |
| example_url | text | رابط مثال |
| created_at | timestamptz | تاريخ الإضافة |

### Table: contact_messages
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | مفتاح رئيسي |
| name | text | اسم المرسل |
| email | text | البريد الإلكتروني |
| subject | text | الموضوع |
| message | text | الرسالة |
| read | boolean | مقروءة |
| created_at | timestamptz | تاريخ الإرسال |

### Table: testimonials
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | مفتاح رئيسي |
| client_name | text | اسم العميل |
| client_role | text | منصب العميل |
| client_avatar | text | رابط الصورة |
| content | text | نص الشهادة |
| rating | int | التقييم (1-5) |
| featured | boolean | شهادة مميزة |
| created_at | timestamptz | تاريخ الإضافة |

## 5. التكاملات الخارجية
- Supabase: ✅ متصل - للتخزين والمصادقة وإدارة المحتوى
- Shopify: ⏳ غير مطلوب حالياً
- Stripe: ⏳ غير مطلوب حالياً

### 📊 إحصائيات قاعدة البيانات (المرحلة 5)
| الجدول | عدد السجلات |
|---|---|
| profiles | 1 |
| testimonials | 10 |
| contact_messages | 14 |
| books | 7 |
| blog_posts | 10 |
| portfolio_items | 12 |
| services | 12 |
| prompts | 20 |
| product_categories | 5 |
| product_items | 16 |
| product_variants | 8 |
| product_skus | 24 |
| product_custom_fields | 7 |
| product_custom_values | 25 |
| order_headers | 18 |
| order_items | 21 |
| **المجموع** | **~210 سجل** |

## 6. خطة التطوير

### المرحلة 1: الصفحة الرئيسية الكاملة ✅
- الهدف: بناء جميع أقسام الصفحة الرئيسية
- المخرجات: صفحة كاملة جاهزة للعرض

### المرحلة 2: الصفحات الفرعية ولوحة التحكم ✅
- الهدف: إضافة صفحات فرعية ولوحة تحكم
- المخرجات: موقع كامل بجميع الصفحات

### المرحلة 3: ربط Supabase وقاعدة البيانات ✅
- الهدف: ربط Supabase وإنشاء جداول قاعدة البيانات ونظام المصادقة
- المخرجات: قاعدة بيانات جاهزة، نظام تسجيل دخول، استبدال البيانات الوهمية بالحقيقية
- ✅ 16 جدول منشأة مع RLS
- ✅ ~210 سجل بيانات تجريبية مدخلة
- ✅ Supabase client مهيأ
- ✅ الصفحة الرئيسية بكل أقسامها تسحب من Supabase
- ✅ صفحات Portfolio وBlog وBooks وPrompt تسحب من Supabase
- ✅ صفحة تفاصيل المدونة والكتاب تسحبان من Supabase

### المرحلة 4: لوحة تحكم ديناميكية ✅
- الهدف: ربط لوحة التحكم بقاعدة البيانات للإدارة المباشرة
- المخرجات: إدارة كاملة للمحتوى من المتصفح
- ✅ نظام تسجيل دخول كامل (صفحة + AuthContext + AuthGuard)
- ✅ صفحات CRUD كاملة: الأعمال، المدونة، الكتب، البرومبتات، الخدمات
- ✅ صفحات عرض: الرسائل، آراء العملاء
- ✅ لوحة تحكم رئيسية بإحصائيات حية من Supabase
- ✅ إجراءات سريعة للتنقل بين الأقسام
- ✅ زر تسجيل الخروج
- ✅ حماية جميع مسارات /dashboard/* بنظام المصادقة

### المرحلة 5: إثراء البيانات التجريبية ✅
- الهدف: تعبئة جميع الجداول ببيانات تجريبية غنية وواقعية
- المخرجات: قاعدة بيانات متكاملة جاهزة للاختبار والعرض
- ✅ إنشاء ملف تعريفي للمسؤول (حسن جمال الليل)
- ✅ 10 توصيات عملاء من قطاعات متنوعة (عقار، تجميل، مطاعم، الخ)
- ✅ 14 رسالة اتصال بحالات مختلفة (مقروءة/غير مقروءة)
- ✅ 7 كتب رقمية (تصوير، مونتاج، إخراج سينمائي)
- ✅ 10 مقالات مدونة متنوعة المواضيع
- ✅ 12 عمل في معرض الأعمال
- ✅ 12 خدمة احترافية مع أسعار ومميزات
- ✅ 20 برومبت جاهز في 4 تصنيفات
- ✅ 16 منتج في 5 تصنيفات مع فاريشنات وSKUs كاملة
- ✅ 18 طلب بمختلف الحالات (مدفوع، قيد المعالجة، ملغي، الخ)
- ✅ جميع الصور بروابط كاملة وصحيحة