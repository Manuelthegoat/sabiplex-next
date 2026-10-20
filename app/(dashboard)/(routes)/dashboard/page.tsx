import { getDashboardCourses } from '@/actions/get-dashboard-courses';
import { CoursesList } from '@/components/courses-list';
import { auth } from '@clerk/nextjs/server';
import { CheckCircle, Clock, Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';
import { InfoCard } from '../(root)/_components/info-card';

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId!);
  return <div className="page-shell min-h-full p-5 md:p-8"><div className="mx-auto max-w-7xl space-y-7"><section className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-200 md:p-9"><div className="flex items-center gap-2 text-indigo-100"><Sparkles className="h-4 w-4" /><span className="text-sm font-semibold">Your learning space</span></div><h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Ready to make today count?</h1><p className="mt-2 max-w-xl text-indigo-100">Pick up where you left off, or find your next big idea.</p></section><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><InfoCard icon={Clock} label="In Progress" numberOfItems={coursesInProgress.length} /><InfoCard icon={CheckCircle} label="Completed" variant="success" numberOfItems={completedCourses.length} /></div><section><div className="mb-4"><p className="eyebrow">Your library</p><h2 className="mt-1 text-2xl font-bold">Continue learning</h2></div><CoursesList items={[...coursesInProgress, ...completedCourses]} /></section></div></div>;
}
