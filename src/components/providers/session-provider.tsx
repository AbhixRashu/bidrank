"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/toast";
import { ScrollToTop } from "@/components/scroll-to-top";
import { VisitorProvider } from "./visitor-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <VisitorProvider>
          {children}
          <ScrollToTop />
        </VisitorProvider>
      </ToastProvider>
    </SessionProvider>
  );
}

