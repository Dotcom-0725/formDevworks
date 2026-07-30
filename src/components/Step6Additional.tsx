import FormField from "./FormField";
import type { FormData } from "../types";
import { translations, type Lang } from "../i18n/translations";

interface Step6Props {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  lang: Lang;
}

export default function Step6Additional({ data, onChange, lang }: Step6Props) {
  const t = translations[lang];
  const isRTL = lang === "ar";
  const baseInput =
    "w-full rounded-xl border-2 bg-white px-4 py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100";

  return (
    <div className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
      <FormField
        label={t.specialFeaturesLabel}
        htmlFor="specialFeatures"
        hint={t.specialFeaturesHint}
      >
        <textarea
          id="specialFeatures"
          rows={5}
          value={data.specialFeatures}
          onChange={(e) => onChange("specialFeatures", e.target.value)}
          placeholder={t.specialFeaturesPlaceholder}
          className={`${baseInput} resize-none leading-relaxed border-slate-200 focus:border-indigo-500`}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t.budgetLabel}
          htmlFor="budget"
          hint={t.optional}
        >
          <select
            id="budget"
            value={data.budget || ""}
            onChange={(e) => onChange("budget", e.target.value)}
            className={`${baseInput} border-slate-200 focus:border-indigo-500 ${
              data.budget ? "text-slate-800" : "text-slate-400"
            }`}
          >
            <option value="">{t.phBudgetSelect}</option>
            {t.budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label={t.timelineLabel}
          htmlFor="timeline"
          hint={t.optional}
        >
          <select
            id="timeline"
            value={data.timeline || ""}
            onChange={(e) => onChange("timeline", e.target.value)}
            className={`${baseInput} border-slate-200 focus:border-indigo-500 ${
              data.timeline ? "text-slate-800" : "text-slate-400"
            }`}
          >
            <option value="">{t.phTimelineSelect}</option>
            {t.timelineOptions.map((tOpt) => (
              <option key={tOpt} value={tOpt}>
                {tOpt}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  );
}
