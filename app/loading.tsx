import Image from "next/image";

export default function Loading() {
  return <div className="grid min-h-screen place-items-center bg-slate-950"><div className="text-center text-white"><Image src="/logo.svg" alt="Sabiplex" width={180} height={58} priority className="mx-auto h-14 w-auto animate-pulse brightness-0 invert" /><p className="mt-5 text-sm font-semibold tracking-wide text-slate-200">Preparing your learning space</p><div className="mx-auto mt-4 h-1 w-28 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/2 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-white" /></div></div></div>;
}
