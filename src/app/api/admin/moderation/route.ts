import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { listingId, action, reason } = body;

    if (!listingId || !action) {
      return NextResponse.json({ error: "listingId and action required" }, { status: 400 });
    }

    if (action === "approve") {
      await db?.listing.update({
        where: { id: listingId },
        data: { status: "approved", verifiedAt: new Date() },
      });
    } else if (action === "reject") {
      await db?.listing.update({
        where: { id: listingId },
        data: { status: "rejected", rejectionReason: reason || null },
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/moderation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
