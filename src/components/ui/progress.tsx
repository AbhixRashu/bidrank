import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressVariants = cva(
  "h-2 rounded-full bg-[#E6E4DF] overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-1.5",
        default: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
  color?: "saffron" | "green" | "blue" | "default";
}

const colorMap = {
  default: "bg-[#101114]",
  saffron: "bg-[#FF8A00]",
  green: "bg-[#138A4B]",
  blue: "bg-[#245BFF]",
};

function Progress({
  value,
  color = "default",
  size,
  className,
  ...props
}: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(progressVariants({ size }), className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          colorMap[color]
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

export { Progress, progressVariants };
