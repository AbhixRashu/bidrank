import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const listings = await db?.listing.findMany({
      where: { userId },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        bids: {
          where: { status: "activated" },
          orderBy: { amount: "desc" },
          take: 1,
          select: { id: true, amount: true, rankAtActivation: true },
        },
        _count: { select: { clickEvents: true, bids: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = listings.map((l) => ({
      id: l.id,
      slug: l.slug,
      name: l.name,
      tagline: l.tagline,
      domain: l.domain,
      category: l.category.name,
      categorySlug: l.category.slug,
      rank: l.bids[0]?.rankAtActivation ?? 0,
      bid: l.bids[0]?.amount ?? 0,
      status: l.status,
      clicks: l._count.clickEvents,
    }));

    return NextResponse.json({ listings: result });
  } catch (error) {
    console.error("GET /api/dashboard/listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
