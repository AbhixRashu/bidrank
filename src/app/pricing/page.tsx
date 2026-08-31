import type { Metadata } from "next";
import Link from "next/link";
import {
  IndianRupee,
  Receipt,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for IndBid. No hidden fees — your bid goes directly to securing your rank on the leaderboard.",
};

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#101114] leading-[1.1] mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            No hidden fees. No surprise charges. Your bid goes directly to
            securing your rank on the leaderboard.
          </p>
        </div>
      </section>

      {/* Main Pricing */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-2xl border border-[#E6E4DF] p-8 sm:p-10 bg-[#F8F7F3]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#138A4B]/10 text-[#138A4B] text-xs font-semibold mb-4">
                <CheckCircle className="h-4 w-4" />
                No hidden fees
              </div>
              <h2 className="text-2xl font-bold text-[#101114] mb-2">
                Your bid = your rank
              </h2>
              <p className="text-sm text-gray-500">
                The amount you bid is the amount that secures your position.
              </p>
            </div>

            <div className="space-y-6">
              {/* Bid Amount */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#E6E4DF]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF8A00]/10 shrink-0">
                  <IndianRupee className="h-5 w-5 text-[#FF8A00]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#101114] mb-1">
                    Bid amount
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    This is the amount you choose to bid. It goes directly to
                    holding your rank on the leaderboard. Your bid is your
                    commitment to securing that position.
                  </p>
                </div>
              </div>

              {/* Platform Fee */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#E6E4DF]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#245BFF]/10 shrink-0">
                  <Receipt className="h-5 w-5 text-[#245BFF]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#101114] mb-1">
                    Platform fee
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Currently{" "}
                    <strong className="text-[#138A4B]">0%</strong> platform
                    fee. We may introduce a small platform fee in the future to
                    cover operational costs. Any changes will be communicated
                    well in advance.
                  </p>
                </div>
              </div>

              {/* Invoice */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#E6E4DF]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#138A4B]/10 shrink-0">
                  <CheckCircle className="h-5 w-5 text-[#138A4B]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#101114] mb-1">
                    Payment receipt
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Every successful payment generates a receipt. You can
                    download your receipts from your dashboard anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-16 sm:py-20 bg-[#F8F7F3] border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#101114] text-center mb-8">
            What you need to know
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-xl border border-[#E6E4DF] bg-white">
              <CheckCircle className="h-5 w-5 text-[#138A4B] mb-3" />
              <h3 className="text-sm font-semibold text-[#101114] mb-1">
                Your bid goes to your rank
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every rupee you bid is used to secure your position on the
                leaderboard. No middlemen, no commission on bids.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E6E4DF] bg-white">
              <CheckCircle className="h-5 w-5 text-[#138A4B] mb-3" />
              <h3 className="text-sm font-semibold text-[#101114] mb-1">
                Pay in INR
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                All transactions are in Indian Rupees. We accept UPI, cards, net
                banking, and popular wallets.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E6E4DF] bg-white">
              <CheckCircle className="h-5 w-5 text-[#138A4B] mb-3" />
              <h3 className="text-sm font-semibold text-[#101114] mb-1">
                No surprise charges
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                What you see is what you pay. No hidden processing fees, no
                membership charges, no recurring costs.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#E6E4DF] bg-white">
              <CheckCircle className="h-5 w-5 text-[#138A4B] mb-3" />
              <h3 className="text-sm font-semibold text-[#101114] mb-1">
                Upgrade anytime
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                You can increase your bid at any time by paying the difference.
                Your rank updates instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#101114] mb-3">
            Ready to claim your rank?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Transparent pricing. No surprises. Just results.
          </p>
          <Link
            href="/claim"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF8A00] text-white text-sm font-semibold hover:bg-[#e67b00] transition-colors"
          >
            Claim a rank
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-[#F8F7F3] border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs text-gray-400 text-center">
            This page is a template and should be reviewed by a qualified legal
            professional before use in production. Pricing and fee structures
            are subject to change.
          </p>
        </div>
      </section>
    </>
  );
}
