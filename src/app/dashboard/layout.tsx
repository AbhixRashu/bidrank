"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Gavel,
  Receipt,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "My Listings", icon: Package },
  { href: "/dashboard/bids", label: "Bid History", icon: Gavel },
  { href: "/dashboard/billing", label: "Billing", icon: Receipt },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8F7F3]">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-[#E6E4DF] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-[#F8F7F3] transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="text-sm font-semibold text-[#101114]">Dashboard</span>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={cn(
              "fixed lg:sticky top-0 lg:top-24 z-40 lg:z-auto",
              "inset-y-0 left-0 lg:inset-auto",
              "w-64 lg:w-56 shrink-0",
              "bg-white lg:bg-transparent border-r lg:border-r-0 border-[#E6E4DF] lg:border-none",
              "transform transition-transform duration-200 ease-in-out lg:transform-none",
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
          >
            <div className="lg:hidden pt-16 px-4 pb-2">
              <span className="text-sm font-semibold text-[#101114]">Dashboard</span>
            </div>
            <nav className="p-4 lg:p-0 lg:sticky lg:top-24 space-y-1">
              {sidebarLinks.map((link) => {
                const isActive =
                  link.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#101114] text-white shadow-sm"
                        : "text-gray-600 hover:text-[#101114] hover:bg-white"
                    )}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {link.label}
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                    )}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-[#E6E4DF]">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-[#101114] hover:bg-white transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Back to site
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
