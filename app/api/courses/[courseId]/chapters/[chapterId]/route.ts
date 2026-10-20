import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = auth();
    const course = userId && await db.course.findUnique({ where: { id: params.courseId, userId } });
    if (!course) return new NextResponse("Unauthorized", { status: 401 });
    const chapter = await db.chapter.findUnique({ where: { id: params.chapterId, courseId: params.courseId } });
    if (!chapter) return new NextResponse("Not Found", { status: 404 });
    const deleted = await db.chapter.delete({ where: { id: params.chapterId } });
    if (!await db.chapter.count({ where: { courseId: params.courseId, isPublished: true } })) await db.course.update({ where: { id: params.courseId }, data: { isPublished: false } });
    return NextResponse.json(deleted);
  } catch { return new NextResponse("Internal Error", { status: 500 }); }
}

export async function PATCH(request: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = auth();
    const course = userId && await db.course.findUnique({ where: { id: params.courseId, userId } });
    if (!course) return new NextResponse("Unauthorized", { status: 401 });
    const { isPublished: _, ...values } = await request.json();
    return NextResponse.json(await db.chapter.update({ where: { id: params.chapterId, courseId: params.courseId }, data: values }));
  } catch { return new NextResponse("Internal Error", { status: 500 }); }
}
