"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUp, Link as LinkIcon, Tag, IndianRupee, Mail, Smartphone, Shield, Loader2, CheckCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/utils/categories";
import { getMinimumIncrement, getMinimumBidToOutbid, formatINR } from "@/lib/utils";
import { UpiQrCode } from "@/components/bid/upi-qr-code";

interface QuickOutbidModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
  productUrl?: string;
  currentBid: number;
  targetSlug?: string;
  onBidPlaced?: () => void;
}

export function QuickOutbidModal({
  open,
  onClose,
  productName = "",
  productUrl = "",
  currentBid,
  targetSlug,
  onBidPlaced,
}: QuickOutbidModalProps) {
  const [url, setUrl] = useState(productUrl);
  const [name, setName] = useState(productName);
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [upiStep, setUpiStep] = useState<"form" | "upi" | "verifying">("form");
  const [orderData, setOrderData] = useState<{ order_id: string; upi_url: string; upi_id: string; amount_inr: number } | null>(null);
  const [utrInput, setUtrInput] = useState("");
  const [copied, setCopied] = useState(false);

  const minimumIncrement = useMemo(() => getMinimumIncrement(currentBid), [currentBid]);
  const minimumBid = useMemo(() => getMinimumBidToOutbid(currentBid), [currentBid]);

  const displayBid = bidAmount ? Number(bidAmount) : minimumBid;
  const nextBid = displayBid + minimumIncrement;

  const categoryOptions = CATEGORIES.map((c) => ({ value: c.slug, label: c.name }));

  const handleClose = () => {
    setSuccess(false);
    setError("");
    onClose();
  };

  const handlePayment = async () => {
    const newErrors: Record<string, string> = {};
    if (!url) newErrors.url = "Enter product URL";
    if (url && !url.startsWith("https://")) newErrors.url = "URL must start with https://";
    if (!category) newErrors.category = "Select a category";
    if (!bidAmount || Number(bidAmount) < minimumBid) {
      newErrors.bidAmount = `Minimum bid is ${formatINR(minimumBid)}`;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const amountInPaise = Number(bidAmount) * 100;
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          receipt: `bid_${Date.now()}`,
          note: `BidRank bid for ${name || "product"}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      setOrderData(data);
      setUpiStep("upi");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!utrInput.trim()) {
      setError("Please enter your UPI transaction reference (UTR)");
      return;
    }
    if (!orderData) return;
    setUpiStep("verifying");
    setError("");

    try {
      const verifyRes = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upi_order_id: orderData.order_id,
          upi_txn_id: utrInput.trim(),
          listingName: name,
          listingUrl: url,
          listingTagline: "",
          categorySlug: category,
          contactEmail: email,
          bidAmount: Number(bidAmount),
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");

      setSuccess(true);
      onBidPlaced?.();
      setTimeout(handleClose, 2000);
    } catch (err: any) {
      setUpiStep("upi");
      setError(err.message || "Verification failed");
    }
  };

  const copyUpiId = () => {
    if (orderData?.upi_id) {
      navigator.clipboard.writeText(orderData.upi_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#101114]/50 backdrop-blur-md"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E6E4DF] shadow-2xl overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF8A00] via-[#FFB347] to-[#FF8A00]" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#101114] hover:bg-[#F8F7F3] transition-colors z-20"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#138A4B]/10 mb-4">
                    <CheckCircle className="h-8 w-8 text-[#138A4B]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#101114] mb-1">Bid Placed!</h3>
                  <p className="text-sm text-gray-500">You&apos;re now on the leaderboard.</p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF8A00]/10">
                        <Smartphone className="h-4 w-4 text-[#FF8A00]" />
                      </div>
                      <h2 className="text-lg font-bold text-[#101114]">Quick Outbid</h2>
                    </div>
                    {productName && (
                      <p className="text-sm text-gray-500 ml-10">
                        Beat <span className="font-semibold text-[#101114]">{productName}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="px-3 py-2.5 rounded-xl bg-[#F8F7F3] border border-[#E6E4DF]">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Current Bid</p>
                      <p className="text-base font-bold text-[#101114]">{formatINR(currentBid)}</p>
                    </div>
                    <div className="px-3 py-2.5 rounded-xl bg-[#FF8A00]/5 border border-[#FF8A00]/20">
                      <p className="text-[10px] text-[#FF8A00] uppercase tracking-wider font-medium">Your Min. Bid</p>
                      <p className="text-base font-bold text-[#FF8A00]">{formatINR(minimumBid)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#101114] flex items-center gap-1">
                        <span className="text-gray-400">Name</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E6E4DF] bg-white text-sm text-[#101114] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30 focus:border-[#FF8A00] transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#101114] flex items-center gap-1">
                        <LinkIcon className="h-3 w-3 text-gray-400" />
                        Product URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://yourproduct.com"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); if (errors.url) setErrors((p) => ({ ...p, url: "" })); }}
                        error={errors.url}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#101114] flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        Contact Email
                      </label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E6E4DF] bg-white text-sm text-[#101114] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30 focus:border-[#FF8A00] transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#101114] flex items-center gap-1">
                        <Tag className="h-3 w-3 text-gray-400" />
                        Category
                      </label>
                      <Select
                        options={categoryOptions}
                        placeholder="Select category"
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); if (errors.category) setErrors((p) => ({ ...p, category: "" })); }}
                        error={errors.category}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#101114] flex items-center gap-1">
                        <IndianRupee className="h-3 w-3 text-gray-400" />
                        Bid Amount (INR)
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                          <Input
                            type="number"
                            min={minimumBid}
                            step={minimumIncrement}
                            placeholder={String(minimumBid)}
                            value={bidAmount}
                            onChange={(e) => { setBidAmount(e.target.value); if (errors.bidAmount) setErrors((p) => ({ ...p, bidAmount: "" })); }}
                            className="pl-7"
                            error={errors.bidAmount}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => setBidAmount(String(Number(bidAmount || minimumBid) + minimumIncrement))}
                            className="h-5 w-5 flex items-center justify-center rounded border border-[#E6E4DF] hover:bg-[#F8F7F3] transition-colors"
                            aria-label="Increase bid"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newVal = Number(bidAmount || minimumBid) - minimumIncrement;
                              if (newVal >= minimumBid) setBidAmount(String(newVal));
                            }}
                            className="h-5 w-5 flex items-center justify-center rounded border border-[#E6E4DF] hover:bg-[#F8F7F3] transition-colors rotate-180"
                            aria-label="Decrease bid"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {upiStep === "form" && (
                      <>
                        <Button
                          variant="saffron"
                          size="lg"
                          className="w-full mt-2"
                          onClick={handlePayment}
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
                              Pay {formatINR(displayBid)} via UPI
                            </>
                          )}
                        </Button>
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          <Shield className="h-3 w-3 text-gray-400" />
                          <span className="text-[10px] text-gray-400">
                            Direct UPI · GPay · PhonePe · Paytm · 0% fees
                          </span>
                        </div>
                      </>
                    )}

                    {upiStep === "upi" && orderData && (() => {
                      const upiParams = new URLSearchParams({
                        pa: orderData.upi_id,
                        pn: "BidRank",
                        am: orderData.amount_inr.toFixed(2),
                        cu: "INR",
                        tr: orderData.order_id,
                        tn: `BidRank bid ${orderData.order_id}`,
                      });
                      const upiUrl = `upi://pay?${upiParams.toString()}`;
                      return (
                        <div className="space-y-3 pt-1">
                          <div className="flex flex-col items-center gap-1">
                            <UpiQrCode upiUrl={upiUrl} size={160} />
                            <p className="text-[10px] text-gray-400">Scan with any UPI app</p>
                          </div>
                          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#F8F7F3] border border-[#E6E4DF]">
                            <span className="text-xs text-[#101114] font-mono">{orderData.upi_id}</span>
                            <button onClick={copyUpiId} className="flex items-center gap-1 text-[10px] text-[#245BFF] ml-2">
                              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              {copied ? "Copied" : "Copy"}
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            <a href={`intent://pay?${upiParams.toString()}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`} className="flex flex-col items-center gap-0.5 p-2 rounded-lg border border-[#E6E4DF] hover:bg-[#F8F7F3] transition-colors">
                              <span className="text-base">G</span>
                              <span className="text-[9px] text-gray-500">GPay</span>
                            </a>
                            <a href={`phonepe://pay?${upiParams.toString()}`} className="flex flex-col items-center gap-0.5 p-2 rounded-lg border border-[#E6E4DF] hover:bg-[#F8F7F3] transition-colors">
                              <span className="text-base">📱</span>
                              <span className="text-[9px] text-gray-500">PhonePe</span>
                            </a>
                            <a href={`paytmmp://pay?${upiParams.toString()}`} className="flex flex-col items-center gap-0.5 p-2 rounded-lg border border-[#E6E4DF] hover:bg-[#F8F7F3] transition-colors">
                              <span className="text-base">💙</span>
                              <span className="text-[9px] text-gray-500">Paytm</span>
                            </a>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-[#101114]">Enter UPI Reference No. (UTR) after payment</p>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="12-digit UTR number"
                              value={utrInput}
                              onChange={(e) => { setUtrInput(e.target.value); if (error) setError(""); }}
                              className="w-full px-3 py-2 rounded-lg border border-[#E6E4DF] bg-white text-sm font-mono text-[#101114] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30 focus:border-[#FF8A00] transition-all"
                            />
                          </div>
                          <Button variant="saffron" size="lg" className="w-full" onClick={handleVerify} disabled={!utrInput.trim()}>
                            <CheckCircle className="h-4 w-4" />
                            Verify & Activate Bid
                          </Button>
                        </div>
                      );
                    })()}

                    {upiStep === "verifying" && (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <Loader2 className="h-7 w-7 animate-spin text-[#FF8A00]" />
                        <p className="text-sm text-gray-500">Verifying payment…</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
