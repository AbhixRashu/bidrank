"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/utils/categories";
import {
  getMinimumIncrement,
  getMinimumBidToOutbid,
} from "@/lib/utils";
import { formatINR } from "@/lib/utils";
import { ArrowUp, Link as LinkIcon, Tag, IndianRupee, AlertCircle } from "lucide-react";

interface BidFormProps {
  defaultUrl?: string;
  defaultCategory?: string;
  currentBid?: number;
  targetListing?: string;
}

export function BidForm({
  defaultUrl = "",
  defaultCategory = "",
  currentBid = 0,
  targetListing,
}: BidFormProps) {
  const router = useRouter();
  const [url, setUrl] = useState(defaultUrl);
  const [category, setCategory] = useState(defaultCategory);
  const [bidAmount, setBidAmount] = useState(
    currentBid > 0 ? String(getMinimumBidToOutbid(currentBid)) : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const minimumIncrement = useMemo(
    () => getMinimumIncrement(currentBid),
    [currentBid]
  );
  const minimumBid = useMemo(
    () => getMinimumBidToOutbid(currentBid),
    [currentBid]
  );
  const isValidBid = bidAmount && Number(bidAmount) >= minimumBid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!url) newErrors.url = "Enter your product URL";
    if (!url.startsWith("https://")) newErrors.url = "URL must start with https://";
    if (!category) newErrors.category = "Select a category";
    if (!bidAmount || Number(bidAmount) < minimumBid) {
      newErrors.bidAmount = `Minimum bid is ${formatINR(minimumBid)}`;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    router.push(
      `/claim?url=${encodeURIComponent(url)}&category=${category}&amount=${bidAmount}${targetListing ? `&target=${targetListing}` : ""}`
    );
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.slug,
    label: c.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#101114] flex items-center gap-1.5">
          <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
          Your bid (INR)
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
        {currentBid > 0 && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Minimum to outbid: {formatINR(minimumBid)} (current: {formatINR(currentBid)} + ₹{minimumIncrement.toLocaleString("en-IN")} increment)
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="saffron"
        size="lg"
        className="w-full"
      >
        Claim this rank
      </Button>

      <p className="text-[11px] text-gray-400 text-center">
        Paid promotional placement. Not a contest or investment.
      </p>
    </form>
  );
}
