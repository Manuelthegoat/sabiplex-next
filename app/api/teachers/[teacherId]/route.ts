import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { teacherId: string } }) {
  const [profile, teacher, courses, followerCount] = await Promise.all([
    db.userProfile.findUnique({ where: { userId: params.teacherId }, select: { username: true, displayName: true, avatarUrl: true } }),
    db.teacherProfile.findUnique({ where: { userId: params.teacherId }, select: { headline: true, bio: true, expertise: true, websiteUrl: true, linkedinUrl: true } }),
    db.course.findMany({ where: { userId: params.teacherId, isPublished: true }, select: { id: true, title: true, description: true, imageUrl: true, price: true, category: { select: { name: true } }, _count: { select: { purchases: true, reviews: true } } } }),
    db.teacherFollow.count({ where: { teacherId: params.teacherId } }),
  ]);
  if (!profile || !courses.length) return new NextResponse("Teacher not found", { status: 404 });
  return NextResponse.json({ ...profile, ...teacher, teacherId: params.teacherId, followerCount, courses });
}
