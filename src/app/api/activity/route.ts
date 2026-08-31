import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const recentBids = await db.bid.findMany({
      where: { status: "activated" },
      orderBy: { activatedAt: "desc" },
      take: 10,
      include: {
        listing: {
          select: { slug: true, name: true, category: { select: { name: true } } },
        },
      },
    });

    const activities = recentBids.map((bid) => ({
      id: bid.id,
      listing: bid.listing.name,
      slug: bid.listing.slug,
      action: "placed bid",
      amount: bid.amount,
      time: bid.activatedAt?.toISOString() || bid.createdAt.toISOString(),
    }));

    const topListing = await db.bid.findFirst({
      where: { status: "activated" },
      orderBy: { amount: "desc" },
      include: {
        listing: {
          select: { name: true, tagline: true, slug: true, category: { select: { name: true } } },
        },
      },
    });

    return NextResponse.json({
      activities,
      topListing: topListing
        ? {
            name: topListing.listing.name,
            tagline: topListing.listing.tagline,
            slug: topListing.listing.slug,
            category: topListing.listing.category.name,
            bidAmount: topListing.amount,
          }
        : null,
    });
  } catch (error) {
    console.error("GET /api/activity error:", error);
    return NextResponse.json({ activities: [], topListing: null });
  }
}
