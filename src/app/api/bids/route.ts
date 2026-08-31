import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createBidSchema } from "@/lib/validators/schemas";
import { validateBidAmount } from "@/lib/ranking";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    );
    const listingId = searchParams.get("listingId");
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    const where: Record<string, unknown> = {};
    if (listingId) where.listingId = listingId;
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [bids, total] = await Promise.all([
      db.bid.findMany({
        where,
        include: {
          listing: {
            select: {
              id: true,
              slug: true,
              name: true,
              tagline: true,
              logoUrl: true,
              domain: true,
              category: { select: { name: true, slug: true } },
            },
          },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.bid.count({ where }),
    ]);

    return NextResponse.json({
      bids,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/bids error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const rlKey = getRateLimitKey(request, "bid");
    const rl = rateLimit(rlKey, 10, 60000);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = createBidSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { listingId, amount, idempotencyKey } = parsed.data;

    const existingBid = await db.bid.findUnique({
      where: { idempotencyKey },
    });
    if (existingBid) {
      return NextResponse.json(
        { error: "Duplicate request", bidId: existingBid.id },
        { status: 409 }
      );
    }

    const listing = await db.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }
    if (listing.status !== "approved") {
      return NextResponse.json(
        { error: "Listing is not active" },
        { status: 400 }
      );
    }

    const topBid = await db.bid.findFirst({
      where: { listingId, status: "activated" },
      orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
    });

    const currentBid = topBid?.amount ?? 0;
    const validation = validateBidAmount(amount, currentBid);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, minimum: validation.minimum },
        { status: 400 }
      );
    }

    const bid = await db.bid.create({
      data: {
        listingId,
        amount,
        idempotencyKey,
        status: "pending",
        paymentStatus: "pending",
        userId: (session.user as any).id,
      },
    });

    const razorpayOrder = await createRazorpayOrder(bid.id, amount);

    await db.bid.update({
      where: { id: bid.id },
      data: { paymentOrderId: razorpayOrder.id },
    });

    return NextResponse.json(
      {
        bidId: bid.id,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: RAZORPAY_KEY_ID,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/bids error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function createRazorpayOrder(bidId: string, amount: number) {
  const auth = Buffer.from(
    `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount * 100,
      currency: "INR",
      receipt: `bid_${bidId}`,
      notes: { bidId },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Razorpay order creation failed: ${err.error?.description}`);
  }

  return response.json();
}
