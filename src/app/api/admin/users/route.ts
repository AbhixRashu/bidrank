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

    const users = await db?.user.findMany({
      include: {
        _count: { select: { listings: true, bids: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = users?.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      listings: u._count.listings,
      bids: u._count.bids,
      joinedAt: u.createdAt,
    })) ?? [];

    return NextResponse.json({ users: result });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
