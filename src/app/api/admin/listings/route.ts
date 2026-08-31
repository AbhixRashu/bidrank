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

    const listings = await db?.listing.findMany({
      include: {
        category: { select: { name: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { bids: true, clickEvents: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = listings?.map((l) => ({
      id: l.id,
      name: l.name,
      slug: l.slug,
      url: l.url,
      category: l.category.name,
      categorySlug: l.category.slug,
      status: l.status,
      submittedBy: l.user.name ?? l.user.email,
      submittedAt: l.createdAt,
      clicks: l._count.clickEvents,
      bids: l._count.bids,
    })) ?? [];

    return NextResponse.json({ listings: result });
  } catch (error) {
    console.error("GET /api/admin/listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
