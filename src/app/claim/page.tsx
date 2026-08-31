"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/utils/categories";
import { getMinimumBidToOutbid, getMinimumIncrement, formatINR } from "@/lib/utils";
import {
  ArrowUp,
  Link as LinkIcon,
  Tag,
  IndianRupee,
  AlertCircle,
  CheckCircle,
  Shield,
  ArrowLeft,
  FileText,
  CreditCard,
} from "lucide-react";
import { CheckoutButton } from "@/components/bid/checkout-button";

function ClaimContent() {
  const searchParams = useSearchParams();
  const targetSlug = searchParams.get("target") || "";
  const presetUrl = searchParams.get("url") || "";
  const presetCategory = searchParams.get("category") || "";
  const presetAmount = searchParams.get("amount") || "";

  const [targetListing, setTargetListing] = useState<{
    name: string;
    category: string;
    categorySlug: string;
    bidAmount: number;
    url: string;
    tagline: string;
  } | null>(null);

  useEffect(() => {
    if (!targetSlug) return;
    fetch(`/api/listings/${targetSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setTargetListing({
            name: data.name,
            category: data.category?.name || "",
            categorySlug: data.category?.slug || "",
            bidAmount: data.currentBid?.amount || 0,
            url: data.url || "",
            tagline: data.tagline || "",
          });
        }
      })
      .catch(() => {});
  }, [targetSlug]);

  const currentBid = targetListing?.bidAmount || 0;
  const minimumIncrement = useMemo(() => getMinimumIncrement(currentBid), [currentBid]);
  const minimumBid = useMemo(() => getMinimumBidToOutbid(currentBid), [currentBid]);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [url, setUrl] = useState(
    presetUrl || ""
  );
  const [category, setCategory] = useState(
    presetCategory || ""
  );
  const [bidAmount, setBidAmount] = useState(
    presetAmount || (currentBid > 0 ? String(minimumBid) : "")
  );
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bidNum = Number(bidAmount) || 0;
  const totalAmount = bidNum;

  const handleStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Enter your product name";
    if (!url) newErrors.url = "Enter your product URL";
    else if (!url.startsWith("https://")) newErrors.url = "URL must start with https://";
    if (!contactEmail) newErrors.contactEmail = "Enter your contact email";
    else if (!contactEmail.includes("@")) newErrors.contactEmail = "Enter a valid email";
    if (!category) newErrors.category = "Select a category";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStep(2);
  };

  const handleStep2 = () => {
    if (!bidAmount || bidNum < minimumBid) {
      setErrors({ bidAmount: `Minimum bid is ${formatINR(minimumBid)}` });
      return;
    }
    setStep(3);
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.slug,
    label: c.name,
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F7F3]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#101114] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to leaderboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101114] mb-2">
            {targetListing ? "Outbid this listing" : "Claim a rank"}
          </h1>
          <p className="text-sm text-gray-500">
            {targetListing
              ? `Current bid: ${formatINR(currentBid)} — minimum to outbid: ${formatINR(minimumBid)}`
              : "Fill in your details to join the leaderboard."}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  step >= s
                    ? "bg-[#FF8A00] text-white"
                    : "bg-[#E6E4DF] text-gray-400"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-0.5 ${step > s ? "bg-[#FF8A00]" : "bg-[#E6E4DF]"}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#E6E4DF] bg-white p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#101114] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#245BFF]" />
                Step 1: Listing details
              </h2>

              {targetListing && (
                <div className="rounded-lg bg-[#F8F7F3] border border-[#E6E4DF] p-4 mb-2">
                  <p className="text-xs text-gray-500 mb-1">Targeting</p>
                  <p className="text-sm font-semibold text-[#101114]">
                    {targetListing.name} — {targetListing.category}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-gray-400" />
                  Product name
                </label>
                <Input
                  placeholder="Your product name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                  error={errors.name}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-gray-400" />
                  Product URL
                </label>
                <Input
                  type="url"
                  placeholder="https://yourproduct.com"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errors.url) setErrors((p) => ({ ...p, url: "" }));
                  }}
                  error={errors.url}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-gray-400" />
                  Your Contact Email
                </label>
                <Input
                  type="email"
                  placeholder="founder@yourproduct.com"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    if (errors.contactEmail) setErrors((p) => ({ ...p, contactEmail: "" }));
                  }}
                  error={errors.contactEmail}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-gray-400" />
                  Tagline (optional)
                </label>
                <Input
                  placeholder="A short description of your product"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-gray-400" />
                  Category
                </label>
                <Select
                  options={categoryOptions}
                  placeholder="Select category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (errors.category) setErrors((p) => ({ ...p, category: "" }));
                  }}
                  error={errors.category}
                />
              </div>

              <Button variant="saffron" className="w-full" onClick={handleStep1}>
                Continue to bid
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#101114] flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-[#FF8A00]" />
                Step 2: Confirm bid amount
              </h2>

              <div className="rounded-lg bg-[#F8F7F3] border border-[#E6E4DF] p-4">
                <p className="text-xs text-gray-500 mb-1">Your listing</p>
                <p className="text-sm font-semibold text-[#101114]">
                  {name} — {CATEGORIES.find((c) => c.slug === category)?.name}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                  Bid amount (INR)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      ₹
                    </span>
                    <Input
                      type="number"
                      min={minimumBid}
                      step={minimumIncrement}
                      placeholder={String(minimumBid)}
                      value={bidAmount}
                      onChange={(e) => {
                        setBidAmount(e.target.value);
                        if (errors.bidAmount) setErrors((p) => ({ ...p, bidAmount: "" }));
                      }}
                      className="pl-7"
                      error={errors.bidAmount}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setBidAmount(String(Number(bidAmount || minimumBid) + minimumIncrement))
                      }
                      className="h-5 w-5 flex items-center justify-center rounded border border-[#E6E4DF] hover:bg-[#F8F7F3] transition-colors"
                      aria-label="Increase bid"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const v = Number(bidAmount || minimumBid) - minimumIncrement;
                        if (v >= minimumBid) setBidAmount(String(v));
                      }}
                      className="h-5 w-5 flex items-center justify-center rounded border border-[#E6E4DF] hover:bg-[#F8F7F3] transition-colors rotate-180"
                      aria-label="Decrease bid"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                {currentBid > 0 && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Minimum to outbid: {formatINR(minimumBid)} (current:{" "}
                    {formatINR(currentBid)} + ₹{minimumIncrement.toLocaleString("en-IN")}{" "}
                    increment)
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="saffron"
                  className="flex-1"
                  onClick={handleStep2}
                  disabled={!bidAmount || bidNum < minimumBid}
                >
                  Review payment
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-[#101114] flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#138A4B]" />
                Step 3: Payment summary
              </h2>

              <div className="rounded-lg bg-[#F8F7F3] border border-[#E6E4DF] p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Listing</span>
                  <span className="font-medium text-[#101114]">{name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-[#101114]">
                    {CATEGORIES.find((c) => c.slug === category)?.name}
                  </span>
                </div>
                <div className="border-t border-[#E6E4DF]" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bid amount</span>
                  <span className="font-medium text-[#101114]">{formatINR(bidNum)}</span>
                </div>
                <div className="border-t border-[#E6E4DF]" />
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-[#101114]">You pay</span>
                  <span className="text-lg font-bold text-[#101114]">
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FF8A00]/5 border border-[#FF8A00]/20">
                <Shield className="h-5 w-5 text-[#FF8A00] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#101114] mb-1">
                    Paid promotional placement
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    This is a paid placement on the leaderboard. It is not a contest,
                    lottery, or investment opportunity. Your bid secures your rank for as
                    long as it remains the highest or among the highest. Ranks may change
                    if other products outbid you.
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#E6E4DF] text-[#FF8A00] focus:ring-[#FF8A00]"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I understand this is a paid promotional placement and agree to IndBid&apos;s{" "}
                  <Link href="/legal/terms" className="text-[#245BFF] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/refunds" className="text-[#245BFF] hover:underline">
                    Refund Policy
                  </Link>
                  .
                </span>
              </label>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Back
                </Button>
                <div className="flex-1">
                  <CheckoutButton
                    amountInPaise={bidNum * 100}
                    listingName={name || "New Listing"}
                    listingUrl={url}
                    listingTagline={tagline}
                    categorySlug={category}
                    contactEmail={contactEmail}
                    receipt={`bid_${name?.replace(/\s+/g, "-").toLowerCase()}_${Date.now()}`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-6">
          Paid promotional placement. Not a contest or investment.
        </p>
      </div>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] bg-[#F8F7F3] flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      }
    >
      <ClaimContent />
    </Suspense>
  );
}
