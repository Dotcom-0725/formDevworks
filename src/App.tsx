import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProgressStepper from "./components/ProgressStepper";
import Step1Contact from "./components/Step1Contact";
import Step2Business from "./components/Step2Business";
import Step3Goals from "./components/Step3Goals";
import Step4Content from "./components/Step4Content";
import Step5Visual from "./components/Step5Visual";
import Step6Additional from "./components/Step6Additional";
import Step7Review from "./components/Step7Review";
import Logo from "./components/Logo";
import { initialFormData, type FormData } from "./types";
import { translations, type Lang } from "./i18n/translations";

const STORAGE_KEY = "rachid-devworks-form-v1";
const LANG_KEY = "rachid-devworks-lang";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+\d\s()-]{8,20}$/;

function phoneToWhatsAppLink(phone: string): string {
  if (!phone) return "";
  let digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }
  if (digits.startsWith("0")) {
    digits = "212" + digits.slice(1);
  } else if (digits.length === 9 && /^[67]/.test(digits)) {
    digits = "212" + digits;
  }
  if (digits.length < 4) return "";
  return `https://wa.me/${digits}`;
}

function validateStep(
  step: number,
  data: FormData,
  lang: Lang
): Record<string, string> {
  const t = translations[lang];
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!data.fullName.trim() || data.fullName.trim().length < 2) {
      errors.fullName = t.errFullName;
    }
    if (!data.phone.trim()) {
      errors.phone = t.errPhoneRequired;
    } else if (!phoneRegex.test(data.phone.trim())) {
      errors.phone = t.errPhoneInvalid;
    }
    // Email now OPTIONAL
    if (data.email.trim() && !emailRegex.test(data.email.trim())) {
      errors.email = t.errEmailInvalid;
    }
    if (!data.city) {
      errors.city = t.errCityRequired;
    }
    const isOtherCity =
      data.city === translations.ar.cities[translations.ar.cities.length - 1] ||
      data.city === translations.fr.cities[translations.fr.cities.length - 1];
    if (isOtherCity && !data.cityOther?.trim()) {
      errors.cityOther = t.errCityOtherRequired;
    }
    if (data.whatsapp && data.whatsapp.trim()) {
      try {
        new URL(data.whatsapp.trim());
      } catch {
        errors.whatsapp = t.errWhatsappInvalid;
      }
    }
  }

  if (step === 2) {
    if (!data.industry) {
      errors.industry = t.errIndustryRequired;
    }
    const isOtherIndustry =
      data.industry ===
        translations.ar.industries[translations.ar.industries.length - 1] ||
      data.industry ===
        translations.fr.industries[translations.fr.industries.length - 1];
    if (isOtherIndustry && !data.industryOther?.trim()) {
      errors.industryOther = t.errIndustryOtherRequired;
    }
    if (
      !data.businessDescription.trim() ||
      data.businessDescription.trim().length < 10
    ) {
      errors.businessDescription = t.errBusinessDescRequired;
    }
  }

  if (step === 3) {
    if (data.goals.length === 0) {
      errors.goals = t.errGoalsRequired;
    }
  }

  if (step === 4) {
    if (!data.contentStatus) {
      errors.contentStatus = t.errContentRequired;
    }
  }

  if (step === 5) {
    if (!data.hasLogo) {
      errors.hasLogo = t.errLogoRequired;
    }
  }

  if (step === 7) {
    if (!data.agreeTerms) {
      errors.agreeTerms = t.errAgreeRequired;
    }
  }

  return errors;
}

export default function App() {
  const [lang, setLang] = useState<Lang>("ar");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showSavedHint, setShowSavedHint] = useState(false);

  const t = translations[lang];
  const isRTL = lang === "ar";

  const stepsData = useMemo(() => {
    return t.stepTitlesPlain.map((title, idx) => ({
      id: idx + 1,
      title: t.stepTitles[idx],
      plain: title,
      short: t.stepShort[idx],
      icon: t.icons[idx],
    }));
  }, [t]);

  // Load lang & form from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_KEY) as Lang | null;
      if (savedLang === "ar" || savedLang === "fr") {
        setLang(savedLang);
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      }
    } catch {
      // ignore
    }
  }, []);

  // Update html dir/lang
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {}
  }, [lang, isRTL]);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ formData, currentStep })
      );
      setShowSavedHint(true);
      const tm = setTimeout(() => setShowSavedHint(false), 1800);
      return () => clearTimeout(tm);
    } catch {}
  }, [formData, currentStep]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "phone") {
        const prevLink = phoneToWhatsAppLink(prev.phone);
        const isCustomLink =
          !!prev.whatsapp &&
          prev.whatsapp.trim() !== "" &&
          !prev.whatsapp.startsWith("https://wa.me/");

        const currentIsAuto =
          !prev.whatsapp ||
          prev.whatsapp.trim() === "" ||
          prev.whatsapp === prevLink ||
          prev.whatsapp.startsWith("https://wa.me/");

        if (!isCustomLink && currentIsAuto) {
          const newLink = phoneToWhatsAppLink(value);
          if (newLink) {
            next.whatsapp = newLink;
          } else if (!value.trim()) {
            next.whatsapp = "";
          } else {
            if (value.replace(/\D/g, "").length < 2) {
              next.whatsapp = "";
            }
          }
        }
      }

      return next;
    });

    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      if (field === "phone") {
        delete next.whatsapp;
      }
      return next;
    });
  };

  const handleToggleGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goal);
      return {
        ...prev,
        goals: exists
          ? prev.goals.filter((g) => g !== goal)
          : [...prev.goals, goal],
      };
    });
    setErrors((prev) => {
      if (!prev.goals) return prev;
      const next = { ...prev };
      delete next.goals;
      return next;
    });
  };

  const handleToggleAgree = () => {
    setFormData((prev) => ({ ...prev, agreeTerms: !prev.agreeTerms }));
    setErrors((prev) => {
      if (!prev.agreeTerms) return prev;
      const next = { ...prev };
      delete next.agreeTerms;
      return next;
    });
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData, lang);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    if (currentStep < stepsData.length) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const stepErrors = validateStep(7, formData, lang);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setSubmitted(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    setSubmitted(false);
  };

  const currentStepData = useMemo(
    () => stepsData.find((s) => s.id === currentStep)!,
    [currentStep, stepsData]
  );

  const interpolate = (str: string, vars: Record<string, string | number>) => {
    let res = str;
    for (const [k, v] of Object.entries(vars)) {
      res = res.replace(`{${k}}`, String(v));
    }
    return res;
  };

  if (submitted) {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white flex items-center justify-center p-4"
        style={{ fontFamily: isRTL ? '"Cairo","Tajawal",sans-serif' : '"Cairo","Tajawal",system-ui,sans-serif' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-indigo-200/60 p-8 sm:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-200"
          >
            <svg
              className="h-14 w-14 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            {t.successTitle}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
            {t.successSubtitle}
          </p>

          <div className={`rounded-2xl bg-indigo-50/60 border border-indigo-100 p-5 mb-6 ${isRTL ? "text-right" : "text-left"}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <div className="font-semibold text-indigo-900 text-sm">
                  {t.nextSteps}
                </div>
                <ul className="text-sm text-slate-700 mt-2 space-y-1.5">
                  {t.nextStepsList.map((item, i) => (
                    <li key={i}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-l from-indigo-600 to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:from-indigo-700 hover:to-indigo-800 transition-all"
            >
              {t.newForm}
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
            >
              {isRTL ? "رجوع" : "Retour"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white"
      style={{ fontFamily: isRTL ? '"Cairo","Tajawal",system-ui,sans-serif' : '"Cairo","Tajawal",system-ui,sans-serif' }}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size={44} variant="header" alt={`${t.brandName} Logo`} className="h-11 w-11 sm:h-11 sm:w-11 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-extrabold text-sm sm:text-[15px] text-slate-900 truncate tracking-tight">
                {t.brandName}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 truncate font-medium">
                {t.headerSubtitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
              <span>⭐</span>
              {t.serviceBadge}
            </div>

            {/* Lang Switcher */}
            <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setLang("ar")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === "ar"
                    ? "bg-white shadow-sm text-indigo-700 border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang("fr")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  lang === "fr"
                    ? "bg-white shadow-sm text-indigo-700 border border-slate-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                FR
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 text-center">
        <motion.div
          key={`hero-${lang}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full mb-4">
            <span>✨</span>
            {t.freeBadge}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
            {t.heroTitle}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
        </motion.div>

        <motion.div
          key={`tips-${lang}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto"
        >
          <div className={`flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}>
            <span className="text-xl flex-shrink-0">💡</span>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              <strong>{t.tipTitle}</strong> {t.tipText}
            </p>
          </div>
          <div className={`flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 ${isRTL ? "text-right" : "text-left"}`}>
            <span className="text-xl flex-shrink-0">🤝</span>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              <strong>{t.trustTitle}</strong> {t.trustText}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Form Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
        >
          {/* Progress */}
          <div className="px-5 sm:px-8 pt-6 pb-4 border-b border-slate-100">
            <ProgressStepper
              currentStep={currentStep}
              onStepClick={(s) => {
                if (s < currentStep) goToStep(s);
              }}
              lang={lang}
              stepsData={stepsData}
              interpolate={interpolate}
            />
          </div>

          {/* Step content */}
          <div className="px-5 sm:px-8 py-6 sm:py-8 min-h-[420px]">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>{currentStepData.icon}</span>
                <span>{currentStepData.title}</span>
              </h2>
              <div className="h-1 w-12 bg-gradient-to-l from-indigo-500 to-indigo-700 rounded-full mt-2" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep}-${lang}`}
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -30 : 30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {currentStep === 1 && (
                  <Step1Contact
                    data={formData}
                    errors={errors}
                    onChange={handleChange}
                    lang={lang}
                  />
                )}
                {currentStep === 2 && (
                  <Step2Business
                    data={formData}
                    errors={errors}
                    onChange={handleChange}
                    lang={lang}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Goals
                    data={formData}
                    errors={errors}
                    onToggleGoal={handleToggleGoal}
                    lang={lang}
                  />
                )}
                {currentStep === 4 && (
                  <Step4Content
                    data={formData}
                    errors={errors}
                    onChange={handleChange}
                    lang={lang}
                  />
                )}
                {currentStep === 5 && (
                  <Step5Visual
                    data={formData}
                    errors={errors}
                    onChange={handleChange}
                    lang={lang}
                  />
                )}
                {currentStep === 6 && (
                  <Step6Additional data={formData} onChange={handleChange} lang={lang} />
                )}
                {currentStep === 7 && (
                  <Step7Review
                    data={formData}
                    onToggleAgree={handleToggleAgree}
                    lang={lang}
                  />
                )}
                {errors.agreeTerms && currentStep === 7 && (
                  <p className="mt-3 text-xs font-medium text-rose-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.agreeTerms}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer actions */}
          <div className="px-5 sm:px-8 py-4 sm:py-5 bg-slate-50/80 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <svg
                    className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  {t.prev}
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              <AnimatePresence>
                {showSavedHint && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-xs text-slate-500 flex items-center gap-1"
                  >
                    <span>💾</span>
                    <span>{t.autoSaved}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {currentStep < stepsData.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-l from-indigo-600 to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-200 hover:shadow-xl hover:from-indigo-700 hover:to-indigo-800 active:scale-[0.98] transition-all"
              >
                {t.next}
                <svg
                  className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-l from-emerald-500 to-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-200 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-800 active:scale-[0.98] transition-all"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                {t.submit}
              </button>
            )}
          </div>
        </motion.div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} {t.brandName} — {isRTL ? "جميع الحقوق محفوظة" : "Tous droits réservés"}
        </p>
      </section>
    </div>
  );
}
