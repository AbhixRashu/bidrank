"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { timeAgo } from "@/lib/utils";
import { ClipboardCheck } from "lucide-react";

interface ModerationItem {
  id: string;
  name: string;
  slug: string;
  url: string;
  category: string;
  categorySlug: string;
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  submittedAt: string;
  clicks: number;
  bids: number;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/listings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load listings");
        return res.json();
      })
      .then((data: { listings: ModerationItem[] }) => setItems(data.listings))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.url.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  async function handleModerationAction(action: "approve" | "reject") {
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: selectedItem.id,
          action,
          reason: action === "reject" ? rejectReason : undefined,
        }),
      });
      if (!res.ok) throw new Error("Action failed");
      setItems((prev) =>
        prev.map((i) =>
          i.id === selectedItem.id
            ? { ...i, status: action === "approve" ? ("approved" as const) : ("rejected" as const) }
            : i
        )
      );
      setSelectedItem(null);
      setRejectReason("");
    } catch {
      // silently fail — could add toast
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">Moderation Queue</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage submitted listings</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse h-14 bg-gray-200 rounded" />
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
          <h1 className="text-2xl font-bold text-[#101114]">Moderation Queue</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage submitted listings</p>
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
        <h1 className="text-2xl font-bold text-[#101114]">Moderation Queue</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage submitted listings
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-72"
        />
        <Select
          options={STATUS_OPTIONS}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="sm:w-48"
        />
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({counts.pending})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({counts.approved})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({counts.rejected})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Listings table */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E6E4DF] bg-[#F8F7F3]">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Listing
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Submitted
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E4DF]">
                    {filtered.map((item) => (
                      <tr
                        key={item.id}
                        className={`transition-colors cursor-pointer ${
                          selectedItem?.id === item.id
                            ? "bg-[#245BFF]/5"
                            : "hover:bg-[#F8F7F3]"
                        }`}
                        onClick={() => setSelectedItem(item)}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-[#101114]">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                              {item.url}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <Badge variant="default">{item.category}</Badge>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-gray-500">
                            {timeAgo(new Date(item.submittedAt))}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              item.status === "pending"
                                ? "pending"
                                : item.status === "approved"
                                  ? "success"
                                  : "error"
                            }
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {item.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                            >
                              Review
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-500">
                      No listings match your filters.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detail / review panel */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            {selectedItem ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Review Listing
                    </CardTitle>
                    <Badge
                      variant={
                        selectedItem.status === "pending"
                          ? "pending"
                          : selectedItem.status === "approved"
                            ? "success"
                            : "error"
                      }
                    >
                      {selectedItem.status.charAt(0).toUpperCase() +
                        selectedItem.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-sm font-medium text-[#101114]">
                      {selectedItem.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">URL</p>
                    <p className="text-sm text-[#245BFF]">{selectedItem.url}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <Badge variant="default">{selectedItem.category}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted By</p>
                    <p className="text-sm text-[#101114]">
                      {selectedItem.submittedBy}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Clicks</p>
                      <p className="text-sm font-medium text-[#101114]">
                        {selectedItem.clicks}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bids</p>
                      <p className="text-sm font-medium text-[#101114]">
                        {selectedItem.bids}
                      </p>
                    </div>
                  </div>

                  {/* URL Preview placeholder */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Preview</p>
                    <div className="rounded-lg border border-[#E6E4DF] bg-gray-50 h-40 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">
                          URL preview placeholder
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {selectedItem.url}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedItem.status === "pending" && (
                    <div className="space-y-3 pt-2 border-t border-[#E6E4DF]">
                      <Textarea
                        placeholder="Rejection reason (optional for approve)..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="green"
                          className="flex-1"
                          disabled={submitting}
                          onClick={() => handleModerationAction("approve")}
                        >
                          {submitting ? "Saving..." : "Approve"}
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          disabled={submitting}
                          onClick={() => handleModerationAction("reject")}
                        >
                          {submitting ? "Saving..." : "Reject"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="py-16 text-center">
                <ClipboardCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  Select a listing to review
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
