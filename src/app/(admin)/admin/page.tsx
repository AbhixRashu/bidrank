"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, timeAgo } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  RotateCcw,
  MousePointerClick,
  Clock,
  CheckCircle,
  ArrowRight,
  Users,
  ShieldCheck,
  Receipt,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalUsers: number;
    totalListings: number;
    pendingListings: number;
    totalBids: number;
    activeBids: number;
    totalRevenue: number;
    totalRefunds: number;
    paymentSuccessRate: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    entity: string;
    entityId: string;
    meta: any;
    time: string;
  }>;
  revenueByDay?: Array<{
    day: string;
    amount: number;
  }>;
}

const QUICK_LINKS = [
  { label: "Moderation Queue", href: "/admin/moderation", icon: ShieldCheck, countKey: "pendingListings" as const },
  { label: "Bid Ledger", href: "/admin/bids", icon: Receipt, countKey: null },
  { label: "User Management", href: "/admin/users", icon: Users, countKey: null },
  { label: "Platform Settings", href: "/admin/settings", icon: Settings, countKey: null },
];

function getActivityType(action: string) {
  const lower = action.toLowerCase();
  if (lower.includes("bid")) return "bid";
  if (lower.includes("review") || lower.includes("submitted")) return "review";
  if (lower.includes("suspend") || lower.includes("user")) return "user";
  if (lower.includes("payment") || lower.includes("confirm")) return "payment";
  if (lower.includes("approv")) return "approval";
  if (lower.includes("refund")) return "refund";
  return "default";
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of IndBid platform activity</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of IndBid platform activity</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data!.stats;

  const STATS = [
    {
      label: "GMV",
      value: formatINR(stats.totalRevenue + stats.totalRefunds),
      icon: TrendingUp,
      color: "text-[#FF8A00]",
      bg: "bg-[#FF8A00]/10",
    },
    {
      label: "Revenue",
      value: formatINR(stats.totalRevenue),
      icon: DollarSign,
      color: "text-[#138A4B]",
      bg: "bg-[#138A4B]/10",
    },
    {
      label: "Refunds",
      value: formatINR(stats.totalRefunds),
      icon: RotateCcw,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Active Bids",
      value: String(stats.activeBids),
      icon: MousePointerClick,
      color: "text-[#245BFF]",
      bg: "bg-[#245BFF]/10",
    },
    {
      label: "Pending Reviews",
      value: String(stats.pendingListings),
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Payment Success",
      value: `${stats.paymentSuccessRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-[#138A4B]",
      bg: "bg-[#138A4B]/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#101114]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of IndBid platform activity
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-[#101114] mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {data!.revenueByDay && data!.revenueByDay.length > 0 ? (
              <div className="flex items-end gap-2 h-48">
                {data!.revenueByDay.map((d) => {
                  const maxAmount = Math.max(...data!.revenueByDay!.map((x) => x.amount));
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-medium text-gray-500">
                        {formatINR(d.amount)}
                      </span>
                      <div className="w-full relative">
                        <div
                          className="w-full bg-[#FF8A00] rounded-t-md transition-all"
                          style={{
                            height: `${maxAmount > 0 ? (d.amount / maxAmount) * 140 : 0}px`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-sm text-gray-400">No revenue data yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#F8F7F3] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <link.icon className="h-4 w-4 text-gray-400 group-hover:text-[#101114] transition-colors" />
                  <span className="text-sm font-medium text-[#101114]">
                    {link.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {link.countKey !== null && stats[link.countKey] > 0 && (
                    <Badge variant="saffron" className="text-[10px]">
                      {stats[link.countKey]}
                    </Badge>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#101114] transition-colors" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data!.recentActivity.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">No recent activity.</p>
              </div>
            ) : (
              data!.recentActivity.map((item) => {
                const type = getActivityType(item.action);
                const detail = item.meta
                  ? `${item.entity}${item.meta.amount ? ` — ${formatINR(item.meta.amount)}` : ""}`
                  : item.entity;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F8F7F3] transition-colors"
                  >
                    <div className="mt-0.5">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          type === "bid"
                            ? "bg-[#245BFF]"
                            : type === "review"
                              ? "bg-amber-400"
                              : type === "user"
                                ? "bg-red-400"
                                : type === "payment"
                                  ? "bg-[#138A4B]"
                                  : type === "approval"
                                    ? "bg-[#138A4B]"
                                    : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#101114]">
                        {item.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {timeAgo(new Date(item.time))}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
