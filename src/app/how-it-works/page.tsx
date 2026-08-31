import type { Metadata } from "next";
import Link from "next/link";
import {
  Send,
  Gavel,
  BarChart3,
  Eye,
  ArrowRight,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Learn how BidRank works — submit your product, place a bid, rank on the leaderboard, and get discovered by thousands.",
};

const steps = [
  {
    icon: Send,
    title: "Submit your product",
    description:
      "Add your product name, a short description, logo, and website URL. We review submissions to keep the leaderboard clean.",
    color: "#245BFF",
  },
  {
    icon: Gavel,
    title: "Place your bid",
    description:
      "Choose a bid amount in INR. Higher bids secure higher ranks. Your bid is your commitment — it goes directly toward holding that spot.",
    color: "#FF8A00",
  },
  {
    icon: BarChart3,
    title: "Get ranked",
    description:
      "Once your payment is confirmed, your rank is locked. The leaderboard updates in real-time so everyone sees the current standings.",
    color: "#138A4B",
  },
  {
    icon: Eye,
    title: "Get discovered",
    description:
      "Your listing is visible to every visitor. A higher rank means more eyes on your product — from potential customers, investors, and collaborators.",
    color: "#101114",
  },
];

const tiers = [
  { range: "₹0 – ₹9,999", increment: "₹500" },
  { range: "₹10,000 – ₹49,999", increment: "₹1,000" },
  { range: "₹50,000 – ₹1,99,999", increment: "₹5,000" },
  { range: "₹2,00,000+", increment: "₹10,000" },
];

const faqs = [
  {
    question: "Is this an auction?",
    answer:
      "No. BidRank is a paid leaderboard — not an auction. You set a bid amount, pay it, and that amount secures your rank. There are no competing bids from other users for the same spot. The highest total bid holds the top rank.",
  },
  {
    question: "Can I change my bid after paying?",
    answer:
      "Yes. You can increase your bid at any time by paying the difference. You cannot decrease a bid — ranks are cumulative.",
  },
  {
    question: "What happens if someone outbids me?",
    answer:
      "Your rank drops to reflect the new standings. You remain on the leaderboard at your current bid level. You can increase your bid at any time to reclaim a higher rank.",
  },
  {
    question: "How long does a rank last?",
    answer:
      "Your rank is active as long as your bid remains the highest or among the highest. There is no expiration — your bid holds until someone outbids you or you choose to withdraw.",
  },
  {
    question: "Is my listing reviewed before going live?",
    answer:
      "Yes. All listings are reviewed to ensure they meet our content standards. This keeps the leaderboard trustworthy and professional for everyone.",
  },
];

export default function HowItWorksPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero */}
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider mb-3">
            The system
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#101114] leading-[1.1] mb-4">
            How BidRank works
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            A transparent, paid leaderboard for Indian products. No hidden
            mechanics, no gambling, no prizes.
          </p>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-[#E6E4DF] z-0" />
                )}
                <div className="relative z-10 p-6 rounded-2xl border border-[#E6E4DF] bg-[#F8F7F3] hover:border-[#FF8A00]/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${step.color}15` }}
                    >
                      <step.icon
                        className="h-5 w-5"
                        style={{ color: step.color }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-400">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#101114] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bidding Rules */}
      <section className="py-16 sm:py-20 bg-[#F8F7F3] border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#101114] text-center mb-3">
            Bidding rules
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8 max-w-lg mx-auto">
            Minimum bid increments help keep the leaderboard fair and prevent
            trivial disputes over tiny amounts.
          </p>

          <div className="rounded-2xl border border-[#E6E4DF] overflow-hidden bg-white">
            <div className="grid grid-cols-2 bg-[#F8F7F3] border-b border-[#E6E4DF]">
              <div className="px-5 py-3 text-xs font-semibold text-[#101114] uppercase tracking-wider">
                Bid range
              </div>
              <div className="px-5 py-3 text-xs font-semibold text-[#101114] uppercase tracking-wider">
                Minimum increment
              </div>
            </div>
            {tiers.map((tier, i) => (
              <div
                key={tier.range}
                className={`grid grid-cols-2 ${
                  i < tiers.length - 1 ? "border-b border-[#E6E4DF]" : ""
                }`}
              >
                <div className="px-5 py-3.5 text-sm font-medium text-[#101114]">
                  {tier.range}
                </div>
                <div className="px-5 py-3.5 text-sm text-gray-600">
                  {tier.increment}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Increments are subject to change. Always check this page for the
            latest values.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#101114] text-center mb-8">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-[#E6E4DF] p-5"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-[#FF8A00] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#101114] mb-1">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-[#F8F7F3] border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#101114] mb-3">
            Ready to claim your rank?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Join the leaderboard and get your product in front of thousands of
            visitors.
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
      <section className="py-6 bg-white border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs text-gray-400 text-center">
            This page is a template and should be reviewed by a qualified legal
            professional before use in production.
          </p>
        </div>
      </section>
    </>
  );
}
