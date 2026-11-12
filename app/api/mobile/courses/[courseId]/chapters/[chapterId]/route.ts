import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const chapter = await db.chapter.findFirst({
    where: { id: params.chapterId, courseId: params.courseId, isPublished: true, course: { isPublished: true } },
    include: { muxData: true },
  });
  if (!chapter) return new NextResponse("Not found", { status: 404 });

  const purchase = await db.purchase.findUnique({
    where: { userId_courseId: { userId, courseId: params.courseId } },
  });
  if (!chapter.isFree && !purchase) return new NextResponse("Locked", { status: 403 });

  const progress = await db.userProgress.findUnique({
    where: { userId_chapterId: { userId, chapterId: chapter.id } },
  });

  return NextResponse.json({
    id: chapter.id,
    title: chapter.title,
    description: chapter.description,
    playbackId: chapter.muxData?.playbackId ?? null,
    isCompleted: !!progress?.isCompleted,
  });
}