"use client";

import { useState, useEffect } from "react";
import {
  Download,
  FileText,
  Receipt,
  Building2,
  Save,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface Payment {
  id: string;
  date: string;
  listing: string;
  amount: number;
  method: string;
  status: string;
}

interface BillingResponse {
  payments: Payment[];
  totalPaid: number;
  activeListings: number;
}

const statusConfig: Record<string, { variant: "success" | "pending" | "error"; label: string }> = {
  completed: { variant: "success", label: "Completed" },
  processing: { variant: "pending", label: "Processing" },
  failed: { variant: "error", label: "Failed" },
};

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-md" />
            <Skeleton className="h-3 w-28 rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-4 border-b border-[#E6E4DF] last:border-0"
        >
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md hidden md:block" />
          <Skeleton className="h-4 w-20 rounded-md hidden sm:block" />
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("payments");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [billingData, setBillingData] = useState<BillingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/billing")
      .then((res) => res.json())
      .then((data) => setBillingData(data))
      .catch(() => setBillingData({ payments: [], totalPaid: 0, activeListings: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const payments = billingData?.payments ?? [];
  const totalPaid = billingData?.totalPaid ?? payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const activeListings = billingData?.activeListings ?? 0;
  const completedCount = payments.filter((p) => p.status === "completed").length;
  const lastPayment = payments[0];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#101114]">Billing</h1>
        <p className="text-gray-500 mt-1">
          Payment history, receipts, and billing details.
        </p>
      </div>

      {/* Summary cards */}
      {loading ? (
        <SummarySkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-[#101114] mt-1">
                ₹{totalPaid.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {completedCount} payments made
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Last Payment</p>
              <p className="text-2xl font-bold text-[#101114] mt-1">
                ₹{lastPayment?.amount.toLocaleString("en-IN") || 0}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {lastPayment?.date || "No payments yet"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Active Listings</p>
              <p className="text-2xl font-bold text-[#101114] mt-1">{activeListings}</p>
              <p className="text-xs text-gray-400 mt-1">Currently on leaderboard</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="billing-details">My Details</TabsTrigger>
        </TabsList>

        {/* Payments tab */}
        <TabsContent value="payments">
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
                          Receipt
                        </th>
                        <th className="text-left font-medium text-gray-500 px-6 py-3">
                          Date
                        </th>
                        <th className="text-left font-medium text-gray-500 px-6 py-3 hidden md:table-cell">
                          Listing
                        </th>
                        <th className="text-left font-medium text-gray-500 px-6 py-3 hidden sm:table-cell">
                          Method
                        </th>
                        <th className="text-right font-medium text-gray-500 px-6 py-3">
                          Amount
                        </th>
                        <th className="text-center font-medium text-gray-500 px-6 py-3">
                          Status
                        </th>
                        <th className="text-right font-medium text-gray-500 px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => {
                        const sc = statusConfig[p.status];
                        return (
                          <tr
                            key={p.id}
                            className="border-b border-[#E6E4DF] last:border-0 hover:bg-[#F8F7F3]/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-[#101114]">{p.id}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              {new Date(p.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                              {p.listing}
                            </td>
                            <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">
                              <div className="flex items-center gap-1.5">
                                <CreditCard className="h-3.5 w-3.5" />
                                {p.method}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-[#101114]">
                              ₹{p.amount.toLocaleString("en-IN")}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {sc ? (
                                <Badge variant={sc.variant}>{sc.label}</Badge>
                              ) : (
                                <Badge variant="muted">{p.status}</Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Receipt
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing details tab */}
        <TabsContent value="billing-details">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Your Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#101114] mb-1.5">
                    Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#101114] mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#101114] mb-1.5">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="pt-2">
                  <Button onClick={handleSave} variant="default">
                    {saved ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save details
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
