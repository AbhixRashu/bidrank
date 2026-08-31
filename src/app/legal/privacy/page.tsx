import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "BidRank Privacy Policy — how we collect, use, share, and protect your personal information.",
};

export default function PrivacyPage() {
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
            Privacy Policy
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
              <strong>Disclaimer:</strong> This is a template Privacy Policy
              document. It must be reviewed and customized by a qualified legal
              professional before use in production.
            </p>
          </div>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            1. Introduction
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            BidRank Technologies Pvt. Ltd. (&quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;) is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use the BidRank platform.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            2. Data we collect
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We may collect the following categories of information:
          </p>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
            <li><strong>Account information:</strong> Name, email address, phone number, and password when you create an account.</li>
            <li><strong>Listing information:</strong> Product name, description, logo, website URL, and category when you submit a listing.</li>
            <li><strong>Payment information:</strong> Transaction details processed through our payment partners. We do not store full card numbers.</li>
            <li><strong>Usage data:</strong> Pages visited, actions taken, and interaction patterns on the platform.</li>
            <li><strong>Device information:</strong> Browser type, operating system, IP address, and device identifiers.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            3. How we use your data
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We use collected information to:
          </p>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
            <li>Provide, maintain, and improve the BidRank platform.</li>
            <li>Process payments and manage your bids and rankings.</li>
            <li>Send you transactional emails (payment confirmations, listing updates).</li>
            <li>Communicate platform updates, new features, and promotional content (with your consent where required).</li>
            <li>Detect and prevent fraud, abuse, and security incidents.</li>
            <li>Comply with legal obligations under Indian law.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            4. Sharing your data
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
            <li><strong>Payment processors:</strong> To handle INR transactions securely.</li>
            <li><strong>Service providers:</strong> Hosting, analytics, and email delivery services that help us operate the platform.</li>
            <li><strong>Legal authorities:</strong> When required by law or to protect our rights and safety.</li>
            <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            5. Cookies
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We use cookies and similar technologies to:
          </p>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
            <li>Keep you logged in and maintain your session.</li>
            <li>Remember your preferences and settings.</li>
            <li>Analyze platform usage and performance.</li>
            <li>Deliver relevant content and measure marketing effectiveness.</li>
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed">
            You can manage cookie preferences through your browser settings.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            6. Data retention
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We retain your personal data for as long as your account is active
            or as needed to provide services. We may retain certain information
            as required by law or for legitimate business purposes, such as
            fraud prevention and record-keeping.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            7. Your rights
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Under Indian data protection laws, you have the right to:
          </p>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data (subject to legal retention requirements).</li>
            <li>Object to processing of your data for marketing purposes.</li>
            <li>Withdraw consent at any time.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            8. Data security
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We implement industry-standard security measures to protect your
            data, including encryption in transit and at rest, access controls,
            and regular security audits. However, no method of transmission or
            storage is 100% secure.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            9. Children&apos;s privacy
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            BidRank is not intended for children under 18. We do not knowingly
            collect personal information from children. If you believe we have
            collected data from a child, please contact us immediately.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            10. Changes to this policy
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. We will
            notify you of any material changes by posting the updated policy
            on this page with a revised &quot;Last updated&quot; date.
          </p>

          <h2 className="text-lg font-bold text-[#101114] mt-8 mb-3">
            11. Contact
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            For privacy-related inquiries, contact our Data Protection Officer
            at{" "}
            <a
              href="mailto:privacy@bidrank.online"
              className="text-[#245BFF] hover:underline"
            >
              privacy@bidrank.online
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
