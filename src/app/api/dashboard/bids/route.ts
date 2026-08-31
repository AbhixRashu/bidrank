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

    const bids = await db?.bid.findMany({
      where: { userId },
      include: {
        listing: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: { select: { name: true, slug: true } },
          },
        },
        invoice: { select: { id: true, invoiceNumber: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = bids.map((b) => ({
      id: b.id,
      date: b.createdAt,
      listing: b.listing.name,
      listingSlug: b.listing.slug,
      category: b.listing.category.name,
      amount: b.amount,
      status: b.status,
      paymentStatus: b.paymentStatus,
      invoiceId: b.invoice?.invoiceNumber ?? null,
      rankAtBid: b.rankAtActivation,
    }));

    const totalSpent = bids
      .filter((b) => b.paymentStatus === "captured")
      .reduce((sum, b) => sum + b.amount, 0);

    const activeCount = bids.filter((b) => b.status === "activated").length;

    return NextResponse.json({
      bids: result,
      totalSpent,
      totalBids: bids.length,
      activeBids: activeCount,
    });
  } catch (error) {
    console.error("GET /api/dashboard/bids error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
