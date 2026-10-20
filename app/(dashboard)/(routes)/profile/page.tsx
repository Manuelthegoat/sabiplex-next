import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SocialProfileForm } from "./social-profile-form";

export default async function SocialProfilePage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const [profile, user] = await Promise.all([
    db.userProfile.findUnique({ where: { userId } }),
    currentUser(),
  ]);
  if (!profile) redirect("/profile/setup");

  return <main className="page-shell min-h-full p-5 md:p-8"><div className="mx-auto max-w-2xl"><p className="eyebrow">Your account</p><h1 className="mt-1 text-3xl font-black tracking-tight">Community profile</h1><p className="mt-2 text-slate-600">Choose the name and photo people see next to your Plexxes and replies.</p><div className="mt-7"><SocialProfileForm username={profile.username} lastUsernameChangeAt={(profile.usernameChangedAt || profile.createdAt).toISOString()} initialDisplayName={profile.displayName || user?.fullName || profile.username} initialAvatarUrl={profile.avatarUrl || user?.imageUrl || ""} /></div></div></main>;
}
