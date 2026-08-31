"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  React.useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#101114]/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl bg-white border border-[#E6E4DF] shadow-2xl p-6 animate-scale-in outline-none",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#101114] hover:bg-[#F8F7F3] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-xl font-bold text-[#101114]">{children}</h2>
    </div>
  );
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("text-gray-600", className)}>{children}</div>;
}
