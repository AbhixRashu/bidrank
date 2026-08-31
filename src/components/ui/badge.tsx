import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#101114]/5 text-[#101114]",
        saffron: "bg-[#FF8A00]/10 text-[#FF8A00]",
        green: "bg-[#138A4B]/10 text-[#138A4B]",
        blue: "bg-[#245BFF]/10 text-[#245BFF]",
        outline: "border border-[#E6E4DF] text-[#101114]",
        pending: "bg-amber-50 text-amber-700",
        success: "bg-emerald-50 text-emerald-700",
        error: "bg-red-50 text-red-700",
        muted: "bg-gray-100 text-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
