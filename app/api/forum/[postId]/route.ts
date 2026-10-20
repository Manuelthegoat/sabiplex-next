import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(_request: Request, { params }: { params: { postId: string } }) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  const post = await db.forumPost.findUnique({ where: { id: params.postId }, select: { authorId: true } });
  if (!post) return new NextResponse("Not found", { status: 404 });
  if (post.authorId !== userId) return new NextResponse("Forbidden", { status: 403 });
  await db.forumPost.delete({ where: { id: params.postId } });
  return new NextResponse(null, { status: 204 });
}
