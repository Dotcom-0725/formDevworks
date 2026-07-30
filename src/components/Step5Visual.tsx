import FormField from "./FormField";
import RadioCard from "./RadioCard";
import type { FormData } from "../types";
import { translations, type Lang } from "../i18n/translations";

interface Step5Props {
  data: FormData;
  errors: Record<string, string>;
  onChange: (field: keyof FormData, value: string) => void;
  lang: Lang;
}

export default function Step5Visual({ data, errors, onChange, lang }: Step5Props) {
  const t = translations[lang];
  const isRTL = lang === "ar";
  const baseInput =
    "w-full rounded-xl border-2 bg-white px-4 py-3 text-sm sm:text-base text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-100";

  return (
    <div className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
      <FormField
        label={t.logoLabel}
        required
        error={errors.hasLogo}
      >
        <div className="space-y-3">
          {t.logoOptions.map((opt) => (
            <RadioCard
              key={opt.value}
              name="hasLogo"
              value={opt.value}
              selected={data.hasLogo}
              onChange={(v) => onChange("hasLogo", v)}
              label={opt.label}
              desc={opt.desc}
            />
          ))}
        </div>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t.colorsLabel}
          htmlFor="preferredColors"
          hint={t.optional}
        >
          <input
            id="preferredColors"
            type="text"
            value={data.preferredColors || ""}
            onChange={(e) => onChange("preferredColors", e.target.value)}
            placeholder={t.phColors}
            className={`${baseInput} border-slate-200 focus:border-indigo-500`}
          />
        </FormField>

        <FormField
          label={t.inspirationLabel}
          htmlFor="inspirationLinks"
          hint={t.optional}
        >
          <input
            id="inspirationLinks"
            type="text"
            dir="ltr"
            value={data.inspirationLinks || ""}
            onChange={(e) => onChange("inspirationLinks", e.target.value)}
            placeholder={t.phInspiration}
            className={`${baseInput} text-left border-slate-200 focus:border-indigo-500`}
          />
        </FormField>
      </div>
    </div>
  );
}
