import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import db from "@/lib/db";
import { calculateRankings, generateReceiptNumber } from "@/lib/ranking";
import { eventBus } from "@/lib/realtime/event-bus";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 400 }
      );
    }

    const expectedSignature = createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid Razorpay webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventId = event.id;

    const existingLog = await db.auditLog.findFirst({
      where: { action: `webhook:${eventId}` },
    });
    if (existingLog) {
      return NextResponse.json({ status: "already_processed" });
    }

    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;

    if (!paymentEntity) {
      return NextResponse.json({ status: "ignored" });
    }

    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    await db.auditLog.create({
      data: {
        action: `webhook:${eventId}`,
        entity: "payment",
        entityId: orderId,
        meta: JSON.stringify({ eventType, paymentId }),
      },
    });

    switch (eventType) {
      case "payment.captured":
        await handlePaymentCaptured(orderId, paymentId, paymentEntity);
        break;
      case "payment.failed":
        await handlePaymentFailed(orderId, paymentId, paymentEntity);
        break;
      case "payment.refunded":
        await handlePaymentRefunded(orderId, paymentId, paymentEntity);
        break;
      default:
        console.log(`Unhandled Razorpay event: ${eventType}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(
  orderId: string,
  paymentId: string,
  entity: Record<string, unknown>
) {
  const bid = await db.bid.findFirst({
    where: { paymentOrderId: orderId },
  });
  if (!bid) {
    console.error(`No bid found for order: ${orderId}`);
    return;
  }

  await db.bid.update({
    where: { id: bid.id },
    data: {
      paymentId,
      paymentStatus: "captured",
      paymentMethod: (entity.method as string) ?? null,
      status: "activated",
      activatedAt: new Date(),
      paymentVerified: true,
      verifiedAt: new Date(),
    },
  });

  const allActivatedBids = await db.bid.findMany({
    where: { status: "activated" },
    select: {
      listingId: true,
      amount: true,
      activatedAt: true,
    },
  });

  const rankings = calculateRankings(allActivatedBids);

  for (const ranking of rankings) {
    const existingBid = await db.bid.findFirst({
      where: {
        listingId: ranking.listingId,
        status: "activated",
      },
    });
    if (existingBid) {
      await db.bid.update({
        where: { id: existingBid.id },
        data: { rankAtActivation: ranking.rank },
      });
    }
  }

  await db.rankSnapshot.deleteMany({ where: { period: "all-time" } });
  for (const ranking of rankings) {
    await db.rankSnapshot.create({
      data: {
        rank: ranking.rank,
        bidAmount: ranking.amount,
        period: "all-time",
        listingId: ranking.listingId,
      },
    });
  }

  const bidCount = await db.invoice.count();
  const receiptNumber = generateReceiptNumber(bidCount + 1);

  const buyer = await db.user.findUnique({ where: { id: bid.userId } });

  await db.invoice.create({
    data: {
      invoiceNumber: receiptNumber,
      subtotal: bid.amount,
      gstRate: 0,
      gstAmount: 0,
      totalAmount: bid.amount,
      buyerName: buyer?.name ?? null,
      paymentRef: paymentId,
      status: "paid",
      bidId: bid.id,
      userId: bid.userId,
    },
  });

  await db.bid.update({
    where: { id: bid.id },
    data: { invoiceGenerated: true },
  });

  await db.notification.create({
    data: {
      type: "payment_captured",
      title: "Payment Successful",
      body: `Your bid of ₹${bid.amount.toLocaleString("en-IN")} has been confirmed. You are now ranked!`,
      channel: "in-app",
      userId: bid.userId,
    },
  });

  const listing = await db.listing.findUnique({ where: { id: bid.listingId } });

  const updatedListings = await db.listing.findMany({
    where: { status: "approved", bids: { some: { status: "activated" } } },
    include: {
      category: { select: { id: true, name: true, slug: true, icon: true } },
      bids: {
        where: { status: "activated" },
        orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
        take: 1,
        select: { id: true, amount: true, activatedAt: true },
      },
      _count: { select: { clickEvents: true } },
    },
  });

  const newRankings = updatedListings
    .filter((l) => l.bids.length > 0)
    .sort((a, b) => {
      const aBid = a.bids[0].amount;
      const bBid = b.bids[0].amount;
      if (bBid !== aBid) return bBid - aBid;
      return (
        (a.bids[0].activatedAt?.getTime() ?? 0) -
        (b.bids[0].activatedAt?.getTime() ?? 0)
      );
    })
    .map((l, index) => ({
      rank: index + 1,
      listing: {
        id: l.id,
        slug: l.slug,
        name: l.name,
        tagline: l.tagline,
        logoUrl: l.logoUrl,
        domain: l.domain,
        category: l.category,
      },
      bidAmount: l.bids[0].amount,
      claimedAt: l.bids[0].activatedAt?.toISOString() ?? null,
      clicks: l._count.clickEvents,
    }));

  const bidRank = newRankings.findIndex((r) => r.listing.id === bid.listingId) + 1;
  const previousBid = await db.bid.findFirst({
    where: {
      listingId: bid.listingId,
      status: "activated",
      id: { not: bid.id },
    },
    orderBy: { amount: "desc" },
  });

  eventBus.broadcast("bid:new", {
    timestamp: new Date().toISOString(),
    data: {
      listingId: bid.listingId,
      listingSlug: listing?.slug,
      listingName: listing?.name,
      amount: bid.amount,
      rank: bidRank,
    },
  });

  if (previousBid && bid.amount > previousBid.amount) {
    eventBus.broadcast("bid:outbid", {
      timestamp: new Date().toISOString(),
      data: {
        listingId: bid.listingId,
        listingSlug: listing?.slug,
        listingName: listing?.name,
        amount: bid.amount,
        outbidUserId: previousBid.userId,
      },
    });
  }

  eventBus.broadcast("rank:changed", {
    timestamp: new Date().toISOString(),
    data: {
      listingId: bid.listingId,
      rank: bidRank,
      previousRank: bid.rankAtActivation,
    },
  });

  eventBus.broadcast("leaderboard:update", {
    timestamp: new Date().toISOString(),
    data: {
      leaderboard: newRankings,
    },
  });
}

async function handlePaymentFailed(
  orderId: string,
  paymentId: string,
  entity: Record<string, unknown>
) {
  const bid = await db.bid.findFirst({
    where: { paymentOrderId: orderId },
  });
  if (!bid) return;

  await db.bid.update({
    where: { id: bid.id },
    data: {
      paymentId,
      paymentStatus: "failed",
      paymentMethod: (entity.method as string) ?? null,
    },
  });

  await db.notification.create({
    data: {
      type: "payment_failed",
      title: "Payment Failed",
      body: `Your payment of ₹${bid.amount.toLocaleString("en-IN")} could not be processed. Please try again.`,
      channel: "in-app",
      userId: bid.userId,
    },
  });
}

async function handlePaymentRefunded(
  orderId: string,
  paymentId: string,
  entity: Record<string, unknown>
) {
  const bid = await db.bid.findFirst({
    where: { paymentOrderId: orderId },
  });
  if (!bid) return;

  const refundAmount = Math.round(((entity.amount as number) ?? 0) / 100);

  await db.refund.create({
    data: {
      amount: refundAmount,
      reason: (entity.notes as Record<string, string>)?.reason ?? "Refund processed",
      status: "processed",
      providerRef: paymentId,
      bidId: bid.id,
      userId: bid.userId,
    },
  });

  await db.bid.update({
    where: { id: bid.id },
    data: {
      status: "refunded",
      paymentStatus: "refunded",
    },
  });

  const allActivatedBids = await db.bid.findMany({
    where: { status: "activated" },
    select: { listingId: true, amount: true, activatedAt: true },
  });
  const rankings = calculateRankings(allActivatedBids);

  await db.rankSnapshot.deleteMany({ where: { period: "all-time" } });
  for (const ranking of rankings) {
    await db.rankSnapshot.create({
      data: {
        rank: ranking.rank,
        bidAmount: ranking.amount,
        period: "all-time",
        listingId: ranking.listingId,
      },
    });
  }

  await db.notification.create({
    data: {
      type: "payment_refunded",
      title: "Refund Processed",
      body: `A refund of ₹${refundAmount.toLocaleString("en-IN")} has been processed for your bid.`,
      channel: "in-app",
      userId: bid.userId,
    },
  });
}
