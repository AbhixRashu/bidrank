import { NextRequest, NextResponse } from "next/server";

/**
 * UPI Order Creation
 * Creates a lightweight "order" object containing the UPI payment URL.
 * No external payment gateway needed — zero KYC.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, receipt, note } = body;

    // amount is in PAISE (same as before), convert to INR for UPI
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: "Amount must be at least ₹1 (100 paise)" },
        { status: 400 }
      );
    }

    const amountInINR = amount / 100;
    const orderId = receipt || `BR${Date.now().toString(36).toUpperCase()}`;

    const upiId = process.env.NEXT_PUBLIC_UPI_ID || "9928998694@ybl";
    const upiName = process.env.NEXT_PUBLIC_UPI_NAME || "BidRank";

    const params = new URLSearchParams({
      pa: upiId,
      pn: upiName,
      am: amountInINR.toFixed(2),
      cu: "INR",
      tr: orderId,
      tn: note || `BidRank bid ${orderId}`,
    });

    const upiUrl = `upi://pay?${params.toString()}`;

    return NextResponse.json({
      order_id: orderId,
      amount, // in paise (unchanged so frontend stays compatible)
      currency: "INR",
      upi_url: upiUrl,
      upi_id: upiId,
      upi_name: upiName,
      amount_inr: amountInINR,
    });
  } catch (error: any) {
    console.error("UPI create-order error:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
