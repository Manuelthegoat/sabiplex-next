import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const postSchema = z.object({ title: z.string().trim().min(4).max(120), body: z.string().trim().min(10).max(4000) });

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to view the forum." }, { status: 401 });
  const profile = await db.userProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!profile) return NextResponse.json({ error: "Choose a username to join the forum." }, { status: 428 });

  const posts = await db.forumPost.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, body: true, authorId: true, authorUsername: true, createdAt: true,
      _count: { select: { comments: true, likes: true } },
      comments: { take: 4, orderBy: { createdAt: "asc" }, select: { id: true, body: true, authorId: true, authorUsername: true, createdAt: true } },
      likes: { where: { authorId: userId }, select: { id: true }, take: 1 },
    },
  });
  return NextResponse.json(posts.map(({ likes, ...post }) => ({ ...post, likedByMe: likes.length > 0 })));
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to post." }, { status: 401 });
  const profile = await db.userProfile.findUnique({ where: { userId }, select: { username: true } });
  if (!profile) return NextResponse.json({ error: "Choose a username to post." }, { status: 428 });
  const parsed = postSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid post." }, { status: 400 });
  const post = await db.forumPost.create({ data: { ...parsed.data, authorId: userId, authorUsername: profile.username } });
  return NextResponse.json({ ...post, comments: [], _count: { comments: 0, likes: 0 }, likedByMe: false }, { status: 201 });
}
