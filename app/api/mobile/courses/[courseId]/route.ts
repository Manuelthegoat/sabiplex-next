import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { courseId: string } }) {
  const { userId } = auth();
  const course = await db.course.findUnique({
    where: { id: params.courseId, isPublished: true },
    include: {
      category: true,
      reviews: { select: { rating: true } },
      chapters: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
        select: { id: true, title: true, description: true, position: true, isFree: true },
      },
    },
  });
  if (!course) return new NextResponse("Not found", { status: 404 });

  const purchase = userId
    ? await db.purchase.findUnique({ where: { userId_courseId: { userId, courseId: course.id } } })
    : null;
  const done = userId
    ? await db.userProgress.findMany({
        where: { userId, isCompleted: true, chapterId: { in: course.chapters.map((c) => c.id) } },
        select: { chapterId: true },
      })
    : [];

  return NextResponse.json({ ...course, purchased: !!purchase, completedChapterIds: done.map((d) => d.chapterId) });
}