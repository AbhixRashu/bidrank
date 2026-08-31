import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const bids = await db?.bid.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        listing: { select: { id: true, slug: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = bids?.map((b) => ({
      id: b.id,
      user: b.user.name ?? "Unknown",
      email: b.user.email,
      listing: b.listing.name,
      listingSlug: b.listing.slug,
      amount: b.amount,
      paymentStatus: b.paymentStatus === "captured" ? "confirmed" : b.paymentStatus,
      status: b.status,
      date: b.createdAt,
    })) ?? [];

    const totalRevenue = bids?.filter((b) => b.paymentStatus === "captured").reduce((sum, b) => sum + b.amount, 0) ?? 0;
    const totalPending = bids?.filter((b) => b.paymentStatus === "pending").reduce((sum, b) => sum + b.amount, 0) ?? 0;
    const totalRefunded = bids?.filter((b) => b.paymentStatus === "refunded").reduce((sum, b) => sum + b.amount, 0) ?? 0;

    return NextResponse.json({ bids: result, totalRevenue, totalPending, totalRefunded });
  } catch (error) {
    console.error("GET /api/admin/bids error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
