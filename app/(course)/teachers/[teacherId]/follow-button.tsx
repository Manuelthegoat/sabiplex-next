"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FollowTeacherButton({ teacherId, initialFollowing, isSignedIn }: { teacherId: string; initialFollowing: boolean; isSignedIn: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const toggleFollow = async () => {
    if (!isSignedIn) {
      window.location.assign("/sign-in");
      return;
    }
    const nextFollowing = !following;
    setBusy(true);
    try {
      await axios({ method: nextFollowing ? "post" : "delete", url: `/api/teachers/${teacherId}/follow` });
      setFollowing(nextFollowing);
      router.refresh();
      toast.success(nextFollowing ? "You’ll get updates when this teacher posts or publishes a course." : "Teacher unfollowed");
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.error ?? "Could not update follow" : "Could not update follow");
    } finally {
      setBusy(false);
    }
  };

  return <Button type="button" variant={following ? "outline" : "default"} onClick={toggleFollow} disabled={busy} className="gap-2">
    {following ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
    {busy ? "Saving..." : following ? "Following" : "Follow teacher"}
  </Button>;
}
