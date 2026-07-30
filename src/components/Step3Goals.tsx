import FormField from "./FormField";
import CheckboxCard from "./CheckboxCard";
import type { FormData } from "../types";
import { translations, type Lang } from "../i18n/translations";

interface Step3Props {
  data: FormData;
  errors: Record<string, string>;
  onToggleGoal: (goal: string) => void;
  lang: Lang;
}

export default function Step3Goals({ data, errors, onToggleGoal, lang }: Step3Props) {
  const t = translations[lang];
  const isRTL = lang === "ar";

  return (
    <div className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
      <FormField
        label={t.goalsLabel}
        required
        error={errors.goals}
        hint={t.goalsHint}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {t.goals.map((g) => (
            <CheckboxCard
              key={g.id}
              value={g.id}
              selected={data.goals.includes(g.id)}
              onToggle={onToggleGoal}
              label={g.label}
              icon={g.icon}
            />
          ))}
        </div>
      </FormField>

      <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 flex gap-3 items-start">
        <span className="text-xl flex-shrink-0">💡</span>
        <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed">
          {t.goalsTip}
        </p>
      </div>
    </div>
  );
}
