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

    const [
      totalUsers,
      totalListings,
      pendingListings,
      totalBids,
      activeBids,
      paymentStats,
      refundStats,
    ] = await Promise.all([
      db?.user.count(),
      db?.listing.count(),
      db?.listing.count({ where: { status: "pending" } }),
      db?.bid.count(),
      db?.bid.count({ where: { status: "activated" } }),
      db?.bid.aggregate({
        where: { paymentStatus: "paid" },
        _sum: { amount: true },
      }),
      db?.refund.aggregate({
        where: { status: "processed" },
        _sum: { amount: true },
      }),
    ]);

    const totalRevenue = paymentStats?._sum.amount ?? 0;
    const totalRefunds = refundStats?._sum.amount ?? 0;

    const recentActivity = await db?.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Revenue by day for last 7 days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const revenueByDay: Array<{ day: string; amount: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const dayRevenue = await db?.bid.aggregate({
        where: {
          paymentStatus: "paid",
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
        _sum: { amount: true },
      });

      revenueByDay.push({
        day: days[new Date(startOfDay).getDay()],
        amount: dayRevenue?._sum.amount ?? 0,
      });
    }

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalListings: totalListings || 0,
        pendingListings: pendingListings || 0,
        totalBids: totalBids || 0,
        activeBids: activeBids || 0,
        totalRevenue,
        totalRefunds,
        paymentSuccessRate: totalBids && totalBids > 0
          ? Math.round(((totalBids - (await db?.bid.count({ where: { paymentStatus: "failed" } }) ?? 0)) / totalBids) * 100)
          : 100,
      },
      revenueByDay,
      recentActivity: recentActivity?.map((a) => ({
        id: a.id,
        action: a.action,
        entity: a.entity,
        entityId: a.entityId,
        meta: a.meta ? JSON.parse(a.meta) : null,
        time: a.createdAt,
      })) ?? [],
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
