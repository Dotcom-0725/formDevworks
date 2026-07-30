import FormField from "./FormField";
import RadioCard from "./RadioCard";
import type { FormData } from "../types";
import { translations, type Lang } from "../i18n/translations";

interface Step4Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
  lang: Lang;
}

export default function Step4Content({ data, errors, onChange, lang }: Step4Props) {
  const t = translations[lang];
  const isRTL = lang === "ar";

  return (
    <div className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
      <FormField
        label={t.contentStatusLabel}
        required
        error={errors.contentStatus}
        hint={t.contentStatusHint}
      >
        <div className="space-y-3">
          {t.contentOptions.map((opt) => (
            <RadioCard
              key={opt.value}
              name="contentStatus"
              value={opt.value}
              selected={data.contentStatus}
              onChange={(v) => onChange("contentStatus", v)}
              label={opt.label}
              desc={opt.desc}
            />
          ))}
        </div>
      </FormField>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3 items-start">
        <span className="text-xl flex-shrink-0">📌</span>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          {t.contentNote}
        </p>
      </div>
    </div>
  );
}
