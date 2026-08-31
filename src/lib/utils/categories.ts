export const CATEGORIES = [
  { name: "AI & SaaS", slug: "ai-saas", icon: "Brain" },
  { name: "Startups", slug: "startups", icon: "Rocket" },
  { name: "Developer Tools", slug: "developer-tools", icon: "Terminal" },
  { name: "Marketing", slug: "marketing", icon: "Megaphone" },
  { name: "Agencies", slug: "agencies", icon: "Building2" },
  { name: "Hiring", slug: "hiring", icon: "Users" },
  { name: "Fintech", slug: "fintech", icon: "Wallet" },
  { name: "D2C & Ecommerce", slug: "d2c-ecommerce", icon: "ShoppingBag" },
  { name: "Education", slug: "education", icon: "GraduationCap" },
  { name: "Health & Wellness", slug: "health-wellness", icon: "Heart" },
  { name: "Real Estate", slug: "real-estate", icon: "Home" },
  { name: "Creator Economy", slug: "creator-economy", icon: "Video" },
  { name: "Productivity", slug: "productivity", icon: "Zap" },
  { name: "Design", slug: "design", icon: "Palette" },
  { name: "Communities", slug: "communities", icon: "MessageCircle" },
  { name: "Other", slug: "other", icon: "MoreHorizontal" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryIcon(slug: string) {
  const cat = getCategoryBySlug(slug);
  return cat?.icon || "Tag";
}
