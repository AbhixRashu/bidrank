"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Eye,
  Pause,
  MoreHorizontal,
  ExternalLink,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Listing {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  domain: string;
  category: string;
  categorySlug: string;
  rank: number;
  bid: number;
  status: string;
  clicks: number;
}

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "fintech", label: "Fintech" },
  { value: "design", label: "Design" },
  { value: "ai-saas", label: "AI & SaaS" },
  { value: "developer-tools", label: "Developer Tools" },
  { value: "d2c-ecommerce", label: "D2C & Ecommerce" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

const statusConfig: Record<string, { variant: "success" | "pending" | "error"; label: string }> = {
  active: { variant: "success", label: "Active" },
  pending: { variant: "pending", label: "Pending" },
  rejected: { variant: "error", label: "Rejected" },
};

function TableSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-4 border-b border-[#E6E4DF] last:border-0"
        >
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
          <Skeleton className="h-4 w-20 rounded-md hidden md:block" />
          <Skeleton className="h-6 w-8 rounded-full hidden sm:block" />
          <Skeleton className="h-4 w-16 rounded-md hidden sm:block" />
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default function ListingsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/listings")
      .then((res) => res.json())
      .then((data) => setListings(data.listings))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = listings.filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.tagline.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || l.categorySlug === category;
    const matchStatus = !status || l.status === status;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">My Listings</h1>
          <p className="text-gray-500 mt-1">
            Manage your product listings and track their performance.
          </p>
        </div>
        <Link href="/claim">
          <Button variant="saffron">
            <Plus className="h-4 w-4" />
            New listing
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                options={categoryOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
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
          </div>
        </CardContent>
      </Card>

      {/* Listings table */}
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
                      Name
                    </th>
                    <th className="text-left font-medium text-gray-500 px-6 py-3 hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-center font-medium text-gray-500 px-6 py-3 hidden sm:table-cell">
                      Rank
                    </th>
                    <th className="text-right font-medium text-gray-500 px-6 py-3 hidden sm:table-cell">
                      Bid
                    </th>
                    <th className="text-center font-medium text-gray-500 px-6 py-3">
                      Status
                    </th>
                    <th className="text-right font-medium text-gray-500 px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((listing) => {
                    const sc = statusConfig[listing.status];
                    return (
                      <tr
                        key={listing.id}
                        className="border-b border-[#E6E4DF] last:border-0 hover:bg-[#F8F7F3]/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[#101114]">
                              {listing.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {listing.domain}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-gray-600">{listing.category}</span>
                        </td>
                        <td className="px-6 py-4 text-center hidden sm:table-cell">
                          {listing.rank > 0 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FF8A00]/10 text-[#FF8A00] text-xs font-bold">
                              {listing.rank}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-[#101114] hidden sm:table-cell">
                          {listing.bid > 0
                            ? `₹${listing.bid.toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {sc ? (
                            <Badge variant={sc.variant}>{sc.label}</Badge>
                          ) : (
                            <Badge variant="muted">{listing.status}</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/today/${listing.slug}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {listing.status === "active" && (
                              <>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Pause className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {listing.status !== "active" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            )}
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
                No listings match your filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
