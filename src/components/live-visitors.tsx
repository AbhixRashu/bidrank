"use client";

import { useVisitorStats } from "@/components/providers/visitor-provider";

export function LiveVisitors({ className = "" }: { className?: string }) {
  const { displayLiveCount } = useVisitorStats();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#138A4B]/10 ${className}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="smooth-pulse absolute inline-flex h-full w-full rounded-full bg-[#138A4B] opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#138A4B]" />
      </span>
      <span className="text-xs font-medium text-[#138A4B] tabular-nums">
        {displayLiveCount} visitors online
      </span>
    </div>
  );
}

