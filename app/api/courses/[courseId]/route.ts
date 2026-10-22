import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { courseId: string } }) {
  const { userId } = auth();
  const existing = await db.course.findUnique({ where: { id: params.courseId }, select: { userId: true, isPublished: true } });
  if (!existing || (!existing.isPublished && existing.userId !== userId)) return new NextResponse("Not found", { status: 404 });
  const isOwner = existing.userId === userId;
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      category: true,
      chapters: {
        where: isOwner ? undefined : { isPublished: true },
        orderBy: { position: "asc" },
        include: { muxData: { select: { playbackId: true } }, quiz: { include: { questions: { orderBy: { position: "asc" } } } }, assignment: true },
      },
      reviews: { select: { rating: true, comment: true, createdAt: true } },
    },
  });
  if (!course) return new NextResponse("Not found", { status: 404 });
  const purchase = userId ? await db.purchase.findUnique({ where: { userId_courseId: { userId, courseId: course.id } }, select: { id: true } }) : null;
  const teacherProfile = await db.userProfile.findUnique({ where: { userId: course.userId }, select: { username: true, displayName: true } });
  const enrolled = isOwner || !!purchase;
  return NextResponse.json({
    id: course.id, title: course.title, description: course.description, imageUrl: course.imageUrl,
    price: course.price, category: course.category?.name ?? null, categoryId: course.categoryId,
    teacherId: course.userId, isPublished: course.isPublished, enrolled, isOwner,
    teacherName: teacherProfile?.displayName || teacherProfile?.username || "Sabiplex Teacher",
    chapters: course.chapters.map((chapter) => ({
      id: chapter.id, title: chapter.title, description: chapter.description, position: chapter.position,
      isPublished: chapter.isPublished, isFree: chapter.isFree,
      videoUrl: enrolled || chapter.isFree ? chapter.videoUrl : null,
      playbackId: enrolled || chapter.isFree ? chapter.muxData?.playbackId ?? null : null,
      quiz: chapter.quiz ? { id: chapter.quiz.id, title: chapter.quiz.title, passPercent: chapter.quiz.passPercent, questions: chapter.quiz.questions.map(({ correctIndex: _correctIndex, ...question }) => question) } : null,
      assignment: chapter.assignment ? { id: chapter.assignment.id, title: chapter.assignment.title, instructions: chapter.assignment.instructions } : null,
    })),
    reviews: course.reviews,
    rating: course.reviews.length ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length : null,
  });
}

export async function DELETE(_: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const course = await db.course.findUnique({ where: { id: params.courseId, userId } });
    if (!course) return new NextResponse("Not Found", { status: 404 });
    return NextResponse.json(await db.course.delete({ where: { id: params.courseId } }));
  } catch { return new NextResponse("Internal Error", { status: 500 }); }
}

export async function PATCH(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const values = await request.json();
    return NextResponse.json(await db.course.update({ where: { id: params.courseId, userId }, data: values }));
  } catch { return new NextResponse("Internal Error", { status: 500 }); }
}
