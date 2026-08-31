import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "flex h-10 w-full rounded-lg border border-[#E6E4DF] bg-white px-3 py-2 text-sm text-[#101114] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245BFF] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
