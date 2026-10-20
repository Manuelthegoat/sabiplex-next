import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { hasTeacherAccess, isTeacherAdmin } from "@/lib/teacher";
import { redirect } from "next/navigation";
import { TeacherModePanel } from "./teacher-mode-panel";

export default async function TeacherModePage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Fteacher-mode");
  const [hasAccess, application] = await Promise.all([
    hasTeacherAccess(userId),
    db.teacherApplication.findUnique({ where: { userId }, select: { status: true } }),
  ]);

  return (
    <div className="page-shell min-h-full p-5 md:p-8">
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">Teach on Sabiplex</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Choose your teaching mode</h1>
        <p className="mt-2 text-slate-600">Teach a course, or keep learning from your library.</p>
        <div className="mt-7">
          <TeacherModePanel isTeacher={hasAccess} isAdmin={isTeacherAdmin(userId)} applicationStatus={application?.status ?? null} />
        </div>
      </div>
    </div>
  );
}
