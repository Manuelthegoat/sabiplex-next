import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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
