import { GraduationCap } from "lucide-react";

export default function Loading() {
  return <div className="grid min-h-screen place-items-center bg-slate-950"><div className="text-center text-white"><div className="mx-auto grid h-14 w-14 animate-pulse place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 shadow-xl shadow-indigo-500/30"><GraduationCap /></div><p className="mt-5 text-sm font-semibold tracking-wide text-indigo-100">Preparing your learning space</p><div className="mx-auto mt-4 h-1 w-28 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/2 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-teal-300" /></div></div></div>;
}
