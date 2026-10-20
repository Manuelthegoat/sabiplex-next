import { db } from "@/lib/db";

export async function notifyUser({ recipientId, actorId, type, message, href }: {
  recipientId: string;
  actorId: string;
  type: string;
  message: string;
  href: string;
}) {
  if (recipientId === actorId) return;
  try {
    const profile = await db.userProfile.findUnique({
      where: { userId: actorId },
      select: { username: true, displayName: true, avatarUrl: true },
    });
    await db.notification.create({
      data: {
        recipientId,
        actorId,
        actorName: profile?.displayName || profile?.username || "A Sabiplex learner",
        actorAvatarUrl: profile?.avatarUrl,
        type,
        message,
        href,
      },
    });
  } catch (error) {
    console.error("[NOTIFICATION_CREATE]", error);
  }
}

export async function notifyTeacherFollowers({ teacherId, message, href }: {
  teacherId: string;
  message: string;
  href: string;
}) {
  try {
    const followers = await db.teacherFollow.findMany({ where: { teacherId }, select: { followerId: true } });
    await Promise.all(followers.map(({ followerId }) => notifyUser({
      recipientId: followerId,
      actorId: teacherId,
      type: "TEACHER_UPDATE",
      message,
      href,
    })));
  } catch (error) {
    console.error("[TEACHER_FOLLOWER_NOTIFICATION]", error);
  }
}
