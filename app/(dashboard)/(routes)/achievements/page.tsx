import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Award, BookOpenCheck, Brain, ClipboardCheck, GraduationCap, MessageSquare, Sparkles, Target } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AchievementsPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const [lessonsCompleted, quizzesPassed, quizAttempts, assignmentsSubmitted, plexxesMade, dashboard] = await Promise.all([
    db.userProgress.count({ where: { userId, isCompleted: true, chapter: { isPublished: true } } }),
    db.quizAttempt.count({ where: { userId, passed: true } }),
    db.quizAttempt.count({ where: { userId } }),
    db.assignmentSubmission.count({ where: { userId } }),
    db.forumPost.count({ where: { authorId: userId } }),
    getDashboardCourses(userId),
  ]);
  const completedCourses = dashboard.completedCourses.length;
  const badges = [
    { name: "First Step", description: "Complete your first lesson.", current: lessonsCompleted, target: 1, icon: BookOpenCheck },
    { name: "Lesson Explorer", description: "Complete 10 lessons.", current: lessonsCompleted, target: 10, icon: Target },
    { name: "Quiz Pass", description: "Pass your first chapter quiz.", current: quizzesPassed, target: 1, icon: Brain },
    { name: "Quiz Champion", description: "Pass five chapter quizzes.", current: quizzesPassed, target: 5, icon: Sparkles },
    { name: "Assignment Submitted", description: "Submit your first written assignment.", current: assignmentsSubmitted, target: 1, icon: ClipboardCheck },
    { name: "Make 3 Plexxes", description: "Create three posts in the Sabiplex forum.", current: plexxesMade, target: 3, icon: MessageSquare },
    { name: "Course Graduate", description: "Complete a full course and earn a certificate.", current: completedCourses, target: 1, icon: GraduationCap },
    { name: "Lifelong Learner", description: "Complete three full courses.", current: completedCourses, target: 3, icon: Award },
  ];
  const earnedCount = badges.filter((badge) => badge.current >= badge.target).length;

  return (
    <main className="page-shell min-h-full p-5 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="rounded-3xl bg-gradient-to-br from-neutral-700 via-neutral-600 to-neutral-600 p-7 text-white shadow-xl shadow-neutral-200 md:p-9">
          <p className="text-sm font-semibold text-neutral-100">Your progress, celebrated</p>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">Achievements</h1>
          <p className="mt-2 text-neutral-100">You have earned {earnedCount} of {badges.length} achievements.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => {
            const earned = badge.current >= badge.target;
            const Icon = badge.icon;
            return <article key={badge.name} className={"rounded-2xl border bg-white p-5 shadow-sm " + (earned ? "border-neutral-200" : "border-slate-200 opacity-80")}>
              <div className="flex items-start justify-between gap-3">
                <span className={"grid h-12 w-12 place-items-center rounded-xl " + (earned ? "bg-neutral-100 text-neutral-700" : "bg-slate-100 text-slate-400")}><Icon className="h-6 w-6" /></span>
                {earned && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Earned</span>}
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">{badge.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{badge.description}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-neutral-600" style={{ width: Math.min(100, badge.current / badge.target * 100) + "%" }} /></div>
              <p className="mt-2 text-xs font-medium text-slate-500">{Math.min(badge.current, badge.target)} / {badge.target}</p>
            </article>;
          })}
        </section>
        <p className="text-sm text-slate-500">Quiz attempts: {quizAttempts}. Completed courses also unlock downloadable certificates from your learning library.</p>
      </div>
    </main>
  );
}
