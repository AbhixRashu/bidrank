import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "BidRank Refund Policy — when refunds are available, exceptions, and how to request one.",
};

export default function RefundsPage() {
  return (
    <>
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#245BFF] hover:underline mb-6"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101114] mb-2">
            Refund Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: August 2026
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="p-4 rounded-xl bg-[#FF8A00]/5 border border-[#FF8A00]/20 mb-8">
            <p className="text-xs text-gray-600 leading-relaxed m-0">
              <strong>Disclaimer:</strong> This is a template Refund Policy
              document. It must be reviewed and customized by a qualified legal
              professional before use in production.
            </p>
          </div>

          {/* General Rule */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              General rule
            </h2>
            <div className="p-5 rounded-xl border border-[#E6E4DF] bg-[#F8F7F3]">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-[#101114] mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong className="text-[#101114]">
                    All completed bid placements are non-refundable.
                  </strong>{" "}
                  Once your payment is confirmed and your rank is activated on
                  the leaderboard, the bid amount cannot be refunded. This is
                  because your bid directly secures a specific position on a
                  live, public leaderboard.
                </p>
              </div>
            </div>
          </div>

          {/* Exceptions */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              Exceptions
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Refunds may be issued in the following circumstances:
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-[#138A4B]/30 bg-[#138A4B]/5">
                <CheckCircle className="h-5 w-5 text-[#138A4B] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#101114] mb-1">
                    Platform error
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    If a technical error on our platform caused your payment to
                    fail or your listing not to activate, we will issue a full
                    refund.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-[#138A4B]/30 bg-[#138A4B]/5">
                <CheckCircle className="h-5 w-5 text-[#138A4B] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#101114] mb-1">
                    Duplicate charge
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    If you were charged twice for the same bid, we will refund
                    the duplicate charge immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-[#138A4B]/30 bg-[#138A4B]/5">
                <CheckCircle className="h-5 w-5 text-[#138A4B] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#101114] mb-1">
                    Moderation rejection
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    If your listing is rejected during our review process after
                    payment was made, we will issue a full refund. Bids are
                    only activated after listing approval.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-[#138A4B]/30 bg-[#138A4B]/5">
                <CheckCircle className="h-5 w-5 text-[#138A4B] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-[#101114] mb-1">
                    Unauthorized transaction
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    If you did not authorize the payment, contact us
                    immediately. We will investigate and issue a refund if
                    warranted.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to request */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              How to request a refund
            </h2>
            <ol className="text-sm text-gray-600 leading-relaxed space-y-3">
              <li>
                <strong className="text-[#101114]">Email us</strong> at{" "}
                <a
                  href="mailto:refunds@bidrank.online"
                  className="text-[#245BFF] hover:underline"
                >
                  refunds@bidrank.online
                </a>{" "}
                with the subject line &quot;Refund Request&quot;.
              </li>
              <li>
                <strong className="text-[#101114]">Include:</strong> Your
                account email, transaction ID, reason for the refund, and any
                supporting evidence.
              </li>
              <li>
                <strong className="text-[#101114]">We will review</strong>{" "}
                your request and respond within 5 business days.
              </li>
            </ol>
          </div>

          {/* Timeline */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              Refund timeline
            </h2>
            <div className="p-5 rounded-xl border border-[#E6E4DF]">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#FF8A00] mt-0.5 shrink-0" />
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="mb-2">
                    Once a refund is approved, it will be processed to your
                    original payment method within{" "}
                    <strong className="text-[#101114]">7–10 business days</strong>.
                  </p>
                  <p>
                    The exact timeline depends on your bank or payment provider.
                    If you have not received your refund after 10 business
                    days, please contact us.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              Questions?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Contact us at{" "}
              <a
                href="mailto:refunds@bidrank.online"
                className="text-[#245BFF] hover:underline"
              >
                refunds@bidrank.online
              </a>{" "}
              for any refund-related questions.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
