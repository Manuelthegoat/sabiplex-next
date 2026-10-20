import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ForumFeed, type ForumPostItem } from "./forum-feed";

export default async function ForumPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const profile = await db.userProfile.findUnique({ where: { userId }, select: { username: true } });
  if (!profile) redirect("/profile/setup");

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
  const initialPosts: ForumPostItem[] = posts.map(({ likes, ...post }) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    comments: post.comments.map((comment) => ({ ...comment, createdAt: comment.createdAt.toISOString() })),
    likedByMe: likes.length > 0,
  }));

  return <main className="page-shell min-h-full px-5 py-8 md:px-8 md:py-12"><div className="mx-auto max-w-3xl"><p className="eyebrow">Sabiplex community</p><h1 className="mt-1 text-3xl font-black tracking-tight">Forum</h1><p className="mt-2 text-slate-600">Share ideas, ask questions, and learn together. You’re posting as <strong>@{profile.username}</strong>.</p><div className="mt-7"><ForumFeed initialPosts={initialPosts} username={profile.username} userId={userId} /></div></div></main>;
}
