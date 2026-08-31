"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
}

export function Marquee({
  items,
  speed = 30,
  className,
  pauseOnHover = true,
}: MarqueeProps) {
  const doubled = useMemo(() => [...items, ...items], [items]);
  const duration = items.length * speed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#101114]/[0.03] border-y border-[#E6E4DF]",
        className
      )}
    >
      <style>{`
        @keyframes marquee_scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee_scroll ${duration}s linear infinite;
        }
        ${pauseOnHover ? ".marquee-track:hover { animation-play-state: paused; }" : ""}
      `}</style>
      <div className="flex w-max marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap px-6 py-3 text-sm text-gray-500 select-none"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF8A00]/40 mr-3 shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
