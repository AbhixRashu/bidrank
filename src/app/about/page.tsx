import type { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  Users,
  Target,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "About BidRank — Live attention leaderboard. Helping products get discovered through fair, transparent competition.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider mb-3">
            About BidRank
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#101114] leading-[1.1] mb-4">
            India&apos;s live attention leaderboard
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            We&apos;re building a fair, transparent way for Indian products to
            compete for attention — and get discovered by the people who matter.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#101114] mb-3">
              Our mission
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              Every day, thousands of great Indian products struggle to get
              noticed. BidRank changes that. We create a level playing field
              where visibility is earned through commitment, not connections.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center p-6 rounded-2xl border border-[#E6E4DF]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF8A00]/10 mx-auto mb-4">
                <Trophy className="h-6 w-6 text-[#FF8A00]" />
              </div>
              <h3 className="text-sm font-semibold text-[#101114] mb-2">
                Fair competition
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                No favoritism. No backroom deals. The leaderboard is public,
                and rankings are determined purely by verified bids.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl border border-[#E6E4DF]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#245BFF]/10 mx-auto mb-4">
                <Users className="h-6 w-6 text-[#245BFF]" />
              </div>
              <h3 className="text-sm font-semibold text-[#101114] mb-2">
                Built for India
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                INR payments, Indian products, and a focus on the Indian market.
                We understand the unique challenges of building here.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl border border-[#E6E4DF]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#138A4B]/10 mx-auto mb-4">
                <Target className="h-6 w-6 text-[#138A4B]" />
              </div>
              <h3 className="text-sm font-semibold text-[#101114] mb-2">
                Real visibility
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                A higher rank means more eyes on your product. From customers
                to investors — the right people will see you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How the leaderboard creates fair competition */}
      <section className="py-16 sm:py-20 bg-[#F8F7F3] border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#101114] text-center mb-8">
            How the leaderboard works
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#E6E4DF]">
              <span className="text-lg font-bold text-[#FF8A00] shrink-0">
                01
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#101114] mb-1">
                  Public and transparent
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The leaderboard is visible to everyone. There are no hidden
                  rankings, no secret algorithms. What you see is exactly what
                  determines position.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#E6E4DF]">
              <span className="text-lg font-bold text-[#FF8A00] shrink-0">
                02
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#101114] mb-1">
                  Bids are verified
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Every bid is confirmed server-side after payment. No fake
                  bids, no inflated numbers. Only real, verified commitments
                  count.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#E6E4DF]">
              <span className="text-lg font-bold text-[#FF8A00] shrink-0">
                03
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#101114] mb-1">
                  Real-time updates
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Rankings update the moment a payment is confirmed. No waiting
                  periods, no manual processing. Instant and fair.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#E6E4DF]">
              <span className="text-lg font-bold text-[#FF8A00] shrink-0">
                04
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#101114] mb-1">
                  Commitment, not gambling
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  IndBid is not an auction or lottery. Your bid secures your
                  rank. There is no luck involved — just a straightforward
                  commitment to being seen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#101114] mb-3">
            Our team
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mb-8">
            BidRank is built by a small team passionate about helping Indian
            products compete on a global stage.
          </p>

          <div className="p-8 rounded-2xl border border-dashed border-[#E6E4DF] bg-[#F8F7F3]">
            <p className="text-sm text-gray-400 italic">
              Team profiles coming soon. We&apos;re a small, focused team building
              something we believe in.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-20 bg-[#F8F7F3] border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#101114] mb-3">
            Get in touch
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Have questions, suggestions, or want to partner? We&apos;d love to
            hear from you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@bidrank.online"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#E6E4DF] text-sm font-medium text-[#101114] hover:border-[#FF8A00]/30 transition-colors"
            >
              <Mail className="h-4 w-4 text-[#FF8A00]" />
              hello@bidrank.online
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 text-[#245BFF]" />
              India
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E6E4DF]">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#101114] mb-3">
            Join the leaderboard
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Get your product discovered by thousands of visitors.
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
