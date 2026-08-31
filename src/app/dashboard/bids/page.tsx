"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Bid {
  id: string;
  date: string;
  listing: string;
  listingSlug: string;
  category: string;
  amount: number;
  status: string;
  paymentStatus: string;
  invoiceId: string | null;
  rankAtBid: number | null;
}

interface BidsResponse {
  bids: Bid[];
  totalSpent: number;
  totalBids: number;
  activeBids: number;
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "outbid", label: "Outbid" },
  { value: "pending", label: "Pending" },
];

const paymentOptions = [
  { value: "", label: "All Payments" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const statusConfig: Record<
  string,
  { variant: "success" | "pending" | "error" | "muted"; label: string; icon: typeof ArrowUpRight }
> = {
  active: { variant: "success", label: "Active", icon: ArrowUpRight },
  outbid: { variant: "error", label: "Outbid", icon: ArrowDownRight },
  pending: { variant: "pending", label: "Pending", icon: Clock },
};

const paymentConfig: Record<
  string,
  { variant: "success" | "pending" | "error"; label: string }
> = {
  paid: { variant: "success", label: "Paid" },
  pending: { variant: "pending", label: "Pending" },
  failed: { variant: "error", label: "Failed" },
};

function mapBidStatus(dbStatus: string): string {
  if (dbStatus === "refunded") return "outbid";
  return dbStatus;
}

function mapPaymentStatus(dbStatus: string): string {
  if (dbStatus === "captured") return "paid";
  return dbStatus;
}

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-4 border-b border-[#E6E4DF] last:border-0"
        >
          <Skeleton className="h-4 w-24 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-28 rounded-md" />
          </div>
          <Skeleton className="h-4 w-16 rounded-md hidden sm:block" />
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-14 rounded-lg hidden md:block" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default function BidsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [bidsData, setBidsData] = useState<BidsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/bids")
      .then((res) => res.json())
      .then((data) => setBidsData(data))
      .catch(() => setBidsData({ bids: [], totalSpent: 0, totalBids: 0, activeBids: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const bids = bidsData?.bids ?? [];
  const totalSpent = bidsData?.totalSpent ?? 0;
  const totalBids = bidsData?.totalBids ?? bids.length;
  const activeBids = bidsData?.activeBids ?? bids.filter((b) => mapBidStatus(b.status) === "active").length;

  const filtered = bids.filter((b) => {
    const mappedStatus = mapBidStatus(b.status);
    const mappedPayment = mapPaymentStatus(b.paymentStatus);
    const matchSearch =
      !search ||
      b.listing.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || mappedStatus === status;
    const matchPayment = !payment || mappedPayment === payment;
    return matchSearch && matchStatus && matchPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">Bid History</h1>
          <p className="text-gray-500 mt-1">
            Track all your bids, payments, and invoices.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      {loading ? (
        <SummarySkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Bids</p>
              <p className="text-2xl font-bold text-[#101114] mt-1">{totalBids}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-[#101114] mt-1">
                ₹{totalSpent.toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Active Bids</p>
              <p className="text-2xl font-bold text-[#101114] mt-1">
                {activeBids}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bids..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Status"
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                options={paymentOptions}
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                placeholder="Payment"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bids table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <TableSkeleton />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E6E4DF] bg-[#F8F7F3]">
                    <th className="text-left font-medium text-gray-500 px-6 py-3">
                      Date
                    </th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3">
                      Listing
                    </th>
                    <th className="text-right font-medium text-gray-500 px-6 py-3 hidden sm:table-cell">
                      Amount
                    </th>
                    <th className="text-center font-medium text-gray-500 px-6 py-3">
                      Status
                    </th>
                    <th className="text-center font-medium text-gray-500 px-6 py-3 hidden md:table-cell">
                      Payment
                    </th>
                    <th className="text-right font-medium text-gray-500 px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((bid) => {
                    const mappedStatus = mapBidStatus(bid.status);
                    const mappedPayment = mapPaymentStatus(bid.paymentStatus);
                    const sc = statusConfig[mappedStatus];
                    const pc = paymentConfig[mappedPayment];
                    return (
                      <tr
                        key={bid.id}
                        className="border-b border-[#E6E4DF] last:border-0 hover:bg-[#F8F7F3]/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {new Date(bid.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[#101114]">
                              {bid.listing}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {bid.category}
                              {bid.rankAtBid && ` · Rank #${bid.rankAtBid}`}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-[#101114] hidden sm:table-cell">
                          ₹{bid.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {sc ? (
                            <Badge variant={sc.variant}>
                              <sc.icon className="h-3 w-3 mr-1" />
                              {sc.label}
                            </Badge>
                          ) : (
                            <Badge variant="muted">{bid.status}</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center hidden md:table-cell">
                          {pc ? (
                            <Badge variant={pc.variant}>{pc.label}</Badge>
                          ) : (
                            <Badge variant="muted">{bid.paymentStatus}</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {mappedPayment === "paid" && bid.invoiceId && (
                              <Link href={`/dashboard/billing?invoice=${bid.invoiceId}`}>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Invoice
                                </Button>
                              </Link>
                            )}
                            <Link href={`/today/${bid.listingSlug}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {!loading && filtered.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-sm">
                No bids match your filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
