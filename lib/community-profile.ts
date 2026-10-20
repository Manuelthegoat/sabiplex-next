import { db } from "@/lib/db";

export type CommunityIdentity = { displayName: string; avatarUrl: string | null };

export async function getCommunityIdentities(userIds: string[]) {
  const uniqueIds = userIds.filter((id, index, values) => values.indexOf(id) === index);
  if (uniqueIds.length === 0) return {} as Record<string, CommunityIdentity>;
  const profiles = await db.userProfile.findMany({
    where: { userId: { in: uniqueIds } },
    select: { userId: true, username: true, displayName: true, avatarUrl: true },
  });
  const identities: Record<string, CommunityIdentity> = {};
  profiles.forEach((profile) => {
    identities[profile.userId] = { displayName: profile.displayName || profile.username, avatarUrl: profile.avatarUrl };
  });
  return identities;
}
