import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BidRank — Live Product Attention Leaderboard",
    short_name: "BidRank",
    description:
      "Claim your rank on India's live product leaderboard. Pay in INR to outrank competitors and get discovered by thousands of customers & investors.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF8A00",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
