"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export const FAQS: FaqItem[] = [
  {
    category: "General",
    question: "What is BidRank and how does the live leaderboard work?",
    answer:
      "BidRank is India's real-time attention leaderboard for startups, SaaS tools, and digital products. By placing a verified bid in INR, makers secure their rank on the leaderboard. The higher your verified bid, the higher your position, giving your product massive organic visibility from founders, early adopters, and investors.",
  },
  {
    category: "Ranking & Bidding",
    question: "How are leaderboard rankings determined? Is it fair?",
    answer:
      "Rankings are 100% transparent and deterministic. Positions are strictly based on verified bid amounts in INR. There are no hidden algorithms, secret favors, or black-box moderation. Every bid is confirmed server-side before updating the board in real time.",
  },
  {
    category: "Bidding",
    question: "What happens when someone outbids my product?",
    answer:
      "If another product places a higher bid, they claim the spot above you and your ranking shifts accordingly. You can quickly outbid them anytime with a single-click top-up to reclaim the #1 spot and keep maximum attention on your launch.",
  },
  {
    category: "Payments",
    question: "What payment methods are supported?",
    answer:
      "We support all Indian payment options seamlessly via UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Credit/Debit Cards, Net Banking, and instant QR scan with zero foreign exchange fees.",
  },
  {
    category: "SEO & Traffic",
    question: "Does listing on BidRank help with SEO and backlinks?",
    answer:
      "Yes! Approved listings receive dedicated product showcase pages, clean structured metadata, and direct traffic from our high-intent startup ecosystem, increasing both referral visits and search discovery.",
  },
  {
    category: "Product Submission",
    question: "Who can list their product on BidRank?",
    answer:
      "Any maker, startup founder, agency, or indie developer building software, mobile apps, AI tools, developer utilities, or e-commerce products for the Indian or global market can claim their rank.",
  },
  {
    category: "Safety & Verification",
    question: "How are fake bids and spam listings prevented?",
    answer:
      "Every rank placement requires verified real-money payment confirmation. We do not allow dummy or unverified bids. In addition, all submitted product details undergo automated and human content compliance checks.",
  },
  {
    category: "Refunds & Policy",
    question: "Are bids refundable?",
    answer:
      "Because leaderboard visibility and rank spots are allocated instantly in real time upon payment confirmation, bids are generally non-refundable once the placement is live. Please refer to our Refund Policy for special exceptions.",
  },
];

export function FaqSection({ showHeading = true }: { showHeading?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured Data Schema for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-[#F8F7F3] border-t border-[#E6E4DF]"
      aria-label="Frequently Asked Questions"
    >
      {/* FAQ Schema JSON-LD for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {showHeading && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-[#FF8A00] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#101114]">
              Everything you need to know about BidRank
            </h2>
            <p className="mt-3 text-base text-gray-600 max-w-xl mx-auto">
              Learn how our live leaderboard ranking, bidding mechanism, and startup discovery work.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                  isOpen
                    ? "border-[#FF8A00]/40 shadow-sm"
                    : "border-[#E6E4DF] hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-semibold text-[#101114] flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-[#FF8A00] shrink-0 hidden sm:inline" />
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8F7F3] border border-[#E6E4DF] transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#FF8A00]/10 border-[#FF8A00]/30 text-[#FF8A00]" : "text-gray-500"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-gray-600 leading-relaxed border-t border-[#F0EFEB]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support contact card */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-white border border-[#E6E4DF]">
          <h3 className="text-sm font-semibold text-[#101114] mb-1">
            Still have questions?
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            We are here to help you get maximum reach for your product launch.
          </p>
          <a
            href="mailto:hello@bidrank.online"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101114] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
