"use client";

import { useState } from "react";
import Link from "next/link";
import { formatINR, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle, MousePointerClick, Swords } from "lucide-react";
import type { MockListing } from "@/types/listing";
import { QuickOutbidModal } from "@/components/bid/quick-outbid-modal";

interface LeaderboardRowProps {
  listing: MockListing;
  rank: number;
}

function LogoPlaceholder({ name, rank }: { name: string; rank: number }) {
  const initial = name.charAt(0).toUpperCase();
  const colors = [
    "bg-[#FF8A00]/10 text-[#FF8A00]",
    "bg-[#245BFF]/10 text-[#245BFF]",
    "bg-[#138A4B]/10 text-[#138A4B]",
    "bg-[#101114]/10 text-[#101114]",
  ];
  const colorClass = colors[rank % colors.length];

  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${colorClass}`}
    >
      {initial}
    </div>
  );
}

export function LeaderboardRow({ listing, rank }: LeaderboardRowProps) {
  const [outbidOpen, setOutbidOpen] = useState(false);
  const isTopThree = rank <= 3;
  const rankColors = [
    "text-[#FF8A00]",
    "text-[#245BFF]",
    "text-[#138A4B]",
  ];

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
        className={`group flex items-center gap-4 px-4 py-3 sm:px-6 transition-colors hover:bg-[#F8F7F3] ${
          isTopThree ? "border-l-2" : ""
        } ${rank === 1 ? "border-l-[#FF8A00]" : rank === 2 ? "border-l-[#245BFF]" : rank === 3 ? "border-l-[#138A4B]" : "border-l-transparent"}`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${
            isTopThree
              ? `${rankColors[rank - 1]} bg-current/5`
              : "text-gray-400 bg-gray-50"
          }`}
        >
          #{rank}
        </div>

        <LogoPlaceholder name={listing.name} rank={rank} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/listing/${listing.slug}`}
              className="text-sm font-semibold text-[#101114] hover:text-[#245BFF] transition-colors truncate"
            >
              {listing.name}
            </Link>
            {listing.verified && (
              <CheckCircle className="h-3.5 w-3.5 text-[#138A4B] flex-shrink-0" />
            )}
            <Badge variant="default" className="hidden sm:inline-flex text-[10px] px-1.5">
              {listing.category}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {listing.tagline}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MousePointerClick className="h-3 w-3" />
            <span>{listing.clicks}</span>
          </div>
          <span className="w-16 text-right">{timeAgo(listing.claimedAt)}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-[#101114]">
              {formatINR(listing.bidAmount)}
            </p>
          </div>
          <button
            onClick={() => setOutbidOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF8A00] to-[#FFB347] text-white text-xs font-bold hover:shadow-[0_0_15px_rgba(255,138,0,0.3)] transition-all duration-200 active:scale-95 hover:scale-[1.02] whitespace-nowrap"
          >
            <Swords className="h-3 w-3" />
            Outbid ₹{(listing.bidAmount + increment).toLocaleString("en-IN")}
          </button>
          <button
            onClick={() => setOutbidOpen(true)}
            className="sm:hidden flex items-center justify-center h-8 w-8 rounded-lg bg-[#FF8A00]/10 text-[#FF8A00] transition-all active:scale-90"
            aria-label="Outbid"
          >
            <Swords className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 sm:px-6 py-3 animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-gray-200" />
      <div className="h-10 w-10 rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-60 bg-gray-100 rounded" />
      </div>
      <div className="h-4 w-16 bg-gray-200 rounded" />
      <div className="h-8 w-24 bg-gray-200 rounded" />
    </div>
  );
}
