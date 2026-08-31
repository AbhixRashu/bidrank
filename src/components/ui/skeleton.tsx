import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-gray-200", className)}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className={cn("space-y-2.5", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3.5 rounded-md"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E6E4DF] bg-white p-6 space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3 rounded-md" />
          <Skeleton className="h-3 w-2/3 rounded-md" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonAvatar({
  size = "md",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-14 w-14" };
  return (
    <Skeleton
      className={cn("rounded-full shrink-0", sizeMap[size], className)}
      {...props}
    />
  );
}

export function SkeletonRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 py-3 border-b border-[#E6E4DF] last:border-0",
        className
      )}
      {...props}
    >
      <Skeleton className="h-5 w-5 rounded shrink-0" />
      <SkeletonAvatar size="sm" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-1/4 rounded-md" />
        <Skeleton className="h-2.5 w-1/3 rounded-md" />
      </div>
      <Skeleton className="h-6 w-16 rounded-lg shrink-0" />
    </div>
  );
}
