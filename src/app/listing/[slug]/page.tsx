import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatINR, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ExternalLink,
  MousePointerClick,
  Clock,
  Tag,
  ArrowRight,
} from "lucide-react";

export async function generateStaticParams() {
  const listings = await db.listing.findMany({
    where: { status: "approved" },
    select: { slug: true },
  });
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await db.listing.findUnique({
    where: { slug },
    include: {
      category: true,
      bids: {
        where: { status: "activated" },
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });
  if (!listing) return { title: "Listing Not Found" };

  const allListings = await db.listing.findMany({
    where: { status: "approved", bids: { some: { status: "activated" } } },
    include: {
      bids: {
        where: { status: "activated" },
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });
  const sorted = allListings.sort(
    (a, b) => b.bids[0].amount - a.bids[0].amount
  );
  const rank = sorted.findIndex((l) => l.slug === listing.slug) + 1;

  return {
    title: `${listing.name} — Rank #${rank}`,
    description: listing.description,
    openGraph: {
      title: `${listing.name} — Rank #${rank} on BidRank`,
      description: listing.tagline,
      url: `https://bidrank.online/listing/${listing.slug}`,
      siteName: "BidRank",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${listing.name} — Rank #${rank} on BidRank`,
      description: listing.tagline,
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await db.listing.findUnique({
    where: { slug },
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
  if (!listing) notFound();

  const bidAmount = listing.bids[0]?.amount ?? 0;
  const claimedAt = listing.bids[0]?.activatedAt ?? listing.createdAt;
  const clicks = listing._count.clickEvents;
  const verified = !!listing.verifiedAt;

  const allListings = await db.listing.findMany({
    where: { status: "approved", bids: { some: { status: "activated" } } },
    include: {
      bids: {
        where: { status: "activated" },
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });
  const sorted = allListings.sort(
    (a, b) => b.bids[0].amount - a.bids[0].amount
  );
  const rank = sorted.findIndex((l) => l.slug === listing.slug) + 1;

  const rankBadge =
    rank === 1
      ? "saffron"
      : rank === 2
        ? "blue"
        : rank === 3
          ? "green"
          : "default";

  const colors = [
    "bg-[#FF8A00]/10 text-[#FF8A00]",
    "bg-[#245BFF]/10 text-[#245BFF]",
    "bg-[#138A4B]/10 text-[#138A4B]",
    "bg-[#101114]/10 text-[#101114]",
  ];
  const logoColor = colors[rank % colors.length];

  const increment =
    bidAmount < 1000
      ? 1
      : bidAmount < 10000
        ? 10
        : bidAmount < 100000
          ? 100
          : 1000;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: listing.name,
            description: listing.description,
            url: listing.url,
            category: listing.category.name,
            brand: { "@type": "Brand", name: listing.name },
            offers: {
              "@type": "Offer",
              price: bidAmount,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: Math.max(1, 5 - Math.floor(rank / 3)),
              reviewCount: clicks,
            },
          }),
        }}
      />
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-center gap-4 mb-8">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold ${logoColor}`}
            >
              {listing.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101114]">
                  {listing.name}
                </h1>
                {verified && (
                  <CheckCircle className="h-5 w-5 text-[#138A4B] flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-500">{listing.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant={rankBadge as "default"}>Rank #{rank}</Badge>
            <Badge variant="default">
              <Tag className="h-3 w-3 mr-1" />
              {listing.category.name}
            </Badge>
            <Badge variant="success">{formatINR(bidAmount)} bid</Badge>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#245BFF] hover:underline"
            >
              {listing.domain}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <Link href={`/claim?target=${listing.slug}`}>
            <Button variant="saffron" size="lg" className="w-full sm:w-auto">
              Claim this rank — {formatINR(bidAmount + increment)}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-[11px] text-gray-400 mt-2">
            Minimum amount to outbid the current holder
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-lg font-bold text-[#101114] mb-4">
            About this product
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            {listing.description}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E6E4DF] p-5 hover-lift">
              <div className="flex items-center gap-2 mb-2">
                <MousePointerClick className="h-4 w-4 text-[#FF8A00]" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Clicks
                </span>
              </div>
              <p className="text-2xl font-bold text-[#101114]">
                {clicks.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-xl border border-[#E6E4DF] p-5 hover-lift">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-[#245BFF]" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Claimed
                </span>
              </div>
              <p className="text-2xl font-bold text-[#101114]">
                {timeAgo(claimedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
