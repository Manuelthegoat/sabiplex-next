import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(60),
  avatarUrl: z.string().trim().max(1000).optional().default(""),
}).superRefine((values, context) => {
  if (!values.avatarUrl) return;
  try {
    if (new URL(values.avatarUrl).protocol !== "https:") throw new Error("https required");
  } catch {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["avatarUrl"], message: "Choose a valid uploaded avatar." });
  }
});

export async function PATCH(request: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid profile." }, { status: 400 });
  const profile = await db.userProfile.updateMany({
    where: { userId },
    data: { displayName: parsed.data.displayName, avatarUrl: parsed.data.avatarUrl || null },
  });
  if (profile.count === 0) return NextResponse.json({ error: "Set up your username first." }, { status: 404 });
  return NextResponse.json({ displayName: parsed.data.displayName, avatarUrl: parsed.data.avatarUrl || null });
}
