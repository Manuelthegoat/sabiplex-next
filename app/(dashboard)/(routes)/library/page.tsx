import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { Archive, CheckCircle2, Clock3, LibraryBig } from "lucide-react";
import { redirect } from "next/navigation";

export default async function LearningLibraryPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);
  const total = completedCourses.length + coursesInProgress.length;

  return (
    <div className="page-shell min-h-full p-5 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl bg-gradient-to-br from-neutral-700 via-neutral-600 to-neutral-600 p-7 text-white shadow-xl shadow-neutral-200 md:p-9">
          <div className="flex items-center gap-2 text-neutral-100"><LibraryBig className="h-4 w-4" /><span className="text-sm font-semibold">Your learning library</span></div>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">All your courses, in one place.</h1>
          <p className="mt-2 max-w-xl text-neutral-100">Continue a lesson or revisit a course you have completed.</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold"><Archive className="h-4 w-4" />{total} {total === 1 ? "course" : "courses"}</p>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2"><Clock3 className="h-5 w-5 text-neutral-600" /><h2 className="text-2xl font-bold">In progress</h2><span className="text-sm text-slate-500">{coursesInProgress.length}</span></div>
          <CoursesList items={coursesInProgress} />
        </section>
        <section>
          <div className="mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><h2 className="text-2xl font-bold">Completed</h2><span className="text-sm text-slate-500">{completedCourses.length}</span></div>
          <CoursesList items={completedCourses} />
        </section>
      </div>
    </div>
  );
}
