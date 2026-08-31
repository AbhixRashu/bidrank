import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "indbid.salarypitcher.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/submit", destination: "/claim", permanent: true },
      { source: "/top", destination: "/leaderboard", permanent: true },
      { source: "/rankings", destination: "/leaderboard", permanent: true },
      { source: "/terms", destination: "/legal/terms", permanent: true },
      { source: "/privacy", destination: "/legal/privacy", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
