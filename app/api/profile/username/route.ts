import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const usernameSchema = z.object({ username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/, "Use 3–20 letters, numbers, or underscores.") });

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to choose a username." }, { status: 401 });
  if (await db.userProfile.findUnique({ where: { userId }, select: { id: true } })) {
    return NextResponse.json({ error: "Your username is already set." }, { status: 409 });
  }

  const parsed = usernameSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid username." }, { status: 400 });
  try {
    const profile = await db.userProfile.create({ data: { userId, username: parsed.data.username } });
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "That username is already taken. Try another." }, { status: 409 });
    }
    throw error;
  }
}
