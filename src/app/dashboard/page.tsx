"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Eye,
  IndianRupee,
  Trophy,
  Plus,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Package,
  Gavel,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

interface DashboardStats {
  activeListings: number;
  totalBids: number;
  totalSpent: number;
  bestRank: number | null;
  bestRankListing: string;
}

interface ListingItem {
  name: string;
  tagline: string;
  bid: number;
  status: string;
  clicks: number;
  category: string;
  rank: number;
}

interface ActivityItem {
  id: string;
  message: string;
  time: string;
  type: "bid_won" | "outbid" | "listed" | "rank_change";
}

const activityIcons: Record<string, typeof TrendingUp> = {
  bid_won: Trophy,
  outbid: TrendingUp,
  listed: Package,
  rank_change: ArrowUpRight,
};

const activityColors: Record<string, string> = {
  bid_won: "bg-[#138A4B]/10 text-[#138A4B]",
  outbid: "bg-red-50 text-red-600",
  listed: "bg-[#245BFF]/10 text-[#245BFF]",
  rank_change: "bg-[#FF8A00]/10 text-[#FF8A00]",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activeListings: 0,
    totalBids: 0,
    totalSpent: 0,
    bestRank: null,
    bestRankListing: "",
  });
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/listings").then((r) => r.json()),
      fetch("/api/dashboard/bids").then((r) => r.json()),
    ]).then(([listingsData, bidsData]) => {
      const allListings = listingsData.listings ?? [];
      const allBids = bidsData.bids ?? [];

      setListings(
        allListings.map((l: any) => ({
          name: l.name,
          tagline: l.tagline,
          bid: l.currentBid?.amount ?? 0,
          status: l.status,
          clicks: l.clickCount ?? 0,
          category: l.category?.name ?? "",
          rank: l.rank ?? 0,
        }))
      );

      setStats({
        activeListings: allListings.length,
        totalBids: allBids.length,
        totalSpent: allBids.reduce((sum: number, b: any) => sum + b.amount, 0),
        bestRank: allListings.length > 0 ? Math.min(...allListings.map((l: any) => l.rank ?? 999)) : null,
        bestRankListing: allListings.length > 0 ? allListings.find((l: any) => l.rank === Math.min(...allListings.map((x: any) => x.rank ?? 999)))?.name ?? "" : "",
      });

      setActivities(
        allBids.slice(0, 5).map((b: any) => ({
          id: b.id,
          message: `Bid of ${formatINR(b.amount)} on ${b.listing?.name ?? "listing"} — ${b.status}`,
          time: new Date(b.createdAt).toLocaleDateString("en-IN"),
          type: b.status === "activated" ? ("bid_won" as const) : ("listed" as const),
        }))
      );

      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Active Listings",
      value: String(stats.activeListings),
      icon: Package,
      color: "text-[#245BFF]",
      bg: "bg-[#245BFF]/10",
    },
    {
      label: "Total Bids",
      value: String(stats.totalBids),
      icon: Gavel,
      color: "text-[#FF8A00]",
      bg: "bg-[#FF8A00]/10",
    },
    {
      label: "Total Spent",
      value: stats.totalSpent > 0 ? formatINR(stats.totalSpent) : "₹0",
      icon: IndianRupee,
      color: "text-[#138A4B]",
      bg: "bg-[#138A4B]/10",
    },
    {
      label: "Current Best Rank",
      value: stats.bestRank ? `#${stats.bestRank}` : "—",
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#101114]">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s how your listings are performing today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#101114] mt-1">
                    {loading ? "—" : stat.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Active Listings</CardTitle>
              <Link href="/dashboard/listings">
                <Button variant="ghost" size="sm">
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 bg-gray-50 rounded animate-pulse" />
                  ))}
                </div>
              ) : listings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E6E4DF]">
                        <th className="text-left font-medium text-gray-500 pb-3 pr-4">Rank</th>
                        <th className="text-left font-medium text-gray-500 pb-3 pr-4">Name</th>
                        <th className="text-left font-medium text-gray-500 pb-3 pr-4 hidden sm:table-cell">Bid</th>
                        <th className="text-left font-medium text-gray-500 pb-3 pr-4">Status</th>
                        <th className="text-right font-medium text-gray-500 pb-3">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((item) => (
                        <tr key={item.name} className="border-b border-[#E6E4DF] last:border-0">
                          <td className="py-3.5 pr-4">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-bold">
                              {item.rank || "—"}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <p className="font-medium text-[#101114]">{item.name}</p>
                            <p className="text-xs text-gray-400 hidden sm:block">{item.tagline}</p>
                          </td>
                          <td className="py-3.5 pr-4 font-medium text-[#101114] hidden sm:table-cell">
                            {formatINR(item.bid)}
                          </td>
                          <td className="py-3.5 pr-4">
                            <Badge variant={item.status === "approved" ? "success" : "pending"}>
                              {item.status === "approved" ? "Active" : item.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1 text-gray-500">
                              <Eye className="h-3.5 w-3.5" />
                              {item.clicks}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-500 mb-4">No listings yet.</p>
                  <Link href="/claim">
                    <Button variant="saffron">List your first product</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-50 rounded animate-pulse" />
                  ))}
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((item) => {
                    const Icon = activityIcons[item.type];
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${activityColors[item.type]}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-[#101114] leading-snug">{item.message}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No activity yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/claim">
            <Button variant="saffron">
              <Plus className="h-4 w-4" />
              List a product
            </Button>
          </Link>
          <Link href="/#leaderboard">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4" />
              View leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
