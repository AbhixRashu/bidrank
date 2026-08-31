import { Leaderboard } from "@/components/leaderboard/leaderboard";
import { ActivityFeed } from "@/components/leaderboard/activity-feed";
import { HeroSection } from "@/components/hero-section";
import { SocialProofSection } from "@/components/social-proof";
import { DynamicMarquee } from "@/components/dynamic-marquee";
import { FaqSection } from "@/components/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BidRank — Live Product Attention Leaderboard | Discover Indian Startups",
  description:
    "Claim your rank on BidRank live product leaderboard. A higher verified bid takes the spot. Pay in INR via UPI, cards, or net banking.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BidRank — Live Bid-to-Rank Leaderboard for Products",
    description:
      "Claim your rank on BidRank live product leaderboard. A higher verified bid takes the spot.",
    url: "https://bidrank.online",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <DynamicMarquee />
      <Leaderboard />
      <ActivityFeed />
      <SocialProofSection />
      <FaqSection />
    </>
  );
}

