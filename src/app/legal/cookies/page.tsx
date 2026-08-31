import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "IndBid Cookie Policy — types of cookies we use, how to manage them, and third-party services.",
};

export default function CookiesPage() {
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
            Cookie Policy
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
              <strong>Disclaimer:</strong> This is a template Cookie Policy
              document. It must be reviewed and customized by a qualified legal
              professional before use in production.
            </p>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            This Cookie Policy explains how IndBid Technologies Pvt. Ltd.
            (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies
            and similar technologies when you visit the IndBid platform.
          </p>

          {/* Essential Cookies */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              1. Essential cookies
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              These cookies are strictly necessary for the platform to function.
              They cannot be disabled.
            </p>

            <div className="rounded-xl border border-[#E6E4DF] overflow-hidden">
              <div className="grid grid-cols-3 bg-[#F8F7F3] border-b border-[#E6E4DF]">
                <div className="px-4 py-2.5 text-xs font-semibold text-[#101114] uppercase tracking-wider">
                  Cookie
                </div>
                <div className="px-4 py-2.5 text-xs font-semibold text-[#101114] uppercase tracking-wider">
                  Purpose
                </div>
                <div className="px-4 py-2.5 text-xs font-semibold text-[#101114] uppercase tracking-wider">
                  Duration
                </div>
              </div>
              <div className="grid grid-cols-3 border-b border-[#E6E4DF]">
                <div className="px-4 py-3 text-sm font-medium text-[#101114]">
                  session
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  Maintains your login session
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  Session
                </div>
              </div>
              <div className="grid grid-cols-3 border-b border-[#E6E4DF]">
                <div className="px-4 py-3 text-sm font-medium text-[#101114]">
                  csrf
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  Prevents cross-site request forgery
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  Session
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="px-4 py-3 text-sm font-medium text-[#101114]">
                  preferences
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  Stores your settings and preferences
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  1 year
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              2. Analytics cookies
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              These cookies help us understand how visitors interact with the
              platform, allowing us to improve the user experience.
            </p>

            <div className="rounded-xl border border-[#E6E4DF] overflow-hidden">
              <div className="grid grid-cols-3 bg-[#F8F7F3] border-b border-[#E6E4DF]">
                <div className="px-4 py-2.5 text-xs font-semibold text-[#101114] uppercase tracking-wider">
                  Cookie
                </div>
                <div className="px-4 py-2.5 text-xs font-semibold text-[#101114] uppercase tracking-wider">
                  Purpose
                </div>
                <div className="px-4 py-2.5 text-xs font-semibold text-[#101114] uppercase tracking-wider">
                  Duration
                </div>
              </div>
              <div className="grid grid-cols-3 border-b border-[#E6E4DF]">
                <div className="px-4 py-3 text-sm font-medium text-[#101114]">
                  _ga
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  Google Analytics — distinguishes unique users
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  2 years
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="px-4 py-3 text-sm font-medium text-[#101114]">
                  _gid
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  Google Analytics — distinguishes unique users
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">
                  24 hours
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              3. Marketing cookies
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              These cookies are used to deliver relevant advertisements and
              track campaign performance. They are only set with your consent.
            </p>

            <div className="p-5 rounded-xl border border-[#E6E4DF] bg-[#F8F7F3]">
              <p className="text-sm text-gray-500 leading-relaxed m-0">
                IndBid currently does not use marketing cookies. If this
                changes, we will update this policy and request your consent
                before setting any marketing cookies.
              </p>
            </div>
          </div>

          {/* How to manage */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              4. How to manage cookies
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              You can control and manage cookies through your browser settings:
            </p>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
              <li>
                <strong className="text-[#101114]">Block all cookies:</strong>{" "}
                Most browsers allow you to block all cookies. This may cause
                some features of the platform to stop working.
              </li>
              <li>
                <strong className="text-[#101114]">Delete cookies:</strong> You
                can delete cookies that have already been set through your
                browser settings.
              </li>
              <li>
                <strong className="text-[#101114]">Third-party opt-out:</strong>{" "}
                You can opt out of Google Analytics by installing the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#245BFF] hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </li>
            </ul>
          </div>

          {/* Third parties */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              5. Third-party services
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              We use the following third-party services that may set cookies:
            </p>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-2">
              <li>
                <strong className="text-[#101114]">Google Analytics:</strong>{" "}
                For platform usage analytics. Google&apos;s privacy policy:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#245BFF] hover:underline"
                >
                  https://policies.google.com/privacy
                </a>
              </li>
              <li>
                <strong className="text-[#101114]">Razorpay:</strong> For payment
                processing. Razorpay&apos;s privacy policy:{" "}
                <a
                  href="https://razorpay.com/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#245BFF] hover:underline"
                >
                  https://razorpay.com/privacy/
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-bold text-[#101114] mb-4">
              6. Contact
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you have any questions about our use of cookies, please
              contact us at{" "}
              <a
                href="mailto:privacy@bidrank.online"
                className="text-[#245BFF] hover:underline"
              >
                privacy@bidrank.online
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
