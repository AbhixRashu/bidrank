"use client";

import { useState } from "react";
import Link from "next/link";
import { formatINR, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  MousePointerClick,
  TrendingUp,
  Crown,
  Zap,
  ArrowUpRight,
  Eye,
  Swords,
} from "lucide-react";
import type { MockListing } from "@/types/listing";
import { SmoothReveal } from "@/components/smooth-reveal";
import { CrownTimer } from "@/components/crown-timer";
import { QuickOutbidModal } from "@/components/bid/quick-outbid-modal";

interface TopThreePodiumProps {
  listings: MockListing[];
}

function RankBadge({ rank }: { rank: number }) {
  const config = {
    1: {
      bg: "bg-gradient-to-br from-[#FF8A00] via-[#FFB347] to-[#FF8A00]",
      text: "text-white",
      icon: <Crown className="h-5 w-5" />,
      label: "Champion",
      glow: "shadow-[0_0_30px_rgba(255,138,0,0.4)]",
      ring: "ring-[#FF8A00]/30",
    },
    2: {
      bg: "bg-gradient-to-br from-[#245BFF] via-[#6B8AFF] to-[#245BFF]",
      text: "text-white",
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Runner-up",
      glow: "shadow-[0_0_25px_rgba(36,91,255,0.3)]",
      ring: "ring-[#245BFF]/30",
    },
    3: {
      bg: "bg-gradient-to-br from-[#138A4B] via-[#34C77B] to-[#138A4B]",
      text: "text-white",
      icon: <Zap className="h-4 w-4" />,
      label: "Rising",
      glow: "shadow-[0_0_20px_rgba(19,138,75,0.3)]",
      ring: "ring-[#138A4B]/30",
    },
  }[rank] || { bg: "bg-gray-100", text: "text-gray-500", icon: null, label: "", glow: "", ring: "" };

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl ${config.bg} ${config.text} ${config.glow} transition-all duration-300`}
      style={{
        width: rank === 1 ? 72 : 60,
        height: rank === 1 ? 72 : 60,
      }}
    >
      <div className="flex flex-col items-center gap-0.5">
        {config.icon}
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
          #{rank}
        </span>
      </div>
      {rank === 1 && (
        <div className="absolute -top-3 -right-1 animate-float">
          <Crown className="h-6 w-6 text-[#FF8A00] drop-shadow-lg" />
        </div>
      )}
    </div>
  );
}

function TopCard({ listing, rank, index }: { listing: MockListing; rank: number; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [outbidOpen, setOutbidOpen] = useState(false);

  const cardConfig = {
    1: {
      gradient: "from-[#FF8A00]/5 via-[#FF8A00]/10 to-[#FFB347]/5",
      border: "border-[#FF8A00]/20",
      hoverBorder: "hover:border-[#FF8A00]/40",
      accent: "text-[#FF8A00]",
      bgAccent: "bg-[#FF8A00]",
      badge: "saffron" as const,
      label: "Current Champion",
      height: "min-h-[310px]",
    },
    2: {
      gradient: "from-[#245BFF]/5 via-[#245BFF]/10 to-[#6B8AFF]/5",
      border: "border-[#245BFF]/20",
      hoverBorder: "hover:border-[#245BFF]/40",
      accent: "text-[#245BFF]",
      bgAccent: "bg-[#245BFF]",
      badge: "blue" as const,
      label: "Strong Contender",
      height: "min-h-[290px]",
    },
    3: {
      gradient: "from-[#138A4B]/5 via-[#138A4B]/10 to-[#34C77B]/5",
      border: "border-[#138A4B]/20",
      hoverBorder: "hover:border-[#138A4B]/40",
      accent: "text-[#138A4B]",
      bgAccent: "bg-[#138A4B]",
      badge: "green" as const,
      label: "Rising Star",
      height: "min-h-[270px]",
    },
  }[rank]!;

  const increment =
    listing.bidAmount < 1000
      ? 1
      : listing.bidAmount < 10000
        ? 10
        : listing.bidAmount < 100000
          ? 100
          : 1000;

  return (
    <>
      <QuickOutbidModal
        open={outbidOpen}
        onClose={() => setOutbidOpen(false)}
        productName={listing.name}
        currentBid={listing.bidAmount}
        targetSlug={listing.slug}
      />

      <div
        className={`relative group cursor-pointer hover-lift`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
            rank === 1
              ? "bg-gradient-to-r from-[#FF8A00]/20 via-[#FFB347]/20 to-[#FF8A00]/20"
              : rank === 2
                ? "bg-gradient-to-r from-[#245BFF]/15 via-[#6B8AFF]/15 to-[#245BFF]/15"
                : "bg-gradient-to-r from-[#138A4B]/15 via-[#34C77B]/15 to-[#138A4B]/15"
          }`}
        />

        <div
          className={`relative bg-white rounded-2xl border ${cardConfig.border} ${cardConfig.hoverBorder} transition-all duration-300 overflow-hidden ${
            isHovered ? "scale-[1.02] shadow-2xl" : "shadow-lg"
          } ${cardConfig.height} ${rank === 1 && isHovered ? "animate-glow-pulse" : ""}`}
        >
          {rank === 1 && (
            <>
              <div className="sparkle" />
              <div className="sparkle" />
              <div className="sparkle" />
              <div className="sparkle" />
            </>
          )}

          <div
            className={`h-1.5 w-full bg-gradient-to-r ${
              rank === 1
                ? "from-[#FF8A00] via-[#FFB347] to-[#FF8A00]"
                : rank === 2
                  ? "from-[#245BFF] via-[#6B8AFF] to-[#245BFF]"
                  : "from-[#138A4B] via-[#34C77B] to-[#138A4B]"
            }`}
          />

          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <Badge variant={cardConfig.badge} className="text-[10px] px-2 py-0.5">
                {cardConfig.label}
              </Badge>
              <RankBadge rank={rank} />
            </div>

            {rank === 1 && listing.claimedAt && (
              <div className="mb-4">
                <CrownTimer heldSince={listing.claimedAt.toISOString()} variant="expanded" />
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold ${cardConfig.bgAccent} text-white shadow-md transition-transform duration-300 ${
                  isHovered ? "scale-110 rotate-3" : ""
                }`}
              >
                {listing.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/listing/${listing.slug}`}
                    className="text-base font-bold text-[#101114] hover:underline truncate"
                  >
                    {listing.name}
                  </Link>
                  {listing.verified && (
                    <CheckCircle className="h-4 w-4 text-[#138A4B] flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{listing.tagline}</p>
              </div>
            </div>

            <div className={`mb-4 transition-all duration-300 ${isHovered ? "scale-105 origin-left" : ""}`}>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                Current Bid
              </p>
              <p className={`text-3xl font-black ${cardConfig.accent} tracking-tight`}>
                {formatINR(listing.bidAmount)}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span className="font-medium">{listing.clicks.toLocaleString("en-IN")}</span>
                <span>clicks</span>
              </div>
              <div className="flex items-center gap-1">
                <MousePointerClick className="h-3.5 w-3.5" />
                <span>{timeAgo(listing.claimedAt)}</span>
              </div>
              <Badge variant="default" className="text-[9px] px-1.5 ml-auto">
                {listing.category}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOutbidOpen(true)}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white transition-all duration-200 active:scale-95 hover:scale-[1.02] ${
                  rank === 1
                    ? "bg-gradient-to-r from-[#FF8A00] to-[#FFB347] shadow-[0_0_15px_rgba(255,138,0,0.3)]"
                    : rank === 2
                      ? "bg-[#245BFF] hover:bg-[#1d4ae0]"
                      : "bg-[#138A4B] hover:bg-[#0f7340]"
                }`}
              >
                <Swords className="h-3.5 w-3.5" />
                Outbid for {formatINR(listing.bidAmount + increment)}
              </button>
              <Link href={`/listing/${listing.slug}`}>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#138A4B] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#138A4B]" />
              </span>
              <span className="text-[10px] text-gray-400">Live — ranked by verified bid</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function TopThreePodium({ listings }: TopThreePodiumProps) {
  const top3 = listings.slice(0, 3);
  if (top3.length === 0) return null;

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SmoothReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-semibold mb-4 animate-fade-in">
              <Crown className="h-3.5 w-3.5" />
              TOP RANKED
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101114] tracking-tight">
              The podium belongs to the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFB347] to-[#FF8A00]">
                boldest
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              These products claimed the top spots with the highest verified bids.
              Click any card to challenge them.
            </p>
          </div>
        </SmoothReveal>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5 items-end">
          {top3[1] && (
            <SmoothReveal delay={150} className="sm:order-1">
              <TopCard listing={top3[1]} rank={2} index={1} />
            </SmoothReveal>
          )}

          {top3[0] && (
            <SmoothReveal delay={0} className="sm:order-2 sm:-mt-4">
              <TopCard listing={top3[0]} rank={1} index={0} />
            </SmoothReveal>
          )}

          {top3[2] && (
            <SmoothReveal delay={300} className="sm:order-3">
              <TopCard listing={top3[2]} rank={3} index={2} />
            </SmoothReveal>
          )}
        </div>

        <div className="hidden sm:flex items-end justify-center gap-1 mt-0">
          <div className="w-1/3 h-2 bg-[#245BFF]/10 rounded-b-lg" />
          <div className="w-1/3 h-3 bg-[#FF8A00]/10 rounded-b-lg -mb-1" />
          <div className="w-1/3 h-1.5 bg-[#138A4B]/10 rounded-b-lg" />
        </div>
      </div>
    </section>
  );
}
