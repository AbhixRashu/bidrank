import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/utils/categories";
import { db } from "@/lib/db";
import {
  Brain,
  Rocket,
  Terminal,
  Megaphone,
  Building2,
  Users,
  Wallet,
  ShoppingBag,
  GraduationCap,
  Heart,
  Home,
  Video,
  Zap,
  Palette,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse all 16 product categories on BidRank. Find the best products in AI, Fintech, SaaS, Startups, and more.",
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Rocket,
  Terminal,
  Megaphone,
  Building2,
  Users,
  Wallet,
  ShoppingBag,
  GraduationCap,
  Heart,
  Home,
  Video,
  Zap,
  Palette,
  MessageCircle,
  MoreHorizontal,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "ai-saas": "AI-powered tools and SaaS products",
  startups: "Early-stage startups and new ventures",
  "developer-tools": "Tools built by developers, for developers",
  marketing: "Marketing platforms and agencies",
  agencies: "Design, dev, and marketing agencies",
  hiring: "Recruitment and HR tech platforms",
  fintech: "Payments, banking, and financial services",
  "d2c-ecommerce": "Direct-to-consumer and ecommerce brands",
  education: "EdTech and learning platforms",
  "health-wellness": "Healthcare, fitness, and wellness apps",
  "real-estate": "Property tech and real estate platforms",
  "creator-economy": "Tools for creators and influencers",
  productivity: "Project management and productivity tools",
  design: "Design tools and services",
  communities: "Developer and tech communities",
  other: "Everything else",
};

export default async function CategoriesPage() {
  let countMap = new Map<string, number>();
  try {
    const counts = await Promise.all(
      CATEGORIES.map(async (cat) => ({
        slug: cat.slug,
        count: await db.listing.count({
          where: { category: { slug: cat.slug }, status: "approved" },
        }),
      }))
    );
    countMap = new Map(counts.map((c) => [c.slug, c.count]));
  } catch {
    countMap = new Map();
  }

  return (
    <>
      <section className="bg-[#F8F7F3] border-b border-[#E6E4DF]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <p className="text-xs font-semibold text-[#FF8A00] uppercase tracking-wider mb-3">
            Explore
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#101114] leading-[1.1] mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Discover Indian products across 16 categories. Find what matters
            to you.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const IconComponent = ICON_MAP[cat.icon] || MoreHorizontal;
              const count = countMap.get(cat.slug) ?? 0;

              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group rounded-xl border border-[#E6E4DF] bg-white p-5 hover:border-[#FF8A00]/30 hover:shadow-sm transition-all"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F7F3] group-hover:bg-[#FF8A00]/10 transition-colors mb-4">
                    <IconComponent className="h-6 w-6 text-[#101114] group-hover:text-[#FF8A00] transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#101114] mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {CATEGORY_DESCRIPTIONS[cat.slug] || ""}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#101114]">{count}</span>
                    <span className="text-xs text-gray-400">
                      {count === 1 ? "listing" : "listings"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
