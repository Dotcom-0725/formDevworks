interface CheckboxCardProps {
  value: string;
  selected: boolean;
  onToggle: (value: string) => void;
  label: string;
  icon?: string;
}

export default function CheckboxCard({
  value,
  selected,
  onToggle,
  label,
  icon,
}: CheckboxCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(value)}
      className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-200 ${
        selected
          ? "border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100"
          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
        <span
          className={`flex-1 font-semibold text-sm sm:text-base ${
            selected ? "text-indigo-800" : "text-slate-800"
          }`}
        >
          {label}
        </span>
        <div
          className={`flex-shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
            selected
              ? "border-indigo-600 bg-indigo-600"
              : "border-slate-300 bg-white"
          }`}
        >
          {selected && (
            <svg
              className="h-3.5 w-3.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
