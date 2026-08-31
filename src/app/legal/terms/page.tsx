import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "BidRank Terms of Service — governing your use of the platform, including listings, bids, payments, and intellectual property.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: August 2026
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 prose prose-sm prose-gray max-w-none">
          <div className="p-4 rounded-xl bg-[#FF8A00]/5 border border-[#FF8A00]/20 mb-8">
            <p className="text-xs text-gray-600 leading-relaxed m-0">
              <strong>Disclaimer:</strong> This is a template Terms of Service
              document. It must be reviewed and customized by a qualified legal
              professional before use in production.
            </p>
          </div>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            1. Acceptance of terms
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            By accessing or using BidRank (&quot;the Platform&quot;), you agree
            to be bound by these Terms of Service. If you do not agree to these
            terms, you must not use the Platform. These terms constitute a
            legally binding agreement between you and BidRank Technologies Pvt.
            Ltd.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            2. Eligibility
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You must be at least 18 years of age and capable of entering into
            a binding agreement to use BidRank. By using the Platform, you
            represent and warrant that you meet these eligibility requirements.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            3. Account terms
          </h2>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activities that occur under your account.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            4. Listing submission
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            When you submit a listing to BidRank, you represent and warrant
            that:
          </p>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
            <li>You have the right to submit the listing and all information is accurate.</li>
            <li>The listing complies with all applicable Indian laws and regulations.</li>
            <li>The listing does not infringe on the intellectual property rights of any third party.</li>
            <li>All content (text, images, logos) is owned by you or you have proper licensing.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            5. Bidding and payments
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            By placing a bid on BidRank, you agree that:
          </p>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
            <li>Bids are non-refundable once payment is confirmed, except as outlined in our Refund Policy.</li>
            <li>Your bid amount directly determines your rank on the leaderboard.</li>
            <li>You may increase your bid at any time by paying the difference.</li>
            <li>All payments are processed in Indian Rupees (INR) through our payment partners.</li>
            <li>GST is applicable as per Indian tax law.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            6. Intellectual property
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            BidRank and its original content, features, functionality, and
            design are owned by BidRank Technologies Pvt. Ltd. and are
            protected by copyright, trademark, and other intellectual property
            laws. You may not reproduce, distribute, or create derivative works
            without our express written permission.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            7. Limitation of liability
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            To the maximum extent permitted by law, BidRank Technologies Pvt.
            Ltd. shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            Platform. Our total liability shall not exceed the amount you paid
            to us in the twelve months preceding the claim.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            8. Indemnification
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            You agree to indemnify and hold harmless BidRank Technologies Pvt.
            Ltd., its officers, directors, employees, and agents from any
            claims, losses, damages, liabilities, or expenses arising from
            your use of the Platform or violation of these terms.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            9. Termination
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We may terminate or suspend your access to the Platform immediately,
            without prior notice, for conduct that we determine, in our sole
            discretion, violates these terms or is harmful to other users, us,
            or third parties, or for any other reason.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            10. Governing law and jurisdiction
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            These terms shall be governed by and construed in accordance with
            the laws of India. Any disputes arising under these terms shall be
            subject to the exclusive jurisdiction of the courts in India.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            11. Dispute resolution
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Any dispute arising out of or relating to these terms or your use
            of the Platform shall first be attempted to be resolved through
            good faith negotiation. If the dispute cannot be resolved through
            negotiation within 30 days, either party may initiate proceedings
            in the courts of competent jurisdiction in India.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            12. Changes to terms
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes by posting the updated terms
            on this page with a revised &quot;Last updated&quot; date. Your
            continued use of the Platform after such changes constitutes your
            acceptance of the updated terms.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            13. Contact
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            If you have any questions about these Terms of Service, please
            contact us at{" "}
            <a
              href="mailto:hello@bidrank.online"
              className="text-[#245BFF] hover:underline"
            >
              hello@bidrank.online
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
