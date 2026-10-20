import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

async function setLike(postId: string, liked: boolean) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to react." }, { status: 401 });
  if (!(await db.userProfile.findUnique({ where: { userId }, select: { id: true } }))) return NextResponse.json({ error: "Choose a username to join the forum." }, { status: 428 });
  if (!(await db.forumPost.findUnique({ where: { id: postId }, select: { id: true } }))) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  if (liked) await db.forumLike.upsert({ where: { postId_authorId: { postId, authorId: userId } }, create: { postId, authorId: userId }, update: {} });
  else await db.forumLike.deleteMany({ where: { postId, authorId: userId } });
  const likes = await db.forumLike.count({ where: { postId } });
  return NextResponse.json({ liked, likes });
}

export async function PUT(_request: Request, { params }: { params: { postId: string } }) { return setLike(params.postId, true); }
export async function DELETE(_request: Request, { params }: { params: { postId: string } }) { return setLike(params.postId, false); }
