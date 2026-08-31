import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clickTrackingSchema } from "@/lib/validators/schemas";

const BOT_USER_AGENTS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /slurp/i,
  /mediapartners/i,
  /headlesschrome/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = clickTrackingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { listingId, referrer } = parsed.data;

    const listing = await db.listing.findUnique({
      where: { id: listingId },
      select: { id: true, status: true },
    });
    if (!listing || listing.status !== "approved") {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    const userAgent = request.headers.get("user-agent");
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? null;
    const botDetected = isBot(userAgent);

    await db.clickEvent.create({
      data: {
        listingId,
        referrer: referrer ?? null,
        userAgent: userAgent ?? null,
        ip,
        isBot: botDetected,
      },
    });

    return NextResponse.json({ status: "tracked", isBot: botDetected });
  } catch (error) {
    console.error("POST /api/analytics/click error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
