import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const period = searchParams.get("period") || "all-time";
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "50", 10))
    );
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));

    let periodFilter: { activatedAt?: { gte: Date } } = {};

    if (period === "today") {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      periodFilter = { activatedAt: { gte: startOfDay } };
    } else if (period === "week") {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      startOfWeek.setHours(0, 0, 0, 0);
      periodFilter = { activatedAt: { gte: startOfWeek } };
    }

    const where = {
      status: "approved",
      bids: {
        some: {
          status: "activated",
          ...periodFilter,
        },
      },
      ...(category ? { category: { slug: category } } : {}),
    };

    const listings = await db.listing.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        bids: {
          where: {
            status: "activated",
            ...periodFilter,
          },
          orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
          take: 1,
          select: {
            id: true,
            amount: true,
            activatedAt: true,
            rankAtActivation: true,
          },
        },
        _count: { select: { clickEvents: true } },
      },
      take: (limit + offset) * 3,
    });

    type ListingWithBids = typeof listings[number];

    const ranked = (listings as ListingWithBids[])
      .filter((l) => l.bids.length > 0)
      .sort((a, b) => {
        const aBid = a.bids[0].amount;
        const bBid = b.bids[0].amount;
        if (bBid !== aBid) return bBid - aBid;
        return (
          (a.bids[0].activatedAt?.getTime() ?? 0) -
          (b.bids[0].activatedAt?.getTime() ?? 0)
        );
      })
      .slice(offset, offset + limit)
      .map((l, index) => ({
        rank: offset + index + 1,
        listing: {
          id: l.id,
          slug: l.slug,
          name: l.name,
          tagline: l.tagline,
          logoUrl: l.logoUrl,
          domain: l.domain,
          category: l.category,
        },
        bidAmount: l.bids[0].amount,
        claimedAt: l.bids[0].activatedAt,
        clicks: l._count.clickEvents,
      }));

    const total = (listings as ListingWithBids[]).filter((l) => l.bids.length > 0).length;

    return NextResponse.json({
      leaderboard: ranked,
      total,
      hasMore: offset + limit < total,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/leaderboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
