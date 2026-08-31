import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createListingSchema } from "@/lib/validators/schemas";
import { slugify, extractDomain } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createListingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, url, tagline, description, logoUrl, categorySlug, founderName, gstin, contactEmail, contactPhone } = parsed.data;

    const category = await db?.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const slug = slugify(name);
    const existingSlug = await db?.listing.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ error: "A listing with this name already exists" }, { status: 409 });
    }

    const listing = await db?.listing.create({
      data: {
        slug,
        name,
        url,
        tagline,
        description,
        logoUrl: logoUrl || null,
        domain: extractDomain(url),
        founderName: founderName || null,
        gstin: gstin || null,
        contactEmail,
        contactPhone: contactPhone || null,
        status: "pending",
        userId: (session.user as any).id,
        categoryId: category.id,
      },
    });

    return NextResponse.json({
      id: listing.id,
      slug: listing.slug,
      name: listing.name,
      status: "pending",
      message: "Listing submitted for review",
    }, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const status = searchParams.get("status");
    const categorySlug = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (categorySlug) where.category = { slug: categorySlug };

    const [listings, total] = await Promise.all([
      db?.listing.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          user: { select: { id: true, name: true } },
          _count: { select: { bids: true, clickEvents: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db?.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total: total || 0,
        totalPages: Math.ceil((total || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
