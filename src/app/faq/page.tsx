import type { Metadata } from "next";
import { FaqSection } from "@/components/faq-section";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | BidRank",
  description:
    "Got questions about BidRank? Find answers about live product rankings, UPI bidding, ranking updates, verification, and founder visibility.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF] py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-[#FF8A00] text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            Knowledge Base & FAQ
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#101114] leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about claiming your rank, getting discovered, and dominating the leaderboard.
          </p>
        </div>
      </section>

      {/* Main FAQ Component */}
      <FaqSection showHeading={false} />

      {/* CTA section */}
      <section className="py-16 bg-white border-t border-[#E6E4DF] text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-bold text-[#101114] mb-3">
            Ready to get your product noticed?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Claim a spot on the live leaderboard and start getting high-intent visitors today.
          </p>
          <Link
            href="/claim"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF8A00] text-white text-sm font-semibold hover:bg-[#e67b00] transition-colors"
          >
            Claim Your Rank Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
