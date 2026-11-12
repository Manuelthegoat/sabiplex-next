import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getCourses } from "@/actions/get-courses";

export async function GET(req: Request) {
  const { userId } = auth();
  const sp = new URL(req.url).searchParams;
  const courses = await getCourses({
    userId: userId ?? undefined,
    title: sp.get("title") || undefined,
    categoryId: sp.get("categoryId") || undefined,
  });
  return NextResponse.json(courses);
}