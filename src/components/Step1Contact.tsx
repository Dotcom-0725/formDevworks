import { motion, AnimatePresence } from "framer-motion";
import FormField from "./FormField";
import type { FormData } from "../types";
import { translations, type Lang } from "../i18n/translations";

interface Step1Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
  lang: Lang;
}

function localPhoneToWa(phone: string): string {
  if (!phone) return "";
  let digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) {
    digits = "212" + digits.slice(1);
  } else if (digits.length === 9 && /^[67]/.test(digits)) {
    digits = "212" + digits;
  }
  if (digits.length < 4) return "";
  return `https://wa.me/${digits}`;
}

export default function Step1Contact({ data, errors, onChange, lang }: Step1Props) {
  const t = translations[lang];
  const isRTL = lang === "ar";
  const baseInput =
    "w-full rounded-xl border-2 bg-white px-4 py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100";

  const autoLink = localPhoneToWa(data.phone);
  const isAutoFilled = !!(
    data.phone &&
    data.whatsapp &&
    data.whatsapp.startsWith("https://wa.me/") &&
    autoLink &&
    data.whatsapp === autoLink
  );

  const whatsappHasValue = !!data.whatsapp?.trim();
  const otherCityAr = translations.ar.cities[translations.ar.cities.length - 1];
  const otherCityFr = translations.fr.cities[translations.fr.cities.length - 1];
  const isOtherCity = data.city === otherCityAr || data.city === otherCityFr;

  return (
    <div className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t.fullNameLabel}
          required
          error={errors.fullName}
          htmlFor="fullName"
        >
          <input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder={t.phFullName}
            className={`${baseInput} ${
              errors.fullName
                ? "border-rose-400"
                : "border-slate-200 focus:border-indigo-500"
            }`}
          />
        </FormField>

        <FormField
          label={t.phoneLabel}
          required
          error={errors.phone}
          htmlFor="phone"
        >
          <div className="relative">
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder={t.phPhone}
              className={`${baseInput} ${isRTL ? "pr-11" : "pl-11"} ${
                errors.phone
                  ? "border-rose-400"
                  : "border-slate-200 focus:border-indigo-500"
              }`}
            />
            <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-lg ${isRTL ? "right-3" : "left-3"}`}>
              📱
            </span>
            <AnimatePresence>
              {data.phone && !errors.phone && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center ${isRTL ? "left-3" : "right-3"}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {data.phone && !errors.phone && (
            <p className="text-[11px] text-indigo-600 flex items-center gap-1 mt-1.5">
              <span>{isRTL ? "↳" : "↳"}</span>
              {t.phoneHintAuto}
            </p>
          )}
        </FormField>
      </div>

      <FormField
        label={t.emailLabel}
        error={errors.email}
        htmlFor="email"
        hint={t.optional}
      >
        <input
          id="email"
          type="email"
          dir="ltr"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder={t.phEmail}
          className={`${baseInput} text-left ${
            errors.email
              ? "border-rose-400"
              : "border-slate-200 focus:border-indigo-500"
          }`}
        />
      </FormField>

      <FormField label={t.cityLabel} required error={errors.city} htmlFor="city">
        <select
          id="city"
          value={data.city}
          onChange={(e) => onChange("city", e.target.value)}
          className={`${baseInput} ${
            errors.city
              ? "border-rose-400"
              : "border-slate-200 focus:border-indigo-500"
          } ${data.city ? "text-slate-800" : "text-slate-400"}`}
        >
          <option value="">{t.phCitySelect}</option>
          {t.cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FormField>

      {isOtherCity && (
        <FormField
          label={t.cityOtherLabel}
          required
          error={errors.cityOther}
          htmlFor="cityOther"
        >
          <input
            id="cityOther"
            type="text"
            value={data.cityOther || ""}
            onChange={(e) => onChange("cityOther", e.target.value)}
            placeholder={t.phCityOther}
            className={`${baseInput} ${
              errors.cityOther
                ? "border-rose-400"
                : "border-slate-200 focus:border-indigo-500"
            }`}
          />
        </FormField>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t.companyLabel}
          htmlFor="companyName"
          hint={t.optional}
        >
          <input
            id="companyName"
            type="text"
            value={data.companyName || ""}
            onChange={(e) => onChange("companyName", e.target.value)}
            placeholder={t.phCompany}
            className={`${baseInput} border-slate-200 focus:border-indigo-500`}
          />
        </FormField>

        <FormField
          label={t.whatsappLabel}
          htmlFor="whatsapp"
          error={errors.whatsapp}
          hint={
            isAutoFilled ? t.autoWhatsappHint : t.optionalWhatsapp
          }
        >
          <div className="relative group">
            <input
              id="whatsapp"
              type="url"
              dir="ltr"
              value={data.whatsapp || ""}
              onChange={(e) => onChange("whatsapp", e.target.value)}
              placeholder={t.phWhatsapp}
              className={`${baseInput} text-left pr-3 pl-11 transition-colors ${
                isAutoFilled
                  ? "border-indigo-300 bg-indigo-50/40 focus:border-indigo-500 focus:bg-white"
                  : whatsappHasValue
                  ? "border-slate-200 focus:border-indigo-500"
                  : "border-slate-200 focus:border-indigo-500"
              } ${errors.whatsapp ? "!border-rose-400 !bg-white" : ""}`}
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-[#25D366] flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                <path d="M19.11 4.93A9.81 9.81 0 0 0 12.2 2A9.9 9.9 0 0 0 3.44 14.91L2 22l7.26-1.9A9.87 9.87 0 0 0 12.2 22a9.9 9.9 0 0 0 6.91-17.07ZM12.2 20a7.8 7.8 0 0 1-4-1.1l-.29-.17-4.31 1.13 1.15-4.2-.19-.31A7.86 7.86 0 0 1 4.2 12 7.94 7.94 0 0 1 12.2 4a7.93 7.93 0 0 1 7.95 7.91A7.94 7.94 0 0 1 12.2 20Zm4.31-5.9c-.24-.12-1.43-.7-1.65-.78s-.38-.12-.54.12-.62.78-.77.94-.29.18-.54.06a6.66 6.66 0 0 1-1.95-1.2 7.34 7.34 0 0 1-1.36-1.69c-.14-.24 0-.38.11-.5a9.45 9.45 0 0 0 .33-.48c.08-.12.11-.21.17-.35s0-.26 0-.38-.54-1.3-.74-1.79c-.19-.47-.39-.41-.54-.41h-.46c-.16 0-.42.06-.64.3s-.84.81-.84 2 0 2.07.84 2.79c.62 1.04 1.77 1.99 2.76 2.41a8.9 8.9 0 0 0 2.6.71c.35 0 .76-.11.9-.3s.95-1.11 1.12-1.48.15-.68.07-.78-.18-.15-.42-.27Z" />
              </svg>
            </span>

            <AnimatePresence>
              {isAutoFilled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`absolute -top-2.5 flex items-center gap-0.5 rounded-full bg-gradient-to-l from-indigo-600 to-indigo-500 text-white text-[10px] font-bold px-2.5 py-0.5 shadow-md shadow-indigo-200 pointer-events-none ${isRTL ? "-right-2" : "-left-2"}`}
                >
                  <span>✨</span>
                  <span>{t.autoBadge}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FormField>
      </div>
    </div>
  );
}
