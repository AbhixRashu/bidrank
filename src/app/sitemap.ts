import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/utils/categories";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bidrank.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${BASE_URL}/rules`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/today`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${BASE_URL}/claim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  let listingPages: MetadataRoute.Sitemap = [];
  try {
    const listings = await db?.listing.findMany({
      where: { status: "approved" },
      select: { slug: true, updatedAt: true },
    });
    listingPages = (listings ?? []).map((l) => ({
      url: `${BASE_URL}/listing/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available, skip listing pages
  }

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...listingPages];
}
