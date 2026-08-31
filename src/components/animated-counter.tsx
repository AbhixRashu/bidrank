"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    const startTime = Date.now();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(end);
      prevValueRef.current = end;
      return;
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = end;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value, duration]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
