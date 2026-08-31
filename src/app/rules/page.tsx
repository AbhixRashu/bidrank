import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Shield,
  Ban,
  Gavel,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Platform rules",
  description:
    "IndBid platform rules — listing requirements, content standards, bidding integrity, and enforcement policies.",
};

const sections = [
  {
    icon: FileText,
    title: "Listing requirements",
    items: [
      "All products must be Indian-owned, Indian-made, or primarily serving Indian users.",
      "Listings must include a valid product name, logo, and website URL.",
      "Descriptions must be truthful, accurate, and not misleading.",
      "Each listing must represent a single, identifiable product or service.",
      "Submissions are reviewed before going live — expect a short review period.",
    ],
  },
  {
    icon: Shield,
    title: "Content standards",
    items: [
      "All content must comply with Indian law and regulations.",
      "No hate speech, discrimination, or content that promotes violence.",
      "No sexually explicit, graphic, or disturbing imagery or language.",
      "No misleading claims, false advertising, or deceptive practices.",
      "Content must be in English or Hindi at this time.",
    ],
  },
  {
    icon: Ban,
    title: "Prohibited content",
    items: [
      "Illegal products or services (drugs, weapons, counterfeit goods).",
      "Products that violate intellectual property rights of others.",
      "Gambling, betting, or lottery-related products.",
      "Content promoting terrorism, extremism, or illegal activities.",
      "Adult content, escort services, or sexually explicit material.",
    ],
  },
  {
    icon: Gavel,
    title: "Bidding rules and integrity",
    items: [
      "Bids are final once payment is confirmed — no chargebacks.",
      "You may increase your bid at any time by paying the difference.",
      "Bidding to intentionally hurt another product (revenge bidding) is prohibited.",
      "Using bots, scripts, or automated systems to manipulate bids is forbidden.",
      "IndBid reserves the right to audit bid patterns and suspend suspicious accounts.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Enforcement actions",
    items: [
      "Illegal activity: reporting to Indian law enforcement.",
      "BidRank reserves the right to take action at its sole discretion.",
    ],
  },
  {
    icon: MessageSquare,
    title: "Appeal process",
    items: [
      "If your listing is removed, you may appeal within 7 days.",
      "Email hello@bidrank.online with your appeal.",
      "Include the listing URL, removal reason, and your case.",
      "Appeals are reviewed within 5 business days.",
      "The appeal decision is final.",
    ],
  },
];

export default function RulesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider mb-3">
            Guidelines
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#101114] leading-[1.1] mb-4">
            Platform rules
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            IndBid is a professional leaderboard. These rules keep it fair,
            trustworthy, and safe for everyone.
          </p>
        </div>
      </section>

      {/* Rules Sections */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-8">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-[#E6E4DF] p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF8A00]/10">
                    <section.icon className="h-5 w-5 text-[#FF8A00]" />
                  </div>
                  <h2 className="text-lg font-bold text-[#101114]">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed"
                    >
                      <CheckCircle className="h-4 w-4 text-[#138A4B] mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-16 sm:py-20 bg-[#F8F7F3] border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#101114] text-center mb-8">
            Quick summary
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-xl border border-[#138A4B]/30 bg-[#138A4B]/5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-[#138A4B]" />
                <h3 className="text-sm font-semibold text-[#138A4B]">
                  Do
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li>• Be truthful in your listings</li>
                <li>• Follow Indian law</li>
                <li>• Bid fairly and transparently</li>
                <li>• Report violations</li>
                <li>• Respect other users</li>
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-red-200 bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-semibold text-red-500">
                  Don&apos;t
                </h3>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li>• Submit false or misleading content</li>
                <li>• Use bots or scripts</li>
                <li>• Bid to harm competitors</li>
                <li>• Share prohibited content</li>
                <li>• Attempt to game the system</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#101114] mb-3">
            Questions about the rules?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Reach out to us at{" "}
            <a
              href="mailto:hello@bidrank.online"
              className="text-[#245BFF] hover:underline"
            >
              hello@bidrank.online
            </a>{" "}
            for any clarifications.
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
            professional before use in production.
          </p>
        </div>
      </section>
    </>
  );
}
