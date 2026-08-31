"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, TrendingUp, ChevronDown, User, LogOut, LayoutDashboard, List, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveVisitors } from "@/components/live-visitors";
import { useSound } from "@/hooks/use-sound";

const navLinks = [
  { href: "/#leaderboard", label: "All-time" },
  { href: "/today", label: "Today" },
  { href: "/categories", label: "Categories" },
  { href: "/how-it-works", label: "How it works" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isMuted, toggleMute } = useSound();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#E6E4DF] shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-[#FF8A00]">
                Ind
              </span>
              <span className="text-xl font-bold tracking-tight text-[#101114]">
                Bid
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#101114] transition-colors rounded-lg hover:bg-[#F8F7F3]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#138A4B]/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#138A4B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#138A4B]"></span>
              </span>
              <span className="text-xs font-medium text-[#138A4B]">Live bids</span>
            </div>
            <LiveVisitors />
          </div>

          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-[#F8F7F3] transition-colors text-gray-500 hover:text-[#101114]"
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <Link href="/claim" className="hidden sm:inline-flex">
            <Button variant="saffron" size="sm">
              List your product
            </Button>
          </Link>

          {session && (
            <div className="hidden sm:block relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#F8F7F3] transition-colors"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-[#FF8A00]/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-[#FF8A00]" />
                  </div>
                )}
                <span className="text-sm font-medium text-[#101114] max-w-[120px] truncate">
                  {session.user?.name || session.user?.email?.split("@")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-[#E6E4DF] bg-white py-1.5 shadow-lg z-50">
                  <div className="px-4 py-2 border-b border-[#E6E4DF]">
                    <p className="text-sm font-medium text-[#101114] truncate">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#F8F7F3] hover:text-[#101114] transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/listings"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#F8F7F3] hover:text-[#101114] transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <List className="h-4 w-4" />
                    My Listings
                  </Link>
                  <div className="my-1.5 border-t border-[#E6E4DF]" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-[#F8F7F3] hover:text-[#101114] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#F8F7F3]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E6E4DF] bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-[#101114] rounded-lg hover:bg-[#F8F7F3]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/claim" onClick={() => setMobileOpen(false)}>
                <Button variant="saffron" className="w-full">
                  List your product
                </Button>
              </Link>
              {session && (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
