"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface VisitorContextType {
  liveCount: number;
  displayLiveCount: number;
  totalVisitors: number;
}

const VisitorContext = createContext<VisitorContextType>({
  liveCount: 48,
  displayLiveCount: 48,
  totalVisitors: 1428,
});

export function VisitorProvider({ children }: { children: React.ReactNode }) {
  // Baseline realistic live visitor range: 42 - 58
  const [liveCount, setLiveCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("indbid_live_visitors");
      if (saved) return parseInt(saved, 10);
    }
    return Math.floor(Math.random() * 12) + 44; // 44-55
  });

  const [displayLiveCount, setDisplayLiveCount] = useState<number>(liveCount);
  
  // Realistic total users visited (not exaggerated, e.g. ~1,428)
  const [totalVisitors, setTotalVisitors] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("indbid_total_visitors");
      if (saved) return parseInt(saved, 10);
    }
    return 1428;
  });

  const animationRef = useRef<number | null>(null);
  const displayCountRef = useRef<number>(liveCount);

  // Sync live visitor fluctuations at periodic intervals
  useEffect(() => {
    const updateLive = () => {
      setLiveCount((prev) => {
        // Natural drift between 39 and 58
        const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
        let next = prev + change;
        if (next < 38) next = 38 + Math.floor(Math.random() * 4);
        if (next > 62) next = 62 - Math.floor(Math.random() * 4);
        
        if (typeof window !== "undefined") {
          sessionStorage.setItem("indbid_live_visitors", next.toString());
        }
        return next;
      });
    };

    const interval = setInterval(updateLive, 7000);
    return () => clearInterval(interval);
  }, []);

  // Increment total visits occasionally in a realistic manner
  useEffect(() => {
    const incrementTotal = () => {
      setTotalVisitors((prev) => {
        const next = prev + 1;
        if (typeof window !== "undefined") {
          localStorage.setItem("indbid_total_visitors", next.toString());
        }
        return next;
      });
    };

    // Realistic trickle increment every 45-90 seconds
    const interval = setInterval(incrementTotal, 45000 + Math.random() * 45000);
    return () => clearInterval(interval);
  }, []);

  // Smooth easing animation for live count
  useEffect(() => {
    if (liveCount === displayCountRef.current) return;

    const start = displayCountRef.current;
    const diff = liveCount - start;
    const duration = 700;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const newValue = Math.round(start + diff * eased);
      displayCountRef.current = newValue;
      setDisplayLiveCount(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [liveCount]);

  return (
    <VisitorContext.Provider value={{ liveCount, displayLiveCount, totalVisitors }}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitorStats() {
  return useContext(VisitorContext);
}
