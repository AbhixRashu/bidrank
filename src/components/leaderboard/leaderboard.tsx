"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeaderboardRow, LeaderboardSkeleton } from "./leaderboard-row";
import { TopThreePodium } from "./top-three-podium";
import { CrownTimer } from "@/components/crown-timer";
import { CrownTakenBanner } from "@/components/crown-taken-banner";
import { CATEGORIES } from "@/lib/utils/categories";
import { useRealtimeBids } from "@/hooks/use-realtime-bids";
import { useSound } from "@/hooks/use-sound";
import { ConfettiBurst } from "@/components/confetti-burst";
import type { MockListing } from "@/types/listing";
import type { RealtimeBidEvent, LeaderboardApiItem } from "@/types";
import { Wifi, WifiOff, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

function mapApiToMockListing(item: LeaderboardApiItem): MockListing {
  return {
    id: item.listing.id,
    slug: item.listing.slug,
    name: item.listing.name,
    url: item.listing.domain ? `https://${item.listing.domain}` : "",
    tagline: item.listing.tagline,
    description: "",
    logoUrl: item.listing.logoUrl,
    domain: item.listing.domain ?? "",
    category: item.listing.category.name,
    categorySlug: item.listing.category.slug,
    bidAmount: item.bidAmount,
    claimedAt: item.claimedAt ? new Date(item.claimedAt) : new Date(),
    clicks: item.clicks,
    verified: true,
  };
}

export function Leaderboard() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all-time");
  const [allRankings, setAllRankings] = useState<MockListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [previousLeader, setPreviousLeader] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [crownTaken, setCrownTaken] = useState<{
    newProduct: string;
    oldProduct: string;
    amount: number;
  } | null>(null);
  const { play } = useSound();

  const LIMIT = 50;

  const fetchLeaderboard = useCallback(async (period: string, reset = true) => {
    const currentOffset = reset ? 0 : offset;
    if (reset) {
      setLoading(true);
      setOffset(0);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await fetch(
        `/api/leaderboard?limit=${LIMIT}&offset=${currentOffset}&period=${period}${activeCategory ? `&category=${activeCategory}` : ""}`
      );
      const data = await res.json();
      const mapped = (data.leaderboard ?? []).map(mapApiToMockListing);

      if (reset) {
        setAllRankings(mapped);
        setPreviousLeader(mapped[0]?.id ?? null);
      } else {
        setAllRankings((prev) => [...prev, ...mapped]);
      }
      setHasMore(data.hasMore ?? false);
      setOffset(currentOffset + LIMIT);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [offset, activeCategory]);

  const handleLeaderboardUpdate = useCallback(
    (event: RealtimeBidEvent) => {
      if (event.data.leaderboard) {
        const mapped = event.data.leaderboard.map(mapApiToMockListing);
        setAllRankings((prev) => {
          const newLeader = mapped[0]?.id;
          if (previousLeader && newLeader && previousLeader !== newLeader) {
            setShowConfetti(true);
            play("new-number-one");
            const oldName = prev.find((l) => l.id === previousLeader)?.name ?? "Unknown";
            const newName = mapped[0]?.name ?? "Unknown";
            const newAmount = mapped[0]?.bidAmount ?? 0;
            setCrownTaken({
              newProduct: newName,
              oldProduct: oldName,
              amount: newAmount,
            });
            setTimeout(() => setShowConfetti(false), 3000);
          }
          setPreviousLeader(newLeader ?? null);
          return mapped;
        });
      }
    },
    [previousLeader, play]
  );

  const handleNewBid = useCallback(
    (event: RealtimeBidEvent) => {
      play("new-bid");
    },
    [play]
  );

  const handleOutbid = useCallback(
    (event: RealtimeBidEvent) => {
      play("outbid");
    },
    [play]
  );

  const handleRankChanged = useCallback(
    (event: RealtimeBidEvent) => {
      if (event.data.rank === 1 && event.data.previousRank !== 1) {
        setShowConfetti(true);
        play("new-number-one");
        setTimeout(() => setShowConfetti(false), 3000);
      }
    },
    [play]
  );

  const { isConnected } = useRealtimeBids({
    onNewBid: handleNewBid,
    onOutbid: handleOutbid,
    onRankChanged: handleRankChanged,
    onLeaderboardUpdate: handleLeaderboardUpdate,
    enabled: true,
  });

  useEffect(() => {
    fetchLeaderboard(activeTab, true);
  }, []);

  useEffect(() => {
    fetchLeaderboard(activeTab, true);
  }, [activeTab, activeCategory]);

  const rankings = useMemo(() => {
    return allRankings;
  }, [allRankings]);

  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);

  return (
    <>
      <ConfettiBurst trigger={showConfetti} />

      <AnimatePresence>
        {crownTaken && (
          <CrownTakenBanner
            newProduct={crownTaken.newProduct}
            oldProduct={crownTaken.oldProduct}
            amount={crownTaken.amount}
            onDismiss={() => setCrownTaken(null)}
          />
        )}
      </AnimatePresence>

      <section id="leaderboard" className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {activeCategory === "" && top3.length > 0 && (
            <TopThreePodium listings={top3} />
          )}

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#E6E4DF]" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {activeCategory !== "" ? "Filtered Rankings" : "Full Leaderboard"}
            </span>
            <div className="flex-1 h-px bg-[#E6E4DF]" />
          </div>

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#101114]">
                Live Leaderboard
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Ranked by verified bid amount. Higher bids rise to the top.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isConnected ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#138A4B]/10 text-[#138A4B]">
                  <Wifi className="h-3 w-3" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">
                  <WifiOff className="h-3 w-3" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Offline</span>
                </div>
              )}
              <CrownTimer heldSince={top3[0]?.claimedAt?.toISOString() ?? null} />
            </div>
          </div>

          <div className="flex items-center gap-1 mb-6 p-1 bg-[#F8F7F3] rounded-lg w-fit border border-[#E6E4DF]">
            {[
              { value: "all-time", label: "All-time" },
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? "bg-white text-[#101114] shadow-sm"
                    : "text-gray-500 hover:text-[#101114]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory("")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === ""
                  ? "bg-[#101114] text-white"
                  : "bg-[#F8F7F3] text-gray-600 hover:bg-[#E6E4DF]"
              }`}
            >
              All categories
            </button>
            {(showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 10)).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug === activeCategory ? "" : cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat.slug
                    ? "bg-[#101114] text-white"
                    : "bg-[#F8F7F3] text-gray-600 hover:bg-[#E6E4DF]"
                }`}
              >
                {cat.name}
              </button>
            ))}
            {CATEGORIES.length > 10 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F8F7F3] text-[#245BFF] hover:bg-[#E6E4DF] inline-flex items-center gap-1"
              >
                {showAllCategories ? (
                  <>
                    Show less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    + More <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>

          <div className="rounded-xl border border-[#E6E4DF] bg-white overflow-hidden">
            <div className="hidden sm:flex items-center gap-4 px-4 sm:px-6 py-2 border-b border-[#E6E4DF] bg-[#F8F7F3] text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              <span className="w-10">Rank</span>
              <span className="w-10" />
              <span className="flex-1">Product</span>
              <span className="w-32 text-right">Stats</span>
              <span className="w-20 text-right">Bid</span>
              <span className="w-28" />
            </div>

            <div className="divide-y divide-[#E6E4DF]">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <LeaderboardSkeleton key={i} />
                  ))
                : (activeCategory !== "" ? rankings : (rankings.length <= 3 ? rankings : rest)).map((listing, i) => {
                    const displayRank = activeCategory !== "" 
                      ? i + 1 
                      : (rankings.length <= 3 ? i + 1 : i + 4);
                    return (
                      <motion.div
                        key={listing.id}
                        layout
                        layoutId={listing.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          layout: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                        }}
                      >
                        <LeaderboardRow
                          listing={listing}
                          rank={displayRank}
                        />
                      </motion.div>
                    );
                  })}
            </div>

            {!loading && rankings.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm text-gray-500">No listings found in this category.</p>
              </div>
            )}
          </div>

          {hasMore && !loading && (
            <div className="mt-4 text-center">
              <button
                onClick={() => fetchLeaderboard(activeTab, false)}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 text-sm text-[#245BFF] hover:underline disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load more rankings"
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
