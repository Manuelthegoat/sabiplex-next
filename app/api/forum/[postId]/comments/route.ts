import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const commentSchema = z.object({ body: z.string().trim().min(1).max(1500) });

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to reply." }, { status: 401 });
  const profile = await db.userProfile.findUnique({ where: { userId }, select: { username: true } });
  if (!profile) return NextResponse.json({ error: "Choose a username to reply." }, { status: 428 });
  const parsed = commentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid reply." }, { status: 400 });
  const exists = await db.forumPost.findUnique({ where: { id: params.postId }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  const comment = await db.forumComment.create({ data: { ...parsed.data, postId: params.postId, authorId: userId, authorUsername: profile.username } });
  return NextResponse.json(comment, { status: 201 });
}
