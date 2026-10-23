import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, BookOpen, MessageCircle, Users } from "lucide-react";

const benefits = [
  {
    title: "Learn from your peers",
    body: "Explore courses from teachers sharing the knowledge and experience they have built themselves.",
    Icon: BookOpen,
  },
  {
    title: "Make progress at your pace",
    body: "Work through focused chapters, keep track of your progress, and return whenever you are ready.",
    Icon: ArrowRight,
  },
  {
    title: "Stay connected to your community",
    body: "Ask questions, share ideas, and learn alongside people working toward their own goals.",
    Icon: Users,
  },
];

export default function LandingPage() {
  const { userId } = auth();

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,.12),transparent_28%),radial-gradient(circle_at_78%_8%,rgba(148,163,184,.12),transparent_25%)]" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" aria-label="Sabiplex home">
          <Image src="/logo.svg" alt="Sabiplex" width={150} height={48} priority className="h-10 w-auto brightness-0 invert" />
        </Link>
        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#why" className="hover:text-white">Why Sabiplex</a>
          <a href="#how" className="hover:text-white">How it works</a>
        </div>
        <Link href={userId ? "/dashboard" : "/sign-in"} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/10">
          {userId ? "Dashboard" : "Sign in"}
        </Link>
      </nav>

      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pb-32 lg:pt-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-neutral-100 backdrop-blur">
          <Users className="h-4 w-4 text-amber-300" /> Learning built around students
        </div>
        <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl">
          Learn from people who <span className="bg-gradient-to-r from-neutral-300 via-neutral-200 to-teal-200 bg-clip-text text-transparent">know the journey.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
          Discover peer-led courses, build practical knowledge, and connect with a community that understands the student experience.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-xl">
            Explore courses <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
            Join the community
          </Link>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:divide-x sm:divide-white/10 sm:gap-0 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[.06] sm:py-5 sm:backdrop-blur">
          <div className="rounded-2xl border border-white/10 bg-white/[.06] py-5 sm:rounded-none sm:border-0 sm:bg-transparent sm:py-0">
            <p className="text-2xl font-black">Peer-led</p><p className="mt-1 text-xs text-slate-400">learn from fellow teachers</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.06] py-5 sm:rounded-none sm:border-0 sm:bg-transparent sm:py-0">
            <p className="text-2xl font-black">Your pace</p><p className="mt-1 text-xs text-slate-400">learn in focused chapters</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.06] py-5 sm:rounded-none sm:border-0 sm:bg-transparent sm:py-0">
            <p className="text-2xl font-black">Together</p><p className="mt-1 text-xs text-slate-400">learn with your community</p>
          </div>
        </div>
      </section>

      <section id="why" className="relative bg-slate-50 px-6 py-24 text-slate-900 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Learning is better together</p>
          <div className="mt-4 flex max-w-3xl flex-col justify-between gap-6 md:flex-row">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">A student community built to help you move forward.</h2>
            <p className="max-w-sm leading-7 text-slate-600">Find knowledge from fellow teachers, make steady progress, and connect with learners who understand your goals.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {benefits.map(({ title, body, Icon }, index) => (
              <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-50 text-neutral-600"><Icon /></div>
                <p className="mt-8 text-sm font-bold text-neutral-600">0{index + 1}</p>
                <h3 className="mt-2 text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="bg-white px-6 py-24 text-slate-900 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">A clearer way to learn</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Find a course. Learn together. Keep growing.</h2>
            <div className="mt-9 space-y-5">
              {[
                "Explore courses shared by teachers in the community",
                "Learn through focused chapters and track your progress",
                "Ask questions and connect with other learners",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-4 text-lg font-semibold">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-600 text-sm text-white">{index + 1}</span>{item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-neutral-600 via-neutral-600 to-slate-900 p-7 text-white shadow-2xl shadow-neutral-300">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10"><MessageCircle className="h-6 w-6 text-teal-200" /></div>
              <p className="mt-6 text-sm text-neutral-100">Your learning community</p>
              <p className="mt-2 text-2xl font-bold">Knowledge grows when it is shared.</p>
              <div className="mt-8 space-y-3">
                {[
                  ["Courses from fellow teachers", BookOpen],
                  ["Progress through every chapter", ArrowRight],
                  ["Questions, ideas, and discussion", Users],
                ].map(([label, Icon]) => {
                  const FeatureIcon = Icon as typeof BookOpen;
                  return <div key={label as string} className="flex items-center gap-3 rounded-xl bg-white/10 p-4 text-sm font-semibold"><FeatureIcon className="h-4 w-4 shrink-0 text-teal-200" />{label as string}</div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950 px-6 py-8 text-center text-sm text-slate-400">© {new Date().getFullYear()} Sabiplex. Learn boldly.</footer>
    </main>
  );
}
