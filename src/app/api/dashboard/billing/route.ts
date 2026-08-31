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

    const invoices = await db?.invoice.findMany({
      where: { userId },
      include: {
        bid: {
          select: {
            amount: true,
            listing: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = invoices.map((inv) => ({
      id: inv.invoiceNumber,
      date: inv.createdAt,
      listing: inv.bid.listing.name,
      amount: inv.totalAmount,
      method: inv.bid.amount > 0 ? "Razorpay" : "N/A",
      status: inv.status,
    }));

    const totalPaid = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const activeListings = await db?.listing.count({
      where: { userId, status: "approved" },
    });

    return NextResponse.json({
      payments: result,
      totalPaid,
      activeListings: activeListings || 0,
    });
  } catch (error) {
    console.error("GET /api/dashboard/billing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
