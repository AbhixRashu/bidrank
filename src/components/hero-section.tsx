"use client";

import { useState, useEffect } from "react";
import { BidForm } from "@/components/bid/bid-form";
import { QuickOutbidModal } from "@/components/bid/quick-outbid-modal";
import { formatINR } from "@/lib/utils";
import { TrendingUp, ArrowRight, Crown, Zap, Shield, Sparkles, Swords, Users } from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/animated-counter";
import { SmoothReveal } from "@/components/smooth-reveal";
import { LiveVisitors } from "@/components/live-visitors";
import { useVisitorStats } from "@/components/providers/visitor-provider";

export function HeroSection() {
  const { totalVisitors } = useVisitorStats();
  const [topBid, setTopBid] = useState(0);
  const [topListing, setTopListing] = useState<{ name: string; slug: string } | null>(null);
  const [totalListings, setTotalListings] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [outbidOpen, setOutbidOpen] = useState(false);


  useEffect(() => {
    setMounted(true);
    fetch("/api/leaderboard?limit=200")
      .then((res) => res.json())
      .then((data) => {
        const leaderboard = data.leaderboard ?? [];
        if (leaderboard.length > 0) {
          setTopBid(leaderboard[0].bidAmount);
          setTopListing({
            name: leaderboard[0].listing.name,
            slug: leaderboard[0].listing.slug,
          });
        }
        setTotalListings(leaderboard.length);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <QuickOutbidModal
        open={outbidOpen}
        onClose={() => setOutbidOpen(false)}
        productName={topListing?.name ?? ""}
        currentBid={topBid}
        targetSlug={topListing?.slug}
      />

      <section className="relative overflow-hidden bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF8A00]/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#245BFF]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#138A4B]/3 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <SmoothReveal delay={0}>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E6E4DF] text-xs font-medium text-gray-600 transition-all duration-700 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#138A4B] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#138A4B]" />
                  </span>
                  Live leaderboard — Updated in real-time
                  <LiveVisitors className="ml-1" />
                </div>
              </SmoothReveal>

              <SmoothReveal delay={100}>
                <h1
                  className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#101114] leading-[1.05] transition-all duration-700 delay-100 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  India&apos;s live leaderboard for products that want to be{" "}
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFB347] to-[#FF8A00] animate-gradient">
                      seen
                    </span>
                    <svg
                      className="absolute -bottom-1 left-0 w-full h-2 text-[#FF8A00]/30"
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                    >
                      <path d="M0 8 Q25 0 50 8 T100 8" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </span>
                  .
                </h1>
              </SmoothReveal>

              <SmoothReveal delay={200}>
                <p
                  className={`text-lg text-gray-600 max-w-lg transition-all duration-700 delay-200 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  Claim your rank in rupees. A higher verified bid takes the spot.
                  Simple, transparent, and competitive.
                </p>
              </SmoothReveal>

              <SmoothReveal delay={300}>
                <div
                  className={`flex items-center gap-6 flex-wrap transition-all duration-700 delay-300 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#E6E4DF] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF8A00]/10">
                      <Crown className="h-5 w-5 text-[#FF8A00]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                        Current #1 bid
                      </p>
                      <p className="text-xl font-black text-[#FF8A00]">
                        <AnimatedCounter value={topBid} prefix="₹" />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#E6E4DF] shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#245BFF]/10">
                      <Zap className="h-5 w-5 text-[#245BFF]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                        Products listed
                      </p>
                      <p className="text-xl font-black text-[#101114]">
                        <AnimatedCounter value={totalListings} />
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#E6E4DF] shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#138A4B]/10">
                      <Users className="h-5 w-5 text-[#138A4B]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                        Users Visited
                      </p>
                      <p className="text-xl font-black text-[#101114]">
                        <AnimatedCounter value={totalVisitors} />
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/how-it-works"
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#245BFF] hover:underline group"
                  >
                    How it works
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </SmoothReveal>

              <SmoothReveal delay={400}>
                <div
                  className={`flex items-center gap-3 transition-all duration-700 delay-400 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <button
                    onClick={() => setOutbidOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FFB347] text-white text-sm font-bold shadow-[0_0_20px_rgba(255,138,0,0.3)] hover:shadow-[0_0_30px_rgba(255,138,0,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Swords className="h-4 w-4" />
                    Outbid #{1} Now
                  </button>
                </div>
              </SmoothReveal>

              <SmoothReveal delay={500}>
                <div
                  className={`flex items-center gap-4 text-xs text-gray-500 transition-all duration-700 delay-500 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-[#138A4B]" />
                    <span>Verified payments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF8A00]" />
                    <span>Instant ranking</span>
                  </div>
                </div>
              </SmoothReveal>
            </div>

            <SmoothReveal delay={200} direction="right">
              <div
                className={`transition-all duration-700 delay-200 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="bg-white rounded-2xl border border-[#E6E4DF] shadow-xl overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#FF8A00] via-[#FFB347] to-[#FF8A00]" />
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-[#101114]">
                        Claim a rank
                      </h2>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#138A4B] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#138A4B]" />
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-5">
                      Enter your product details and bid amount to join the leaderboard.
                    </p>
                    <BidForm />
                  </div>
                </div>
              </div>
            </SmoothReveal>
          </div>
        </div>
      </section>
    </>
  );
}
