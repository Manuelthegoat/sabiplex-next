import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataCard } from "./_components/data-card";
import Chart from "./_components/chart";

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const { data, totalRevenue, totalSales } = await getAnalytics(userId);
  return (
    <div className="page-shell min-h-full p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Teacher studio</p><h1 className="mt-1 text-3xl font-black tracking-tight">Performance</h1><p className="mt-2 text-slate-500">A clear view of your course impact and earnings.</p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className=" grid grid-cols-1  md:grid-cols-2 gap-4 mb-4">
          <DataCard value={totalSales} label="Total Sales" />
          <DataCard value={totalRevenue} label="Total Revenue" shouldFormat />
        </div>
        <Chart data={data} />
      </div></div>
    </div>
  );
};

export default AnalyticsPage;
