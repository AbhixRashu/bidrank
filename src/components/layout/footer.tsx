import Link from "next/link";

const footerLinks = {
  Platform: [
    { href: "/#leaderboard", label: "Leaderboard" },
    { href: "/today", label: "Today's Ranking" },
    { href: "/categories", label: "Categories" },
    { href: "/claim", label: "Claim a Rank" },
  ],
  Learn: [
    { href: "/how-it-works", label: "How it works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
    { href: "/rules", label: "Platform rules" },
  ],
  Legal: [
    { href: "/legal/terms", label: "Terms of Service" },
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/refunds", label: "Refund Policy" },
    { href: "/legal/cookies", label: "Cookie Policy" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "mailto:hello@indbid.in", label: "Contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#E6E4DF] bg-[#F8F7F3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-1.5 mb-4">
              <span className="text-lg font-bold text-[#FF8A00]">Ind</span>
              <span className="text-lg font-bold text-[#101114]">Bid</span>
            </Link>
            <p className="text-sm text-gray-500 mb-4">
              India&apos;s live leaderboard for products that want to be seen.
            </p>
            <p className="text-xs text-gray-400">Made for Startups 🇮🇳</p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-[#101114] uppercase tracking-wider mb-3">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-[#101114] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#E6E4DF]">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <p className="text-xs text-gray-400 max-w-2xl">
              BidRank provides paid promotional leaderboard placement. Bids do not
              represent investments, prizes, or ownership rights. All amounts in
              INR.
            </p>
            <p className="text-xs text-gray-400 whitespace-nowrap">
              {"\u00A9"} {new Date().getFullYear()} IndBid Technologies Pvt. Ltd.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
