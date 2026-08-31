import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatINR, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle,
  MousePointerClick,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Today's Ranking",
  description:
    "See today's live leaderboard rankings. Resets daily at midnight IST. Claim your spot with a verified bid.",
};

interface TodayListingItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  bidAmount: number;
  claimedAt: Date;
  clicks: number;
  verified: boolean;
}

function TodayRow({
  listing,
  rank,
}: {
  listing: TodayListingItem;
  rank: number;
}) {
  const isTopThree = rank <= 3;
  const rankColors = ["text-[#FF8A00]", "text-[#245BFF]", "text-[#138A4B]"];
  const colors = [
    "bg-[#FF8A00]/10 text-[#FF8A00]",
    "bg-[#245BFF]/10 text-[#245BFF]",
    "bg-[#138A4B]/10 text-[#138A4B]",
    "bg-[#101114]/10 text-[#101114]",
  ];

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 sm:px-6 transition-colors hover:bg-[#F8F7F3] ${
        isTopThree ? "border-l-2" : ""
      } ${rank === 1 ? "border-l-[#FF8A00]" : rank === 2 ? "border-l-[#245BFF]" : rank === 3 ? "border-l-[#138A4B]" : "border-l-transparent"}`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${
          isTopThree ? `${rankColors[rank - 1]} bg-current/5` : "text-gray-400 bg-gray-50"
        }`}
      >
        #{rank}
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            rank === 1
              ? "bg-[#FF8A00] text-white"
              : rank === 2
              ? "bg-gray-400 text-white"
              : rank === 3
              ? "bg-amber-700 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {rank}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/listing/${listing.slug}`}
              className="text-sm font-semibold hover:underline truncate"
            >
              {listing.name}
            </Link>
            {listing.verified && (
              <CheckCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            )}
            {isTopThree && (
              <Badge variant="outline" className="text-[10px] py-0 px-1">
                Top {rank}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{listing.tagline}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
        <span className="w-24 truncate">{listing.category}</span>
        <div className="flex items-center gap-1 w-16">
          <MousePointerClick className="h-3 w-3" />
          <span>{listing.clicks}</span>
        </div>
        <span className="w-16 text-right">{timeAgo(listing.claimedAt)}</span>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm font-bold">{formatINR(listing.bidAmount)}</p>
        <Link href={`/claim?target=${listing.slug}`} className="hidden sm:block">
          <Button variant="outline" size="sm" className="text-xs">
            Outbid
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function TodayPage() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let sorted: TodayListingItem[] = [];
  try {
    const dbListings = await db.listing.findMany({
      where: {
        status: "approved",
        bids: {
          some: {
            status: "activated",
            activatedAt: { gte: startOfDay },
          },
        },
      },
      include: {
        category: true,
        bids: {
          where: { status: "activated", activatedAt: { gte: startOfDay } },
          orderBy: { amount: "desc" },
          take: 1,
        },
        _count: { select: { clickEvents: true } },
      },
    });

    sorted = dbListings
      .filter((l) => l.bids.length > 0)
      .sort((a, b) => b.bids[0].amount - a.bids[0].amount)
      .map((l) => ({
        id: l.id,
        slug: l.slug,
        name: l.name,
        tagline: l.tagline,
        category: l.category.name,
        bidAmount: l.bids[0].amount,
        claimedAt: l.bids[0].activatedAt ?? l.createdAt,
        clicks: l._count.clickEvents,
        verified: !!l.verifiedAt,
      }));
  } catch {
    sorted = [];
  }

  const topListing = sorted[0];

  return (
    <>
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider mb-3">
            Daily Rankings
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#101114] leading-[1.1] mb-4">
            Today&apos;s Ranking
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            The leaderboard resets daily at midnight IST. Rankings reflect
            today&apos;s verified bids and activity.
          </p>
        </div>
      </section>

      {topListing && (
        <section className="py-12 bg-[#F8F7F3] border-b border-[#E6E4DF]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h3 className="text-lg font-bold text-[#101114] mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#FF8A00]" />
              Current Top Ranking
            </h3>
            <div className="rounded-xl border border-[#E6E4DF] bg-white p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF8A00]/10 text-[#FF8A00] text-lg font-bold">
                  #1
                </div>
                <div>
                  <p className="font-semibold text-[#101114]">{topListing.name}</p>
                  <p className="text-xs text-gray-500">{topListing.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{topListing.tagline}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#101114]">
                  {formatINR(topListing.bidAmount)}
                </span>
                <Link
                  href={`/claim?target=${topListing.slug}`}
                  className="text-sm font-medium text-[#245BFF] hover:underline flex items-center gap-1"
                >
                  Try to outbid
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-xl border border-[#E6E4DF] bg-white overflow-hidden">
            <div className="hidden sm:flex items-center gap-4 px-4 sm:px-6 py-2 border-b border-[#E6E4DF] bg-[#F8F7F3] text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              <span className="w-10">Rank</span>
              <span className="w-10" />
              <span className="flex-1">Product</span>
              <span className="w-32 text-right">Stats</span>
              <span className="w-20 text-right">Bid</span>
              <span className="w-28" />
            </div>

            <div className="divide-y divide-[#E6E4DF]">
              {sorted.map((listing, i) => (
                <TodayRow key={listing.id} listing={listing} rank={i + 1} />
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm text-gray-500">No listings yet today.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
