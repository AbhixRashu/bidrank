import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCategoryBySlug, CATEGORIES } from "@/lib/utils/categories";
import { formatINR, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  MousePointerClick,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.name} Products`,
    description: `Browse the top ${cat.name} products on BidRank. Ranked by verified bid amount.`,
  };
}

interface CategoryListingItem {
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

function CategoryRow({
  listing,
  rank,
}: {
  listing: CategoryListingItem;
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
      className={`flex items-center gap-4 px-4 py-3 sm:px-6 transition-colors hover:bg-[#F8F7F3] ${
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

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${colors[rank % colors.length]}`}
      >
        {listing.name.charAt(0).toUpperCase()}
      </div>

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
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{listing.tagline}</p>
      </div>

      <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <MousePointerClick className="h-3 w-3" />
          <span>{listing.clicks}</span>
        </div>
        <span className="w-16 text-right">{timeAgo(listing.claimedAt)}</span>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm font-bold text-[#101114]">{formatINR(listing.bidAmount)}</p>
        <Link href={`/claim?target=${listing.slug}`} className="hidden sm:block">
          <Button variant="outline" size="sm" className="text-xs whitespace-nowrap">
            Outbid
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const dbListings = await db.listing.findMany({
    where: {
      category: { slug },
      status: "approved",
      bids: { some: { status: "activated" } },
    },
    include: {
      category: true,
      bids: {
        where: { status: "activated" },
        orderBy: { amount: "desc" },
        take: 1,
      },
      _count: { select: { clickEvents: true } },
    },
  });

  const rankings: CategoryListingItem[] = dbListings
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

  return (
    <>
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#101114] transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Categories
          </Link>
          <div className="text-center">
            <Badge variant="saffron" className="mb-3">{cat.name}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101114] mb-3">
              {cat.name} Products
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              {rankings.length} {rankings.length === 1 ? "product" : "products"} ranked
              by verified bid amount.
            </p>
          </div>
        </div>
      </section>

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
              {rankings.map((listing, i) => (
                <CategoryRow key={listing.id} listing={listing} rank={i + 1} />
              ))}
            </div>

            {rankings.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  No listings in this category yet.
                </p>
                <Link href="/claim">
                  <Button variant="saffron">Be the first to list</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
