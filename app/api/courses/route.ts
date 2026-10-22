import { db } from "@/lib/db";
import { hasTeacherAccess } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCourses } from "@/actions/get-courses";

export async function GET(request: Request) {
  const { userId } = auth();
  const { searchParams } = new URL(request.url);
  const courses = await getCourses({
    userId: userId ?? undefined,
    title: searchParams.get("title") ?? undefined,
    categoryId: searchParams.get("categoryId") ?? undefined,
  });
  const profiles = await db.userProfile.findMany({ where: { userId: { in: Array.from(new Set(courses.map((course) => course.userId))) } }, select: { userId: true, username: true, displayName: true } });
  const names = new Map(profiles.map((profile) => [profile.userId, profile.displayName || profile.username]));
  return NextResponse.json(courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    price: course.price,
    categoryId: course.categoryId,
    category: course.category?.name ?? null,
    teacherId: course.userId,
    teacherName: names.get(course.userId) ?? "Sabiplex Teacher",
    progress: course.progress,
    chapterCount: course.chapters.length,
    rating: course.reviews.length
      ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
      : null,
    reviewCount: course.reviews.length,
    purchased: course.purchases.length > 0,
  })));
}

export async function POST(req: Request) {
  try {
  const { userId } = auth();
    const {title} = await req.json()

    if (!userId || !(await hasTeacherAccess(userId))) {
        return new NextResponse("Unauthorized", {status: 401})
    }
    const course = await db.course.create({
        data: {
            userId,
            title,
        }
    })
    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
