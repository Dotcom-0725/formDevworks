export interface FormData {
  // Step 1: Contact
  fullName: string;
  phone: string;
  email: string;
  city: string;
  cityOther?: string;
  companyName?: string;
  whatsapp?: string;

  // Step 2: Business info
  industry: string;
  industryOther?: string;
  businessDescription: string;

  // Step 3: Goals
  goals: string[];

  // Step 4: Content
  contentStatus: string;

  // Step 5: Visual identity
  hasLogo: string;
  preferredColors?: string;
  inspirationLinks?: string;

  // Step 6: Additional details
  specialFeatures: string;
  budget?: string;
  timeline?: string;

  // Step 7: Review
  agreeTerms: boolean;
}

export const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  cityOther: "",
  companyName: "",
  whatsapp: "",
  industry: "",
  industryOther: "",
  businessDescription: "",
  goals: [],
  contentStatus: "",
  hasLogo: "",
  preferredColors: "",
  inspirationLinks: "",
  specialFeatures: "",
  budget: "",
  timeline: "",
  agreeTerms: false,
};

export const steps = [
  { id: 1, title: "معلومات التواصل", icon: "👤", short: "التواصل" },
  { id: 2, title: "معلومات النشاط", icon: "🏢", short: "النشاط" },
  { id: 3, title: "أهداف الموقع", icon: "🎯", short: "الأهداف" },
  { id: 4, title: "محتوى الموقع", icon: "📝", short: "المحتوى" },
  { id: 5, title: "الهوية البصرية", icon: "🎨", short: "الهوية" },
  { id: 6, title: "تفاصيل إضافية", icon: "⚙️", short: "تفاصيل" },
  { id: 7, title: "إرسال الاستمارة", icon: "🚀", short: "إرسال" },
];

export const cities = [
  "الدار البيضاء",
  "الرباط",
  "فاس",
  "مراكش",
  "طنجة",
  "أكادير",
  "مكناس",
  "وجدة",
  "تطوان",
  "آسفي",
  "الناظور",
  "العيون",
  "الداخلة",
  "ورزازات",
  "تازة",
  "الخريبكة",
  "بني ملال",
  "سلا",
  "القنيطرة",
  "الصويرة",
  "الحسيمة",
  "أخرى",
];

export const industries = [
  "تجارة إلكترونية",
  "مطعم / مقهى",
  "عيادة / طبيب",
  "محامي / استشارات",
  "تعليم / دورات",
  "عقارات",
  "خدمات تقنية",
  "صناعة / مصنع",
  "سياحة / فنادق",
  "إعلام / محتوى",
  "رياضة / نادي",
  "تجميل / صالون",
  "أخرى",
];

export const goalsOptions = [
  { id: "sales", label: "زيادة المبيعات", icon: "💰" },
  { id: "services", label: "عرض الخدمات والمنتجات", icon: "🛍️" },
  { id: "booking", label: "حجز مواعيد", icon: "📅" },
  { id: "blog", label: "مدونة / نشر مقالات", icon: "📰" },
  { id: "portfolio", label: "عرض الأعمال السابقة", icon: "🖼️" },
  { id: "contact", label: "تسهيل التواصل مع العملاء", icon: "📞" },
];

export const contentOptions = [
  { value: "yes", label: "نعم، أجهز كل شيء", desc: "لديّ النصوص والصور جاهزة" },
  { value: "no", label: "لا، أحتاج مساعدة كاملة", desc: "أحتاج فريقاً لكتابة المحتوى" },
  { value: "partial", label: "جزء فقط", desc: "لدي بعض المحتوى وأحتاج إكمال الباقي" },
];

export const logoOptions = [
  { value: "yes", label: "نعم، لدي شعار وألوان جاهزة", desc: "سأرسلها لك" },
  { value: "no", label: "لا، أحتاج تصميم هوية بصرية", desc: "تصميم شعار + ألوان + خطوط" },
  { value: "partial", label: "لدي شعار فقط", desc: "أحتاج اختيار ألوان وتنسيق" },
];

export const budgetOptions = [
  "أقل من 2,000 درهم",
  "2,000 - 5,000 درهم",
  "5,000 - 10,000 درهم",
  "10,000 - 20,000 درهم",
  "أكثر من 20,000 درهم",
  "غير محدد حالياً",
];

export const timelineOptions = [
  "عاجل (أقل من أسبوعين)",
  "خلال شهر",
  "خلال 1-3 أشهر",
  "غير مستعجل",
];
