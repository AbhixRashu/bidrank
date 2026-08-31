"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatINR } from "@/lib/utils";
import { CATEGORIES } from "@/lib/utils/categories";
import {
  Save,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface IncrementTier {
  id: string;
  maxBid: number;
  minIncrement: number;
}

const DEFAULT_TIERS: IncrementTier[] = [
  { id: "t1", maxBid: 999, minIncrement: 1 },
  { id: "t2", maxBid: 9999, minIncrement: 10 },
  { id: "t3", maxBid: 99999, minIncrement: 100 },
  { id: "t4", maxBid: 999999, minIncrement: 1000 },
];

export default function SettingsPage() {
  const [tiers, setTiers] = useState<IncrementTier[]>(DEFAULT_TIERS);
  const [platformFee, setPlatformFee] = useState("5");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [featureFlags, setFeatureFlags] = useState({
    dailyRankings: true,
    claimFlow: true,
    leaderboard: true,
    socialProof: true,
    analytics: false,
    apiAccess: false,
  });
  const [saved, setSaved] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addTier() {
    setTiers((prev) => [
      ...prev,
      {
        id: `t${Date.now()}`,
        maxBid: 1000000,
        minIncrement: 1000,
      },
    ]);
  }

  function removeTier(id: string) {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTier(id: string, field: "maxBid" | "minIncrement", value: number) {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }

  function toggleFeature(flag: keyof typeof featureFlags) {
    setFeatureFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">
            Platform Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure platform behavior and features
          </p>
        </div>
        <Button variant="default" onClick={handleSave}>
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#138A4B]/10 text-[#138A4B] text-sm font-medium">
          Settings saved successfully.
        </div>
      )}

      {/* Minimum Increment Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Minimum Increment Tiers
          </CardTitle>
          <p className="text-xs text-gray-500">
            Configure how much a user must increase their bid by at each price
            level.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {tiers.map((tier, i) => (
            <div key={tier.id} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-6">#{i + 1}</span>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  Bid ≤
                </span>
                <Input
                  type="number"
                  value={tier.maxBid}
                  onChange={(e) =>
                    updateTier(tier.id, "maxBid", Number(e.target.value))
                  }
                  className="w-28"
                />
                <span className="text-xs text-gray-500">→ min increment</span>
                <Input
                  type="number"
                  value={tier.minIncrement}
                  onChange={(e) =>
                    updateTier(
                      tier.id,
                      "minIncrement",
                      Number(e.target.value)
                    )
                  }
                  className="w-24"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-500"
                onClick={() => removeTier(tier.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="text-xs mt-2"
            onClick={addTier}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Tier
          </Button>
        </CardContent>
      </Card>

      {/* Platform Fee */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Fee</CardTitle>
          <p className="text-xs text-gray-500">
            Percentage fee charged on each successful bid payment.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 max-w-xs">
            <Input
              type="number"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
              min={0}
              max={50}
              className="w-24"
            />
            <span className="text-sm text-gray-500">% of bid amount</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Example: On a {formatINR(10000)} bid, platform earns{" "}
            {formatINR(Math.round(10000 * (Number(platformFee) / 100)))} at{" "}
            {platformFee}% fee.
          </p>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Feature Flags</CardTitle>
          <p className="text-xs text-gray-500">
            Toggle platform features on or off.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(featureFlags).map(([key, value]) => {
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());
            return (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-[#E6E4DF] last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-[#101114]">{label}</p>
                </div>
                <button
                  onClick={() =>
                    toggleFeature(key as keyof typeof featureFlags)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-[#138A4B]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Maintenance Mode</CardTitle>
            {maintenanceMode && (
              <Badge variant="error" className="text-[10px]">
                ACTIVE
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">
            When enabled, the site shows a maintenance page to all non-admin
            users.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                maintenanceMode ? "bg-red-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  maintenanceMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-[#101114]">
              {maintenanceMode ? "Enabled" : "Disabled"}
            </span>
          </div>
          {maintenanceMode && (
            <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-red-50 text-red-600 text-xs">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>
                Maintenance mode is active. Only admin users can access the
                site.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Management</CardTitle>
          <p className="text-xs text-gray-500">
            Manage the product categories available on the platform.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="New category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button variant="outline" size="sm" className="text-xs whitespace-nowrap">
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F8F7F3] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#101114]">{cat.name}</span>
                  <Badge variant="default" className="text-[10px]">
                    {cat.slug}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
