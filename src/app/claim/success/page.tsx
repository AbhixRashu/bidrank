"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, LayoutDashboard } from "lucide-react";
import { BragCard } from "@/components/bid/brag-card";
import { ConfettiBurst } from "@/components/confetti-burst";

interface BidData {
  bidAmount: number;
  listingName: string;
  listingSlug: string;
  rank: number;
  category: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");
  const [showConfetti, setShowConfetti] = useState(false);
  const [bidData, setBidData] = useState<BidData | null>(null);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/leaderboard?limit=200`)
      .then((r) => r.json())
      .then((data) => {
        const leaderboard = data.leaderboard ?? [];
        if (leaderboard.length > 0) {
          setBidData({
            bidAmount: leaderboard[0].bidAmount,
            listingName: leaderboard[0].listing.name,
            listingSlug: leaderboard[0].listing.slug,
            rank: 1,
            category: leaderboard[0].listing.category.name,
          });
        }
      })
      .catch(() => {});
  }, [orderId]);

  const productName = bidData?.listingName || "Your Product";
  const bidAmount = bidData?.bidAmount || 0;
  const rank = bidData?.rank || 1;
  const category = bidData?.category || "";

  const shareText = encodeURIComponent(
    `\u{1F680} We just claimed Rank #${rank} on @IndBid for ${productName}! Can you outbid us? Check the live leaderboard \u{1F447}`
  );
  const shareUrl = encodeURIComponent("https://indbid.in");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F7F3] flex items-center justify-center px-4 py-12">
      <ConfettiBurst trigger={showConfetti} />

      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#138A4B]/10 animate-scale-in">
            <CheckCircle className="h-10 w-10 text-[#138A4B]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#101114] mb-2">
          Payment successful!
        </h1>
        <p className="text-gray-500 mb-8">
          Your bid has been confirmed. You&apos;re now on the leaderboard.
        </p>

        <div className="rounded-xl border border-[#E6E4DF] bg-white p-5 mb-6 text-left">
          <div className="space-y-3">
            {paymentId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment ID</span>
                <span className="font-mono text-[#101114] text-xs break-all">{paymentId}</span>
              </div>
            )}
            {orderId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono text-[#101114] text-xs break-all">{orderId}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="flex items-center gap-1 text-[#138A4B] font-medium">
                <CheckCircle className="h-3.5 w-3.5" />
                Verified & Live
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#101114] mb-4">Your Brag Card</h3>
          <BragCard
            productName={productName}
            bidAmount={bidAmount}
            rank={rank}
            claimedAt={new Date().toISOString()}
            category={category}
          />
        </div>

        <div className="mb-8">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#101114] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share your rank on X
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              View Leaderboard
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button variant="saffron" className="w-full">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ClaimSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] bg-[#F8F7F3] flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
