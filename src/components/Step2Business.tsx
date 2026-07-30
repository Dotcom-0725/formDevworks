import FormField from "./FormField";
import type { FormData } from "../types";
import { translations, type Lang } from "../i18n/translations";

interface Step2Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
  lang: Lang;
}

export default function Step2Business({ data, errors, onChange, lang }: Step2Props) {
  const t = translations[lang];
  const isRTL = lang === "ar";
  const baseInput =
    "w-full rounded-xl border-2 bg-white px-4 py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100";

  const otherIndustryAr = translations.ar.industries[translations.ar.industries.length - 1];
  const otherIndustryFr = translations.fr.industries[translations.fr.industries.length - 1];
  const isOtherIndustry = data.industry === otherIndustryAr || data.industry === otherIndustryFr;

  return (
    <div className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
      <FormField
        label={t.industryLabel}
        required
        error={errors.industry}
        htmlFor="industry"
      >
        <select
          id="industry"
          value={data.industry}
          onChange={(e) => onChange("industry", e.target.value)}
          className={`${baseInput} ${
            errors.industry
              ? "border-rose-400"
              : "border-slate-200 focus:border-indigo-500"
          } ${data.industry ? "text-slate-800" : "text-slate-400"}`}
        >
          <option value="">{t.phIndustrySelect}</option>
          {t.industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </FormField>

      {isOtherIndustry && (
        <FormField
          label={t.industryOtherLabel}
          required
          error={errors.industryOther}
          htmlFor="industryOther"
        >
          <input
            id="industryOther"
            type="text"
            value={data.industryOther || ""}
            onChange={(e) => onChange("industryOther", e.target.value)}
            placeholder={t.phIndustryOther}
            className={`${baseInput} ${
              errors.industryOther
                ? "border-rose-400"
                : "border-slate-200 focus:border-indigo-500"
            }`}
          />
        </FormField>
      )}

      <FormField
        label={t.businessDescLabel}
        required
        error={errors.businessDescription}
        htmlFor="businessDescription"
        hint={t.businessDescHint}
      >
        <textarea
          id="businessDescription"
          rows={5}
          value={data.businessDescription}
          onChange={(e) => onChange("businessDescription", e.target.value)}
          placeholder={t.phBusinessDesc}
          className={`${baseInput} resize-none leading-relaxed ${
            errors.businessDescription
              ? "border-rose-400"
              : "border-slate-200 focus:border-indigo-500"
          }`}
        />
      </FormField>
    </div>
  );
}
