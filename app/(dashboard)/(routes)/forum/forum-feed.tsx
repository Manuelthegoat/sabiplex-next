"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ForumCommentItem = { id: string; body: string; authorId: string; authorUsername: string; authorDisplayName: string; authorAvatarUrl: string | null; createdAt: string };
export type ForumPostItem = { id: string; title: string; body: string; authorId: string; authorUsername: string; authorDisplayName: string; authorAvatarUrl: string | null; isTeacher: boolean; createdAt: string; comments: ForumCommentItem[]; _count: { comments: number; likes: number }; likedByMe: boolean };

function timeAgo(value: string) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d ago` : new Date(value).toLocaleDateString();
}

export function ForumFeed({ initialPosts, username, displayName, avatarUrl, userId }: { initialPosts: ForumPostItem[]; username: string; displayName: string; avatarUrl: string | null; userId: string }) {
  const [posts, setPosts] = useState(initialPosts);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const createPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await axios.post<ForumPostItem>("/api/forum", { title, body });
      setPosts((current) => [{ ...data, createdAt: new Date(data.createdAt).toISOString() }, ...current]);
      setTitle(""); setBody("");
      toast.success("Post shared with the community");
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.error ?? "Could not create post" : "Could not create post");
    } finally { setBusy(false); }
  };

  const toggleLike = async (post: ForumPostItem) => {
    const previousLiked = post.likedByMe;
    const previousCount = post._count.likes;
    setPosts((items) => items.map((item) => item.id === post.id ? { ...item, likedByMe: !previousLiked, _count: { ...item._count, likes: Math.max(0, previousCount + (previousLiked ? -1 : 1)) } } : item));
    try { await axios({ method: previousLiked ? "delete" : "put", url: `/api/forum/${post.id}/like` }); }
    catch (error) {
      setPosts((items) => items.map((item) => item.id === post.id ? { ...item, likedByMe: previousLiked, _count: { ...item._count, likes: previousCount } } : item));
      toast.error(axios.isAxiosError(error) ? error.response?.data?.error ?? "Could not update reaction" : "Could not update reaction");
    }
  };

  const addComment = async (postId: string, commentBody: string, reset: () => void) => {
    try {
      const { data } = await axios.post<ForumCommentItem>(`/api/forum/${postId}/comments`, { body: commentBody });
      setPosts((items) => items.map((item) => item.id === postId ? { ...item, comments: [...item.comments, { ...data, createdAt: new Date(data.createdAt).toISOString() }].slice(-4), _count: { ...item._count, comments: item._count.comments + 1 } } : item));
      reset();
    } catch (error) { toast.error(axios.isAxiosError(error) ? error.response?.data?.error ?? "Could not add reply" : "Could not add reply"); }
  };

  const deletePost = async (postId: string) => {
    try { await axios.delete(`/api/forum/${postId}`); setPosts((items) => items.filter((item) => item.id !== postId)); toast.success("Post deleted"); }
    catch { toast.error("Could not delete post"); }
  };

  return <div className="space-y-5">
    <form onSubmit={createPost} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-1 flex items-center gap-3"><Avatar name={displayName} src={avatarUrl} size="h-10 w-10" /><div><p className="text-sm font-bold">{displayName}</p><p className="text-xs text-slate-500">@{username}</p></div></div>
      <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your post a title" minLength={4} maxLength={120} required />
      <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="What would you like to share with the community?" rows={4} minLength={10} maxLength={4000} required />
      <div className="flex items-center justify-between gap-3"><span className="text-xs text-slate-400">Posting as @{username}</span><Button disabled={busy || title.trim().length < 4 || body.trim().length < 10} className="gap-2"><Send className="h-4 w-4" />{busy ? "Posting..." : "Post"}</Button></div>
    </form>

    {posts.map((post) => <article key={post.id} id={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="flex items-start justify-between gap-4"><div className="flex min-w-0 items-center gap-3">{post.isTeacher ? <Link href={`/teachers/${post.authorId}`} aria-label={`View ${post.authorDisplayName}'s teacher profile`}><Avatar name={post.authorDisplayName} src={post.authorAvatarUrl} size="h-10 w-10" /></Link> : <Avatar name={post.authorDisplayName} src={post.authorAvatarUrl} size="h-10 w-10" />}<div>{post.isTeacher ? <Link href={`/teachers/${post.authorId}`} className="font-bold text-slate-900 hover:underline">{post.authorDisplayName}</Link> : <p className="font-bold text-slate-900">{post.authorDisplayName}</p>}<p className="text-xs text-slate-500">@{post.authorUsername} · <time dateTime={post.createdAt}>{timeAgo(post.createdAt)}</time></p></div></div>{post.authorId === userId && <button type="button" aria-label="Delete post" onClick={() => deletePost(post.id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>}</header>
      <h2 className="mt-4 text-lg font-bold text-slate-950">{post.title}</h2><p className="mt-2 whitespace-pre-line leading-7 text-slate-700">{post.body}</p>
      <div className="mt-5 flex gap-5 border-y border-slate-100 py-3 text-sm"><button type="button" onClick={() => toggleLike(post)} aria-pressed={post.likedByMe} className={`inline-flex items-center gap-2 font-semibold ${post.likedByMe ? "text-rose-600" : "text-slate-500 hover:text-rose-600"}`}><Heart className={`h-4 w-4 ${post.likedByMe ? "fill-current" : ""}`} />{post._count.likes} likes</button><span className="inline-flex items-center gap-2 text-slate-500"><MessageCircle className="h-4 w-4" />{post._count.comments} replies</span></div>
      <div className="space-y-3 pt-4">{post.comments.map((comment) => <div key={comment.id} className="flex gap-3 rounded-xl bg-slate-50 px-4 py-3"><Avatar name={comment.authorDisplayName} src={comment.authorAvatarUrl} size="h-8 w-8" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-x-3"><p className="text-sm font-bold text-slate-800">{comment.authorDisplayName} <span className="font-normal text-slate-500">@{comment.authorUsername}</span></p><time className="shrink-0 text-[11px] text-slate-400" dateTime={comment.createdAt}>{timeAgo(comment.createdAt)}</time></div><p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">{comment.body}</p></div></div>)}{post._count.comments > post.comments.length && <p className="text-xs text-slate-500">Showing recent replies</p>}</div>
      <CommentForm onSubmit={(commentBody, reset) => addComment(post.id, commentBody, reset)} />
    </article>)}
    {!posts.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><MessageCircle className="mx-auto h-8 w-8 text-slate-400" /><h2 className="mt-3 font-bold">Start the conversation</h2><p className="mt-1 text-sm text-slate-500">Your post will be the first one in the forum.</p></div>}
  </div>;
}

function Avatar({ name, src, size }: { name: string; src: string | null; size: string }) {
  return src
    ? <img src={src} alt={`${name}'s avatar`} className={`${size} shrink-0 rounded-full border border-slate-200 object-cover`} />
    : <span aria-label={`${name}'s avatar`} className={`${size} grid shrink-0 place-items-center rounded-full bg-neutral-100 font-bold text-neutral-800`}>{name.slice(0, 1).toUpperCase()}</span>;
}

function CommentForm({ onSubmit }: { onSubmit: (body: string, reset: () => void) => void }) {
  const [body, setBody] = useState("");
  return <form className="mt-4 flex items-start gap-2" onSubmit={(event) => { event.preventDefault(); if (body.trim()) onSubmit(body.trim(), () => setBody("")); }}><Input value={body} onChange={(event) => setBody(event.target.value)} maxLength={1500} placeholder="Write a reply..." aria-label="Write a reply" required /><Button type="submit" variant="outline" size="icon" aria-label="Send reply" disabled={!body.trim()}><Send className="h-4 w-4" /></Button></form>;
}
