interface RadioCardProps {
  name: string;
  value: string;
  selected: string;
  onChange: (value: string) => void;
  label: string;
  desc?: string;
  icon?: string;
}

export default function RadioCard({
  value,
  selected,
  onChange,
  label,
  desc,
  icon,
}: RadioCardProps) {
  const isSelected = selected === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-200 group ${
        isSelected
          ? "border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100"
          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <div
            className={`font-semibold text-sm sm:text-base ${
              isSelected ? "text-indigo-800" : "text-slate-800"
            }`}
          >
            {label}
          </div>
          {desc && (
            <div
              className={`text-xs mt-1 ${
                isSelected ? "text-indigo-600" : "text-slate-500"
              }`}
            >
              {desc}
            </div>
          )}
        </div>
        <div
          className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? "border-indigo-600 bg-indigo-600"
              : "border-slate-300 bg-white"
          }`}
        >
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>
      </div>
    </button>
  );
}
