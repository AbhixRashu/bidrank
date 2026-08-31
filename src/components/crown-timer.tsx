"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";

function formatDuration(seconds: number): { hh: string; mm: string; ss: string } {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return {
    hh: String(h).padStart(2, "0"),
    mm: String(m).padStart(2, "0"),
    ss: String(s).padStart(2, "0"),
  };
}

interface CrownTimerProps {
  heldSince: string | null;
  className?: string;
  variant?: "inline" | "expanded";
}

export function CrownTimer({ heldSince, className = "", variant = "inline" }: CrownTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  const calculateElapsed = useCallback(() => {
    if (!heldSince) return 0;
    const start = new Date(heldSince).getTime();
    const now = Date.now();
    return Math.floor((now - start) / 1000);
  }, [heldSince]);

  useEffect(() => {
    setElapsed(calculateElapsed());
    const interval = setInterval(() => setElapsed(calculateElapsed()), 1000);
    return () => clearInterval(interval);
  }, [calculateElapsed]);

  if (!heldSince) return null;

  const time = formatDuration(elapsed);

  if (variant === "expanded") {
    return (
      <div
        className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A00]/10 via-[#FFD700]/10 to-[#FF8A00]/10 border border-[#FF8A00]/20 ${className}`}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#FF8A00]/20 animate-ping" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A00] to-[#FFB347] shadow-[0_0_15px_rgba(255,138,0,0.4)]">
            <Crown className="h-4.5 w-4.5 text-white" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-[#FF8A00]/70 uppercase tracking-wider font-medium leading-none mb-1">
            Held Crown for
          </span>
          <div className="flex items-center gap-1">
            <TimeBlock value={time.hh} label="H" />
            <span className="text-[#FF8A00]/40 font-bold">:</span>
            <TimeBlock value={time.mm} label="M" />
            <span className="text-[#FF8A00]/40 font-bold">:</span>
            <TimeBlock value={time.ss} label="S" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF8A00]/15 to-[#FFD700]/15 border border-[#FF8A00]/20 ${className}`}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[#FF8A00]/30 animate-ping" />
        <Crown className="relative h-3.5 w-3.5 text-[#FF8A00] animate-float" />
      </div>
      <span className="text-xs font-semibold text-[#FF8A00] tabular-nums">
        👑 {time.hh}:{time.mm}:{time.ss}
      </span>
    </div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-base font-black text-[#FF8A00] tabular-nums leading-none"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <span className="text-[8px] text-[#FF8A00]/50 uppercase font-medium leading-none mt-0.5">
        {label}
      </span>
    </div>
  );
}
