"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShieldCheck,
  Receipt,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/moderation", label: "Moderation", icon: ShieldCheck },
  { href: "/admin/bids", label: "Bids Ledger", icon: Receipt },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F8F7F3]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E6E4DF] flex flex-col transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E6E4DF]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#101114] text-white flex items-center justify-center text-xs font-bold">
              IB
            </div>
            <div>
              <p className="text-sm font-semibold text-[#101114]">IndBid</p>
              <p className="text-[10px] text-gray-500">Admin Console</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#101114] text-white"
                    : "text-gray-600 hover:bg-[#F8F7F3] hover:text-[#101114]"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#E6E4DF]">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-[#F8F7F3] hover:text-[#101114] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E6E4DF] lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#101114] text-white flex items-center justify-center text-[10px] font-bold">
              IB
            </div>
            <span className="text-sm font-semibold text-[#101114]">
              Admin
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
