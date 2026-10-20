"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UsernameSetup({ suggestedUsername }: { suggestedUsername: string }) {
  const router = useRouter();
  const [username, setUsername] = useState(suggestedUsername);
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      await axios.post("/api/profile/username", { username });
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(axios.isAxiosError(error) ? error.response?.data?.error ?? "Could not save your username." : "Could not save your username.");
    } finally {
      setBusy(false);
    }
  };

  return <form onSubmit={submit} className="mt-6 space-y-4"><div><label htmlFor="username" className="mb-2 block text-sm font-semibold">Username</label><div className="flex items-center rounded-md border border-input bg-background px-3"><span className="text-slate-400">@</span><Input id="username" value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} minLength={3} maxLength={20} pattern="[a-zA-Z0-9_]{3,20}" autoComplete="username" className="border-0 shadow-none focus-visible:ring-0" required /></div><p className="mt-1 text-xs text-slate-500">3–20 letters, numbers, or underscores.</p></div><Button className="w-full" disabled={busy}>{busy ? "Saving..." : "Continue to Sabiplex"}</Button></form>;
}
