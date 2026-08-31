"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom";
}

export function Tooltip({
  content,
  children,
  className,
  side = "top",
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top:
        side === "top"
          ? rect.top + window.scrollY - 8
          : rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX + rect.width / 2,
    });
  }, [side]);

  React.useEffect(() => {
    if (isVisible) updatePosition();
  }, [isVisible, updatePosition]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex"
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className={cn(
              "fixed z-[9999] pointer-events-none px-3 py-1.5 text-xs font-medium text-white bg-[#101114] rounded-lg shadow-lg whitespace-nowrap animate-fade-in",
              side === "top" ? "-translate-y-full" : "",
              className
            )}
            style={{
              top: side === "top" ? position.top - 32 : position.top,
              left: position.left,
              transform: `translateX(-50%) ${side === "top" ? "translateY(-100%)" : ""}`,
            }}
          >
            {content}
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[#101114] rotate-45",
                side === "top" ? "bottom-[-4px]" : "top-[-4px]"
              )}
            />
          </div>,
          document.body
        )}
    </>
  );
}
