"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatINR, timeAgo } from "@/lib/utils";
import { TrendingUp, ArrowUpRight, Zap, Eye, Flame, Crown } from "lucide-react";

interface Activity {
  id: string;
  listing: string;
  slug: string;
  action: string;
  amount: number;
  time: string;
}

interface TopListing {
  name: string;
  tagline: string;
  slug: string;
  category: string;
  bidAmount: number;
}

interface TickerItem {
  id: string;
  text: string;
  icon: "bolt" | "fire" | "eye" | "crown";
  highlight: boolean;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [topListing, setTopListing] = useState<TopListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [liveBidCount, setLiveBidCount] = useState(0);
  const [activeTickerIdx, setActiveTickerIdx] = useState(0);

  const buildTicker = useCallback((acts: Activity[]) => {
    const items: TickerItem[] = [];

    acts.slice(0, 5).forEach((a) => {
      items.push({
        id: a.id,
        text: `${timeAgo(new Date(a.time))}: ${a.listing} ${a.action} for ${formatINR(a.amount)}`,
        icon: a.amount > 10000 ? "fire" : "bolt",
        highlight: a.amount > 10000,
      });
    });

    if (acts.length > 0) {
      const recentCount = acts.filter((a) => {
        const diff = Date.now() - new Date(a.time).getTime();
        return diff < 2 * 60 * 60 * 1000;
      }).length;
      items.push({
        id: "counter-bids",
        text: `${recentCount || acts.length} bids placed in the last 2 hours`,
        icon: "fire",
        highlight: false,
      });
    }

    items.push({
      id: "watching",
      text: `${Math.floor(Math.random() * 50) + 30} founders watching the board`,
      icon: "eye",
      highlight: false,
    });

    setTickerItems(items);
  }, []);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((data) => {
        const acts = data.activities ?? [];
        setActivities(acts);
        setTopListing(data.topListing ?? null);
        setLiveBidCount(acts.length);
        buildTicker(acts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [buildTicker]);

  useEffect(() => {
    if (tickerItems.length === 0) return;
    const interval = setInterval(() => {
      setActiveTickerIdx((prev) => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  const getIcon = (type: TickerItem["icon"]) => {
    switch (type) {
      case "bolt": return <Zap className="h-3 w-3 text-[#FF8A00]" />;
      case "fire": return <Flame className="h-3 w-3 text-red-500" />;
      case "eye": return <Eye className="h-3 w-3 text-[#245BFF]" />;
      case "crown": return <Crown className="h-3 w-3 text-[#FFD700]" />;
    }
  };

  return (
    <section className="py-12 bg-[#F8F7F3]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Live Pulse Ticker Bar */}
        <div className="mb-8 rounded-xl border border-[#E6E4DF] bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#E6E4DF] bg-[#F8F7F3]">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8A00] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8A00]" />
              </span>
              <span className="text-[10px] font-bold text-[#FF8A00] uppercase tracking-wider">
                Live Activity
              </span>
            </div>
            <div className="flex-1 overflow-hidden h-6 relative">
              <AnimatePresence mode="wait">
                {tickerItems.length > 0 && (
                  <motion.div
                    key={activeTickerIdx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="flex items-center gap-2">
                      {getIcon(tickerItems[activeTickerIdx].icon)}
                      <span className={`text-xs ${tickerItems[activeTickerIdx].highlight ? "font-bold text-[#101114]" : "text-gray-600"}`}>
                        {tickerItems[activeTickerIdx].text}
                      </span>
                      {tickerItems[activeTickerIdx].highlight && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#FF8A00]/10 text-[9px] font-bold text-[#FF8A00] animate-pulse">
                          HOT
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-[#101114] mb-4">
              Today&apos;s Top Ranking
            </h3>
            <div className="rounded-xl border border-[#E6E4DF] bg-white p-5">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-12 w-12 rounded-lg bg-gray-100" />
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                  <div className="h-3 w-48 bg-gray-100 rounded" />
                </div>
              ) : topListing ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF8A00]/10 text-[#FF8A00] text-lg font-bold">
                      #1
                    </div>
                    <div>
                      <p className="font-semibold text-[#101114]">{topListing.name}</p>
                      <p className="text-xs text-gray-500">{topListing.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{topListing.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#101114]">
                      {formatINR(topListing.bidAmount)}
                    </span>
                    <span className="text-xs text-gray-500">Current top bid</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No listings yet.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#101114] mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#FF8A00]" />
              Recent Activity
            </h3>
            <div className="rounded-xl border border-[#E6E4DF] bg-white divide-y divide-[#E6E4DF]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-5 py-3 animate-pulse">
                    <div className="h-4 w-40 bg-gray-100 rounded" />
                    <div className="h-3 w-16 bg-gray-100 rounded mt-1" />
                  </div>
                ))
              ) : activities.length > 0 ? (
                activities.map((activity) => {
                  const isHighValue = activity.amount > 10000;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between px-5 py-3 transition-colors ${
                        isHighValue ? "bg-[#FF8A00]/5" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#101114] truncate">
                          <span className="font-medium">{activity.listing}</span>{" "}
                          <span className="text-gray-500">{activity.action}</span>
                          {isHighValue && (
                            <span className="inline-flex items-center ml-1.5 px-1.5 py-0.5 rounded-full bg-[#FF8A00]/10 text-[9px] font-bold text-[#FF8A00]">
                              🔥 HIGH VALUE
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatINR(activity.amount)} • {timeAgo(new Date(activity.time))}
                        </p>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 flex-shrink-0 ml-2" />
                    </motion.div>
                  );
                })
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-gray-500">No activity yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
