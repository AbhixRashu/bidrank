import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const listing = await db.listing.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        user: { select: { id: true, name: true } },
        bids: {
          where: { status: "activated" },
          orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
          take: 1,
          select: {
            id: true,
            amount: true,
            activatedAt: true,
            rankAtActivation: true,
          },
        },
        _count: {
          select: { bids: true, clickEvents: true, rankSnapshots: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.status !== "approved" && listing.status !== "featured") {
      return NextResponse.json(
        { error: "Listing not available" },
        { status: 404 }
      );
    }

    const totalListings = await db.listing.count({
      where: { status: "approved" },
    });

    const rank =
      listing.bids[0]?.rankAtActivation ??
      (totalListings > 0 ? totalListings : null);

    const recentBids = await db.bid.findMany({
      where: { listingId: listing.id, status: { not: "rejected" } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });

    return NextResponse.json({
      ...listing,
      currentBid: listing.bids[0] ?? null,
      bids: undefined,
      rank,
      totalListings,
      recentBids,
    });
  } catch (error) {
    console.error("GET /api/listings/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
