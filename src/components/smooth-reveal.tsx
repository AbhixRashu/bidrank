"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface SmoothRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function SmoothReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: SmoothRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const directionClass = {
    up: "reveal-up",
    down: "reveal-down",
    left: "reveal-left",
    right: "reveal-right",
  }[direction];

  return (
    <div
      ref={ref}
      className={`${directionClass} ${isVisible ? "revealed" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
