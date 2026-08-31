import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const rlKey = getRateLimitKey(request, "signup");
    const rl = rateLimit(rlKey, 5, 60000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const existingUser = await db?.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const user = await db?.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        passwordHash: await hash(password, 12),
        emailVerified: new Date(),
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
