"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatINR, timeAgo } from "@/lib/utils";

interface BidRecord {
  id: string;
  user: string;
  email: string;
  listing: string;
  listingSlug: string;
  amount: number;
  paymentStatus: "confirmed" | "pending" | "failed" | "refunded";
  status: string;
  date: string;
}

const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "confirmed":
      return "success";
    case "pending":
      return "pending";
    case "failed":
      return "error";
    case "refunded":
      return "muted";
    default:
      return "default";
  }
};

export default function BidsPage() {
  const [bids, setBids] = useState<BidRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalRefunded, setTotalRefunded] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/bids")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load bids");
        return res.json();
      })
      .then((data) => {
        setBids(data.bids);
        setTotalRevenue(data.totalRevenue);
        setTotalPending(data.totalPending);
        setTotalRefunded(data.totalRefunded);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = bids.filter((bid) => {
    const matchesStatus =
      statusFilter === "all" || bid.paymentStatus === statusFilter;
    const matchesSearch =
      bid.user.toLowerCase().includes(search.toLowerCase()) ||
      bid.listing.toLowerCase().includes(search.toLowerCase()) ||
      bid.id.toLowerCase().includes(search.toLowerCase()) ||
      bid.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">Bid &amp; Payment Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">Complete bid history and payment tracking</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-7 bg-gray-200 rounded w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse h-12 bg-gray-200 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">Bid &amp; Payment Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">Complete bid history and payment tracking</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#101114]">Bid &amp; Payment Ledger</h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete bid history and payment tracking
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-[#138A4B] mt-1">
              {formatINR(totalRevenue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">
              {formatINR(totalPending)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500">Refunded</p>
            <p className="text-2xl font-bold text-red-500 mt-1">
              {formatINR(totalRefunded)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search bids..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-72"
          />
          <Select
            options={PAYMENT_STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-48"
          />
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          Export CSV
        </Button>
      </div>

      {/* Bids table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E6E4DF] bg-[#F8F7F3]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Listing
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4DF]">
                {filtered.map((bid) => (
                  <tr
                    key={bid.id}
                    className="hover:bg-[#F8F7F3] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-500">
                        {bid.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[#101114]">{bid.user}</p>
                        <p className="text-xs text-gray-500">{bid.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[#101114]">{bid.listing}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-[#101114]">
                        {formatINR(bid.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(bid.paymentStatus) as any}>
                        {bid.paymentStatus.charAt(0).toUpperCase() +
                          bid.paymentStatus.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">
                        {timeAgo(new Date(bid.date))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-500">
                  No bids match your search.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
