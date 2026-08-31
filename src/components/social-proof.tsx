"use client";

import { useState, useEffect } from "react";
import { Shield, Eye, Zap, IndianRupee } from "lucide-react";
import { SmoothReveal } from "@/components/smooth-reveal";
import { useVisitorStats } from "@/components/providers/visitor-provider";

const features = [
  {
    icon: Eye,
    title: "Public visibility",
    description:
      "Every listing is on the public leaderboard, visible to all visitors.",
  },
  {
    icon: IndianRupee,
    title: "INR payments",
    description:
      "Pay in Indian Rupees via UPI, cards, net banking, and wallets.",
  },
  {
    icon: Shield,
    title: "Verified placements",
    description:
      "Every successful bid is verified and confirmed server-side before activation.",
  },
  {
    icon: Zap,
    title: "Instant ranking",
    description:
      "Your rank updates the moment your payment is confirmed. No delays.",
  },
];

export function SocialProofSection() {
  const { totalVisitors } = useVisitorStats();
  const [stats, setStats] = useState({ listings: 0, totalBids: 0 });

  useEffect(() => {
    fetch("/api/leaderboard?limit=200")
      .then((r) => r.json())
      .then((data) => {
        const leaderboard = data.leaderboard ?? [];
        const totalBids = leaderboard.reduce(
          (sum: number, item: { bidAmount: number }) => sum + item.bidAmount,
          0
        );
        setStats({ listings: leaderboard.length, totalBids });
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 bg-white border-t border-[#E6E4DF]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SmoothReveal>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#101114]">
              How IndBid works
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
              A transparent paid leaderboard for Indian products. No hidden
              mechanics, no gambling, no prizes.
            </p>
          </div>
        </SmoothReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <SmoothReveal key={feature.title} delay={index * 100}>
              <div
                className="p-5 rounded-xl border border-[#E6E4DF] hover:border-[#FF8A00]/30 transition-all duration-300 hover-lift"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF8A00]/10 mb-3">
                  <feature.icon className="h-5 w-5 text-[#FF8A00]" />
                </div>
                <h3 className="text-sm font-semibold text-[#101114] mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </SmoothReveal>
          ))}
        </div>

        <SmoothReveal delay={400}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#F8F7F3] border border-[#E6E4DF] flex-wrap justify-center">
              <p className="text-sm text-gray-600">
                <strong className="text-[#101114]">{stats.listings} products</strong> currently on the leaderboard
              </p>
              <span className="text-[#E6E4DF]">|</span>
              <p className="text-sm text-gray-600">
                <strong className="text-[#101114]">
                  {stats.totalBids > 0
                    ? `₹${stats.totalBids.toLocaleString("en-IN")}+`
                    : "₹0"} in total bids placed
                </strong>
              </p>
              <span className="text-[#E6E4DF]">|</span>
              <p className="text-sm text-gray-600">
                <strong className="text-[#101114]">{totalVisitors.toLocaleString("en-IN")}+</strong> users visited
              </p>
            </div>
          </div>
        </SmoothReveal>
      </div>
    </section>
  );
}
