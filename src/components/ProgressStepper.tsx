import { motion } from "framer-motion";
import type { Lang } from "../i18n/translations";
import { translations } from "../i18n/translations";

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface StepData {
  id: number;
  title: string;
  plain: string;
  short: string;
  icon: string;
}

interface ProgressStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  lang: Lang;
  stepsData: StepData[];
  interpolate: (str: string, vars: Record<string, string | number>) => string;
}

export default function ProgressStepper({
  currentStep,
  onStepClick,
  lang,
  stepsData,
  interpolate,
}: ProgressStepperProps) {
  const t = translations[lang];
  const progress = ((currentStep - 1) / (stepsData.length - 1)) * 100;
  const isRTL = lang === "ar";

  return (
    <div className="w-full">
      {/* Mobile compact view */}
      <div className="block md:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-indigo-700">
            {interpolate(t.stepOf, {
              current: currentStep,
              total: stepsData.length,
            })}
          </span>
          <span className="text-xs text-slate-500">
            {interpolate(t.percentDone, { percent: Math.round(progress) })}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-indigo-700"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <div className="mt-3 text-center">
          <div className="text-2xl mb-1">
            {stepsData[currentStep - 1].icon}
          </div>
          <div className="text-base font-bold text-slate-800">
            {stepsData[currentStep - 1].plain}
          </div>
        </div>
      </div>

      {/* Desktop horizontal stepper */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-indigo-700">
            {interpolate(t.stepOf, {
              current: currentStep,
              total: stepsData.length,
            })}
          </span>
          <span className="text-xs text-slate-500">
            {interpolate(t.percentDone, { percent: Math.round(progress) })}
          </span>
        </div>

        <div className="relative">
          <div className="absolute top-5 right-0 left-0 h-1 bg-slate-200 rounded-full" />
          <motion.div
            className={`absolute top-5 h-1 bg-gradient-to-l from-indigo-500 to-indigo-700 rounded-full ${
              isRTL ? "right-0" : "left-0"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={
              isRTL
                ? { right: 0, left: "auto" }
                : { left: 0, right: "auto" }
            }
          />

          <ol className="relative flex items-start justify-between w-full">
            {stepsData.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              const isClickable = !!onStepClick && step.id < currentStep;

              return (
                <li
                  key={step.id}
                  className="flex flex-col items-center flex-1 min-w-0"
                >
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && onStepClick?.(step.id)}
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                        : isActive
                        ? "bg-white border-indigo-600 text-indigo-700 shadow-lg shadow-indigo-200 scale-110"
                        : "bg-white border-slate-300 text-slate-400"
                    } ${
                      isClickable
                        ? "cursor-pointer hover:scale-105"
                        : "cursor-default"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon />
                    ) : (
                      <span className="text-lg">{step.icon}</span>
                    )}
                  </button>
                  <div className="mt-2 text-center px-1">
                    <div
                      className={`text-xs font-semibold leading-tight ${
                        isActive
                          ? "text-indigo-700"
                          : isCompleted
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      {step.short}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
