import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, amount, idempotencyKey } = body;

    if (!listingId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check if idempotency key already used
    const existing = await db?.bid.findUnique({
      where: { idempotencyKey },
    });
    if (existing) {
      return NextResponse.json({ error: "Duplicate request" }, { status: 409 });
    }

    // Get current listing bid to validate amount
    const listing = await db?.listing.findUnique({
      where: { id: listingId },
      include: {
        bids: {
          where: { status: "activated" },
          orderBy: { amount: "desc" },
          take: 1,
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const currentBid = listing.bids[0]?.amount || 0;
    const increment =
      currentBid < 1000 ? 1 :
      currentBid < 10000 ? 10 :
      currentBid < 100000 ? 100 : 1000;

    const minimumBid = currentBid + increment;

    if (amount < minimumBid) {
      return NextResponse.json(
        { error: `Minimum bid is ₹${minimumBid.toLocaleString("en-IN")}` },
        { status: 400 }
      );
    }

    // Create pending bid
    const bid = await db?.bid.create({
      data: {
        amount,
        status: "pending",
        idempotencyKey,
        paymentStatus: "pending",
        userId: (session.user as any).id,
        listingId,
      },
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: bid.id,
      notes: {
        bidId: bid.id,
        listingSlug: listing.slug,
        listingName: listing.name,
      },
    });

    // Update bid with order ID
    await db?.bid.update({
      where: { id: bid.id },
      data: { paymentOrderId: order.id },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amount * 100,
      currency: "INR",
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      bidId: bid.id,
      listingName: listing.name,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
