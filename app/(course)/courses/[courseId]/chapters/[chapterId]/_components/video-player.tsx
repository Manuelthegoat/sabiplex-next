"use client";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
interface VideoPlayerProps { videoUrl?: string; courseId: string; chapterId: string; nextChapterId?: string; isLocked: boolean; completeOnEnd: boolean; title: string; }
export function VideoPlayer({ videoUrl, courseId, chapterId, nextChapterId, isLocked, completeOnEnd, title }: VideoPlayerProps) {
  const [ready, setReady] = useState(false); const router = useRouter(); const confetti = useConfettiStore();
  async function onEnd() { try { if (!completeOnEnd) return; await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isCompleted: true }); if (!nextChapterId) confetti.onOpen(); toast.success("Progress updated"); router.refresh(); if (nextChapterId) router.push(`/courses/${courseId}/chapters/${nextChapterId}`); } catch { toast.error("Could not update progress"); } }
  return <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-950 shadow-xl">{!ready && !isLocked && <div className="absolute inset-0 z-10 grid place-items-center bg-slate-950 text-center text-sm text-slate-300"><div><Loader2 className="mx-auto h-7 w-7 animate-spin text-neutral-300" /><p className="mt-3">Preparing your lesson</p></div></div>}{isLocked ? <div className="absolute inset-0 grid place-items-center text-center text-slate-200"><div><Lock className="mx-auto h-8 w-8" /><p className="mt-3 text-sm">This chapter is locked</p></div></div> : videoUrl ? <video className="h-full w-full object-contain" controls autoPlay playsInline title={title} onCanPlay={() => setReady(true)} onEnded={onEnd} src={videoUrl} /> : <div className="grid h-full place-items-center text-sm text-slate-400">This lesson has no video yet.</div>}</div>;
}
