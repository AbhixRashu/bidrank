"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { UpiQrCode } from "@/components/bid/upi-qr-code";
import {
  Smartphone,
  Loader2,
  AlertCircle,
  CheckCircle,
  Copy,
  Check,
} from "lucide-react";

interface UpiCheckoutButtonProps {
  amountInPaise: number;
  listingName: string;
  listingUrl: string;
  listingTagline: string;
  categorySlug: string;
  contactEmail?: string;
  receipt?: string;
  onSuccess?: (paymentId: string, orderId: string) => void;
  onError?: (error: string) => void;
}

export function CheckoutButton({
  amountInPaise,
  listingName,
  listingUrl,
  listingTagline,
  categorySlug,
  contactEmail,
  receipt,
  onSuccess,
  onError,
}: UpiCheckoutButtonProps) {
  const router = useRouter();
  const [step, setStep] = useState<"init" | "upi" | "verifying" | "done">("init");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState<{
    order_id: string;
    upi_url: string;
    upi_id: string;
    amount_inr: number;
  } | null>(null);
  const [utrInput, setUtrInput] = useState("");
  const [copied, setCopied] = useState(false);

  const createOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          receipt: receipt || `bid_${Date.now()}`,
          note: `BidRank bid for ${listingName}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");
      setOrderData(data);
      setStep("upi");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!utrInput.trim()) {
      setError("Please enter your UPI transaction reference (UTR)");
      return;
    }
    if (!orderData) return;
    setStep("verifying");
    setError("");

    try {
      const verifyRes = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upi_order_id: orderData.order_id,
          upi_txn_id: utrInput.trim(),
          listingName,
          listingUrl,
          listingTagline,
          categorySlug,
          contactEmail,
          bidAmount: amountInPaise / 100,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");

      setStep("done");
      onSuccess?.(utrInput.trim(), orderData.order_id);

      setTimeout(() => {
        router.push(
          `/claim/success?paymentId=${encodeURIComponent(utrInput.trim())}&orderId=${encodeURIComponent(orderData.order_id)}`
        );
      }, 1500);
    } catch (err: any) {
      setStep("upi");
      setError(err.message || "Verification failed");
      onError?.(err.message);
    }
  };

  const copyUpiId = () => {
    if (orderData?.upi_id) {
      navigator.clipboard.writeText(orderData.upi_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ---- DONE state ----
  if (step === "done") {
    return (
      <div className="flex items-center justify-center gap-2 py-3 text-[#138A4B]">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-semibold">Payment verified! Activating bid…</span>
      </div>
    );
  }

  // ---- INIT state: single Pay button ----
  if (step === "init") {
    return (
      <div>
        <Button
          variant="saffron"
          size="lg"
          className="w-full"
          onClick={createOrder}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating UPI…
            </>
          ) : (
            <>
              <Smartphone className="h-4 w-4" />
              Pay {formatINR(amountInPaise / 100)} via UPI
            </>
          )}
        </Button>
        {error && (
          <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Smartphone className="h-3 w-3 text-gray-400" />
          <span className="text-[10px] text-gray-400">
            UPI · GPay · PhonePe · Paytm · BHIM — Direct to bank, 0% fees
          </span>
        </div>
      </div>
    );
  }

  // ---- UPI state: QR + app buttons + UTR input ----
  if (step === "upi" && orderData) {
    const amountINR = orderData.amount_inr;

    // App deep-link params
    const upiParams = new URLSearchParams({
      pa: orderData.upi_id,
      pn: "BidRank",
      am: amountINR.toFixed(2),
      cu: "INR",
      tr: orderData.order_id,
      tn: `BidRank bid ${orderData.order_id}`,
    });

    const gPayUrl = `intent://pay?${upiParams.toString()}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
    const phonePeUrl = `phonepe://pay?${upiParams.toString()}`;
    const paytmUrl = `paytmmp://pay?${upiParams.toString()}`;
    const genericUpiUrl = `upi://pay?${upiParams.toString()}`;

    return (
      <div className="space-y-4">
        {/* Amount pill */}
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] text-sm font-bold border border-[#FF8A00]/20">
            ₹{amountINR.toFixed(2)} to pay
          </span>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-2">
          <UpiQrCode upiUrl={orderData.upi_url} size={180} />
          <p className="text-[11px] text-gray-400">
            Scan with any UPI app
          </p>
        </div>

        {/* UPI ID copy */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F8F7F3] border border-[#E6E4DF]">
          <span className="text-sm text-[#101114] font-mono">{orderData.upi_id}</span>
          <button
            onClick={copyUpiId}
            className="ml-2 flex items-center gap-1 text-xs text-[#245BFF] hover:text-[#1a45d0] transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* --- OR Pay via App --- */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E6E4DF]" />
          <span className="text-[11px] text-gray-400 whitespace-nowrap">or open your UPI app</span>
          <div className="flex-1 h-px bg-[#E6E4DF]" />
        </div>

        {/* App buttons */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={gPayUrl}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-[#E6E4DF] hover:border-[#FF8A00]/40 hover:bg-[#FF8A00]/5 transition-all"
          >
            <span className="text-lg">G</span>
            <span className="text-[10px] text-gray-500 font-medium">GPay</span>
          </a>
          <a
            href={phonePeUrl}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-[#E6E4DF] hover:border-[#5F259F]/40 hover:bg-[#5F259F]/5 transition-all"
          >
            <span className="text-lg">📱</span>
            <span className="text-[10px] text-gray-500 font-medium">PhonePe</span>
          </a>
          <a
            href={paytmUrl}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-[#E6E4DF] hover:border-[#00BAF2]/40 hover:bg-[#00BAF2]/5 transition-all"
          >
            <span className="text-lg">💙</span>
            <span className="text-[10px] text-gray-500 font-medium">Paytm</span>
          </a>
        </div>

        <a
          href={genericUpiUrl}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg border border-[#E6E4DF] text-sm text-[#101114] hover:bg-[#F8F7F3] transition-colors"
        >
          <Smartphone className="h-4 w-4 text-gray-400" />
          Open any UPI App
        </a>

        {/* UTR input */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-[#101114]">
            After paying, enter your UPI Reference No. (UTR)
          </p>
          <p className="text-[11px] text-gray-400">
            Find it in your UPI app under transaction history (12-digit number)
          </p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 640812345678"
            value={utrInput}
            onChange={(e) => {
              setUtrInput(e.target.value);
              if (error) setError("");
            }}
            className="w-full px-3 py-2 rounded-lg border border-[#E6E4DF] bg-white text-sm text-[#101114] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30 focus:border-[#FF8A00] transition-all font-mono"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <Button
          variant="saffron"
          size="lg"
          className="w-full"
          onClick={verifyPayment}
          disabled={!utrInput.trim()}
        >
          <CheckCircle className="h-4 w-4" />
          I've paid — Verify & Activate
        </Button>
      </div>
    );
  }

  // ---- VERIFYING state ----
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <Loader2 className="h-8 w-8 animate-spin text-[#FF8A00]" />
      <p className="text-sm text-gray-500">Verifying your payment…</p>
    </div>
  );
}
