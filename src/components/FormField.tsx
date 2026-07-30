import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}

export default function FormField({
  label,
  required,
  error,
  hint,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
        {required && <span className="text-rose-500 mr-1">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
