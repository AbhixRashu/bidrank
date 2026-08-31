/**
 * UPI Payment Utilities
 * Generates UPI deep links for Indian UPI apps.
 * The payee name shown in user's app is controlled by `pn` param — we use "BidRank"
 * instead of the real bank-registered name.
 */

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "9928998694@ybl";
const UPI_DISPLAY_NAME = process.env.NEXT_PUBLIC_UPI_NAME || "BidRank"; // What user's app shows

export interface UpiPaymentParams {
  amount: number; // in INR (not paise)
  orderId: string;
  note?: string;
}

/**
 * Builds the standard UPI URL (used for QR code and generic UPI intent)
 * Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR&tn=NOTE&tr=ORDERID
 */
export function buildUpiUrl(params: UpiPaymentParams): string {
  const { amount, orderId, note } = params;
  const searchParams = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_DISPLAY_NAME,
    am: amount.toFixed(2),
    cu: "INR",
    tr: orderId,
    tn: note || `BidRank payment ${orderId}`,
  });
  return `upi://pay?${searchParams.toString()}`;
}

/**
 * Deep link for GPay
 */
export function buildGPayUrl(params: UpiPaymentParams): string {
  const upiUrl = buildUpiUrl(params);
  return `intent://pay?${new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_DISPLAY_NAME,
    am: params.amount.toFixed(2),
    cu: "INR",
    tr: params.orderId,
    tn: params.note || `BidRank payment ${params.orderId}`,
  }).toString()}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
}

/**
 * Deep link for PhonePe
 */
export function buildPhonePeUrl(params: UpiPaymentParams): string {
  const upiUrl = buildUpiUrl(params);
  return `phonepe://pay?${new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_DISPLAY_NAME,
    am: params.amount.toFixed(2),
    cu: "INR",
    tr: params.orderId,
    tn: params.note || `BidRank payment ${params.orderId}`,
  }).toString()}`;
}

/**
 * Deep link for Paytm
 */
export function buildPaytmUrl(params: UpiPaymentParams): string {
  return `paytmmp://pay?${new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_DISPLAY_NAME,
    am: params.amount.toFixed(2),
    cu: "INR",
    tr: params.orderId,
    tn: params.note || `BidRank payment ${params.orderId}`,
  }).toString()}`;
}

/**
 * Generates a unique order ID for UPI transaction tracking
 */
export function generateUpiOrderId(prefix = "BR"): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}
