"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] bg-[#F8F7F3] overflow-hidden px-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#FF8A00]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#245BFF]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Floating 404 illustration */}
      <div className="relative mb-10">
        <div className="animate-float">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF8A00] to-[#FFB347] shadow-xl rotate-6 animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#245BFF] to-[#5B8AFF] shadow-xl -rotate-6 animate-[spin_12s_linear_infinite_reverse]" />
            <div className="absolute inset-2 rounded-2xl bg-white border border-[#E6E4DF] flex items-center justify-center">
              <span className="text-5xl font-black text-[#101114] select-none">404</span>
            </div>
          </div>
        </div>
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-[#101114] mb-3 tracking-tight">
        Page not found
      </h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link href="/">
        <Button variant="default" size="lg">
          <ArrowLeft className="h-4 w-4" />
          Back to leaderboard
        </Button>
      </Link>
    </section>
  );
}
