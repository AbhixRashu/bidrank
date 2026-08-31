"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#101114] text-white shadow-lg hover:bg-[#101114]/90 transition-all duration-300 animate-scale-in"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
