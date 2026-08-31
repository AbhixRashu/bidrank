// @ts-nocheck
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding IndBid database...");

  // Create categories
  const categories = [
    { name: "AI & SaaS", slug: "ai-saas", icon: "Brain", sortOrder: 1 },
    { name: "Startups", slug: "startups", icon: "Rocket", sortOrder: 2 },
    { name: "Developer Tools", slug: "developer-tools", icon: "Terminal", sortOrder: 3 },
    { name: "Marketing", slug: "marketing", icon: "Megaphone", sortOrder: 4 },
    { name: "Agencies", slug: "agencies", icon: "Building2", sortOrder: 5 },
    { name: "Hiring", slug: "hiring", icon: "Users", sortOrder: 6 },
    { name: "Fintech", slug: "fintech", icon: "Wallet", sortOrder: 7 },
    { name: "D2C & Ecommerce", slug: "d2c-ecommerce", icon: "ShoppingBag", sortOrder: 8 },
    { name: "Education", slug: "education", icon: "GraduationCap", sortOrder: 9 },
    { name: "Health & Wellness", slug: "health-wellness", icon: "Heart", sortOrder: 10 },
    { name: "Real Estate", slug: "real-estate", icon: "Home", sortOrder: 11 },
    { name: "Creator Economy", slug: "creator-economy", icon: "Video", sortOrder: 12 },
    { name: "Productivity", slug: "productivity", icon: "Zap", sortOrder: 13 },
    { name: "Design", slug: "design", icon: "Palette", sortOrder: 14 },
    { name: "Communities", slug: "communities", icon: "MessageCircle", sortOrder: 15 },
    { name: "Other", slug: "other", icon: "MoreHorizontal", sortOrder: 16 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@indbid.in" },
    update: {},
    create: {
      email: "demo@indbid.in",
      name: "Demo User",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Created demo user");

  // Create demo listings
  const listings = [
    {
      slug: "seo-io",
      name: "SEO.io — Free Online SEO Tools",
      url: "https://seo-io.com/",
      tagline: "Free Online SEO Tools to boost search visibility & rankings",
      description: "Comprehensive suite of free online SEO tools including keyword research, backlink checker, meta tag generator, and site audit analyzers.",
      categorySlug: "marketing",
      bidAmount: 4001,
      clicks: 42,
      verified: true,
    },
    {
      slug: "salarypitcher",
      name: "SalaryPitcher",
      url: "https://salarypitcher.com",
      tagline: "Compare tech salaries and pitch your true market worth",
      description: "Transparent salary insights, compensation benchmarks, and negotiation tools for tech professionals in India and worldwide.",
      categorySlug: "hiring",
      bidAmount: 3999,
      clicks: 31,
      verified: true,
    },
    {
      slug: "indbid",
      name: "IndBid",
      url: "https://indbid.lol",
      tagline: "India's live bid-to-rank leaderboard for products that want to be seen",
      description: "A transparent live attention leaderboard where products claim their spot in real-time with verified INR payments.",
      categorySlug: "startups",
      bidAmount: 1889,
      clicks: 19,
      verified: true,
    },
  ];

  // Clean old listings & bids if any to ensure clean ranking
  await prisma.clickEvent.deleteMany({});
  await prisma.bid.deleteMany({});
  await prisma.rankSnapshot.deleteMany({});
  await prisma.moderationCase.deleteMany({});
  await prisma.weeklyChampion.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.refund.deleteMany({});
  await prisma.listing.deleteMany({});

  for (const listing of listings) {
    const category = await prisma.category.findUnique({ where: { slug: listing.categorySlug } });
    if (!category) continue;

    const dbListing = await prisma.listing.create({
      data: {
        slug: listing.slug,
        name: listing.name,
        url: listing.url,
        tagline: listing.tagline,
        description: listing.description,
        domain: new URL(listing.url).hostname,
        status: "approved",
        verifiedAt: new Date(),
        contactEmail: "demo@indbid.in",
        userId: user.id,
        categoryId: category.id,
      },
    });

    // Create bid
    await prisma.bid.create({
      data: {
        amount: listing.bidAmount,
        status: "activated",
        idempotencyKey: `seed-${listing.slug}-${Date.now()}`,
        paymentStatus: "captured",
        paymentVerified: true,
        verifiedAt: new Date(),
        activatedAt: new Date(),
        userId: user.id,
        listingId: dbListing.id,
      },
    });

    // Create realistic ClickEvents
    const clickCount = listing.clicks;
    const clickData = [];
    const now = Date.now();
    for (let i = 0; i < clickCount; i++) {
      // spread clicks over the last 24 hours
      const timestamp = new Date(now - Math.floor(Math.random() * 24 * 60 * 60 * 1000));
      clickData.push({
        listingId: dbListing.id,
        referrer: "https://google.com",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        country: "IN",
        state: "Karnataka",
        isBot: false,
        createdAt: timestamp,
      });
    }

    if (clickData.length > 0) {
      await prisma.clickEvent.createMany({
        data: clickData,
      });
    }
  }
  console.log(`✅ Created ${listings.length} demo listings with bids and clicks`);

  // Set system config
  await prisma.systemConfig.upsert({
    where: { key: "min_increment_under_1000" },
    update: {},
    create: { key: "min_increment_under_1000", value: "1" },
  });
  await prisma.systemConfig.upsert({
    where: { key: "min_increment_1000_9999" },
    update: {},
    create: { key: "min_increment_1000_9999", value: "10" },
  });
  await prisma.systemConfig.upsert({
    where: { key: "min_increment_10000_99999" },
    update: {},
    create: { key: "min_increment_10000_99999", value: "100" },
  });
  await prisma.systemConfig.upsert({
    where: { key: "min_increment_above_100000" },
    update: {},
    create: { key: "min_increment_above_100000", value: "1000" },
  });
  console.log("✅ Created system config");

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

