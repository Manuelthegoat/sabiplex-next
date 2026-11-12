import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";

export async function GET() {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });
  return NextResponse.json(await getDashboardCourses(userId));
}