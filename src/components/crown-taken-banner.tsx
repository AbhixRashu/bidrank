"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, X } from "lucide-react";

interface CrownTakenBannerProps {
  newProduct: string;
  oldProduct: string;
  amount: number;
  onDismiss: () => void;
}

export function CrownTakenBanner({ newProduct, oldProduct, amount, onDismiss }: CrownTakenBannerProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -60, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[9997] w-full max-w-lg px-4"
      >
        <div className="relative bg-gradient-to-r from-[#FF8A00] via-[#FFB347] to-[#FF8A00] rounded-xl p-4 shadow-[0_0_40px_rgba(255,138,0,0.3)] border border-[#FFD700]/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shrink-0">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                👑 Crown Taken! {newProduct} just outbid {oldProduct}
              </p>
              <p className="text-xs text-white/80">
                for ₹{amount.toLocaleString("en-IN")}
              </p>
            </div>
            <button
              onClick={onDismiss}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors shrink-0"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
