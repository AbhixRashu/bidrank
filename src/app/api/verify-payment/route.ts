import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify, extractDomain } from "@/lib/utils";
import { calculateRankings, generateReceiptNumber } from "@/lib/ranking";
import { eventBus } from "@/lib/realtime/event-bus";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const {
      upi_order_id,      // our internal order ID (was razorpay_order_id)
      upi_txn_id,        // user-provided UPI Reference / UTR / 12-digit number
      listingName,
      listingUrl,
      listingTagline,
      categorySlug,
      bidAmount,
      contactEmail,
    } = body;

    if (!upi_order_id || !upi_txn_id) {
      return NextResponse.json(
        { error: "Missing UPI order ID or transaction reference" },
        { status: 400 }
      );
    }

    if (!listingName || !listingUrl || !categorySlug || !bidAmount) {
      return NextResponse.json(
        { error: "Missing listing details" },
        { status: 400 }
      );
    }

    // Basic UTR validation: 12-digit numeric or alphanumeric (6-22 chars is typical)
    const cleanTxn = String(upi_txn_id).trim();
    if (cleanTxn.length < 6 || cleanTxn.length > 25) {
      return NextResponse.json(
        { error: "Invalid UPI transaction reference. Please enter the correct 12-digit UTR." },
        { status: 400 }
      );
    }

    // Idempotency check: avoid double-processing same order
    const existingBid = await db.bid.findFirst({
      where: { idempotencyKey: `upi_${upi_order_id}` },
      select: {
        id: true,
        listing: { select: { slug: true } },
      },
    });

    if (existingBid) {
      return NextResponse.json({
        status: "verified",
        order_id: upi_order_id,
        payment_id: upi_txn_id,
        bidId: existingBid.id,
        listingSlug: existingBid.listing.slug,
        idempotent: true,
      });
    }

    // Determine user
    let userId = (session?.user as any)?.id as string | undefined;
    const email = session?.user?.email || contactEmail || `bidder_${Date.now()}@indbid.in`;

    if (!userId) {
      const user = await db.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: session?.user?.name || listingName || "Founder",
        },
      });
      userId = user.id;
    }

    const category = await db.category.findUnique({
      where: { slug: categorySlug },
    });
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const slug = slugify(listingName);
    const domain = extractDomain(listingUrl);

    let listing = await db.listing.findUnique({ where: { slug } });

    if (!listing) {
      listing = await db.listing.create({
        data: {
          slug,
          name: listingName,
          url: listingUrl,
          tagline: listingTagline || "",
          description: listingTagline || "",
          domain,
          contactEmail: email,
          status: "approved",
          verifiedAt: new Date(),
          userId,
          categoryId: category.id,
        },
      });
    } else {
      listing = await db.listing.update({
        where: { id: listing.id },
        data: {
          status: "approved",
          verifiedAt: new Date(),
          tagline: listingTagline || listing.tagline,
        },
      });
    }

    // Deactivate previous bids on this listing
    await db.bid.updateMany({
      where: {
        listingId: listing.id,
        status: "activated",
      },
      data: { status: "superseded" },
    });

    const bid = await db.bid.create({
      data: {
        amount: Number(bidAmount),
        status: "activated",
        idempotencyKey: `upi_${upi_order_id}`,
        paymentStatus: "captured",
        paymentVerified: true,
        verifiedAt: new Date(),
        activatedAt: new Date(),
        rankAtActivation: 0,
        paymentOrderId: upi_order_id,
        paymentId: cleanTxn, // store the UTR
        userId,
        listingId: listing.id,
      },
    });

    // Recalculate rankings
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
      const existingRankBid = await db.bid.findFirst({
        where: {
          listingId: ranking.listingId,
          status: "activated",
        },
      });
      if (existingRankBid) {
        await db.bid.update({
          where: { id: existingRankBid.id },
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

    const invoiceCount = await db.invoice.count();
    const invoiceNumber = generateReceiptNumber(invoiceCount + 1);

    await db.invoice.create({
      data: {
        invoiceNumber,
        subtotal: Number(bidAmount),
        gstRate: 0,
        gstAmount: 0,
        totalAmount: Number(bidAmount),
        buyerName: session?.user?.name || listingName || "User",
        paymentRef: cleanTxn,
        status: "paid",
        bidId: bid.id,
        userId,
      },
    });

    await db.auditLog.create({
      data: {
        action: "payment.verified",
        entity: "bid",
        entityId: bid.id,
        meta: JSON.stringify({
          orderId: upi_order_id,
          utrRef: cleanTxn,
          amount: bidAmount,
          listingSlug: slug,
          paymentMethod: "upi_direct",
        }),
        userId,
      },
    });

    // Realtime broadcast
    try {
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

      const bidRank = newRankings.findIndex((r) => r.listing.id === listing!.id) + 1;

      eventBus.broadcast("bid:new", {
        timestamp: new Date().toISOString(),
        data: {
          listingId: listing.id,
          listingSlug: listing.slug,
          listingName: listing.name,
          amount: Number(bidAmount),
          rank: bidRank,
        },
      });

      eventBus.broadcast("leaderboard:update", {
        timestamp: new Date().toISOString(),
        data: { leaderboard: newRankings },
      });
    } catch (broadcastErr) {
      console.warn("Realtime broadcast warning:", broadcastErr);
    }

    return NextResponse.json({
      status: "verified",
      order_id: upi_order_id,
      payment_id: cleanTxn,
      bidId: bid.id,
      listingSlug: slug,
      rank: rankings.find((r) => r.listingId === listing!.id)?.rank,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error?.message || error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
