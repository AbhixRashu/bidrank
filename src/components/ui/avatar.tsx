"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-14 w-14 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  status?: "online" | "offline";
}

const statusColorMap = {
  online: "bg-[#138A4B]",
  offline: "bg-gray-400",
};

function Avatar({
  size,
  src,
  alt = "",
  fallback,
  status,
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const initials = React.useMemo(() => {
    if (fallback) return fallback;
    return alt
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [fallback, alt]);

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF8A00]/20 to-[#245BFF]/20 font-semibold text-[#101114]">
          {initials || "?"}
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white",
            statusColorMap[status]
          )}
        />
      )}
    </div>
  );
}

export { Avatar, avatarVariants };
