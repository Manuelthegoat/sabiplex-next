import { db } from "@/lib/db";

const getConfiguredTeacherIds = () =>
  (process.env.NEXT_PUBLIC_TEACHER_ID ?? "")
    .split(/[\s,;]+/)
    .filter(Boolean);

// These configured accounts remain the admins who can grant teacher access.
export const isTeacherAdmin = (userId?: string | null) =>
  !!userId && getConfiguredTeacherIds().includes(userId);

export const isTeacher = isTeacherAdmin;

export const hasTeacherAccess = async (userId?: string | null) => {
  if (!userId) return false;
  if (isTeacherAdmin(userId)) return true;

  const role = await db.teacherRole.findUnique({
    where: { userId },
    select: { id: true },
  });
  return !!role;
};
