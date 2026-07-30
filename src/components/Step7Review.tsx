import type { FormData } from "../types";
import { translations, type Lang } from "../i18n/translations";

interface Step7Props {
  data: FormData;
  onToggleAgree: () => void;
  lang: Lang;
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="text-xs sm:text-sm font-semibold text-slate-500 sm:w-44 flex-shrink-0">
        {label}
      </div>
      <div className="text-sm sm:text-base text-slate-800 font-medium flex-1 break-words">
        {value || <span className="text-slate-400">—</span>}
      </div>
    </div>
  );
}

export default function Step7Review({ data, onToggleAgree, lang }: Step7Props) {
  const t = translations[lang];
  const isRTL = lang === "ar";

  const otherCityAr = translations.ar.cities[translations.ar.cities.length - 1];
  const otherCityFr = translations.fr.cities[translations.fr.cities.length - 1];
  const isOtherCity = data.city === otherCityAr || data.city === otherCityFr;
  const city = isOtherCity ? data.cityOther : data.city;

  const otherIndustryAr = translations.ar.industries[translations.ar.industries.length - 1];
  const otherIndustryFr = translations.fr.industries[translations.fr.industries.length - 1];
  const isOtherIndustry = data.industry === otherIndustryAr || data.industry === otherIndustryFr;
  const industry = isOtherIndustry ? data.industryOther : data.industry;

  const goalsLabels = data.goals
    .map((g) => t.goals.find((o) => o.id === g)?.label)
    .filter(Boolean)
    .join(isRTL ? "، " : ", ");

  return (
    <div className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
      <div className="rounded-2xl bg-gradient-to-l from-indigo-500 to-indigo-700 text-white p-5 shadow-lg shadow-indigo-200">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            🎉
          </div>
          <div>
            <h3 className="font-bold text-lg">{t.reviewAlmostDone}</h3>
            <p className="text-indigo-100 text-xs sm:text-sm">
              {t.reviewDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
          <span>{t.icons[0]}</span> {t.contactInfo}
        </h4>
        <div className="bg-slate-50 rounded-xl p-4">
          <ReviewItem label={t.rvFullName} value={data.fullName} />
          <ReviewItem label={t.rvPhone} value={data.phone} />
          <ReviewItem label={t.rvEmail} value={data.email} />
          <ReviewItem label={t.rvCity} value={city} />
          <ReviewItem label={t.rvCompany} value={data.companyName} />
          <ReviewItem label={t.rvWhatsapp} value={data.whatsapp} />
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
          <span>{t.icons[1]}</span> {t.businessInfo}
        </h4>
        <div className="bg-slate-50 rounded-xl p-4">
          <ReviewItem label={t.rvIndustry} value={industry} />
          <ReviewItem label={t.rvBusinessDesc} value={data.businessDescription} />
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
          <span>{t.icons[2]}</span> {t.goalsInfo}
        </h4>
        <div className="bg-slate-50 rounded-xl p-4">
          <ReviewItem label={t.rvGoals} value={goalsLabels} />
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
          <span>{t.icons[3]}</span> {t.contentIdentity}
        </h4>
        <div className="bg-slate-50 rounded-xl p-4">
          <ReviewItem label={t.rvContentStatus} value={data.contentStatus} />
          <ReviewItem label={t.rvLogoStatus} value={data.hasLogo} />
          <ReviewItem label={t.rvColors} value={data.preferredColors} />
          <ReviewItem label={t.rvInspiration} value={data.inspirationLinks} />
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
          <span>{t.icons[5]}</span> {t.additionalDetails}
        </h4>
        <div className="bg-slate-50 rounded-xl p-4">
          <ReviewItem label={t.rvSpecialFeatures} value={data.specialFeatures} />
          <ReviewItem label={t.rvBudget} value={data.budget} />
          <ReviewItem label={t.rvTimeline} value={data.timeline} />
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 transition-colors">
        <input
          type="checkbox"
          checked={data.agreeTerms}
          onChange={onToggleAgree}
          className="mt-1 h-5 w-5 accent-indigo-600 flex-shrink-0"
        />
        <span className="text-sm text-slate-700 leading-relaxed">
          {t.agreeTerms}
        </span>
      </label>
    </div>
  );
}
