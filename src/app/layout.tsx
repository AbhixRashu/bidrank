import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers/session-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bidrank.online";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "BidRank — Live Product Attention Leaderboard for Startups",
    template: "%s | BidRank",
  },
  description:
    "Claim your rank on BidRank live product leaderboard. Pay in INR via UPI or cards to outrank competitors and get discovered by thousands of customers and investors.",
  keywords: [
    "BidRank",
    "IndBid",
    "product leaderboard",
    "product discovery India",
    "SaaS ranking",
    "startup discovery platform",
    "live bidding leaderboard",
    "rank your product",
    "INR UPI payments",
    "Indian startups",
    "product hunt alternative India",
  ],
  authors: [{ name: "BidRank" }],
  creator: "BidRank",
  publisher: "BidRank",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "BidRank",
    title: "BidRank — Live Product Attention Leaderboard for Startups",
    description:
      "Claim your rank on BidRank live product leaderboard. Pay in INR via UPI or cards to outrank competitors and get discovered.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BidRank — Live Product Attention Leaderboard for Startups",
    description:
      "Claim your rank on BidRank live product leaderboard. Pay in INR via UPI or cards to outrank competitors.",
  },
  alternates: {
    canonical: APP_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#FF8A00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${APP_URL}/#website`,
        url: APP_URL,
        name: "BidRank",
        description: "Live product leaderboard for startups. Pay in INR to claim your rank.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${APP_URL}/categories?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": `${APP_URL}/#organization`,
        name: "BidRank",
        url: APP_URL,
        logo: `${APP_URL}/favicon.svg`,
        sameAs: [
          "https://twitter.com/bidrank",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@bidrank.online",
          contactType: "customer support",
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white font-sans text-[#101114] antialiased">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
