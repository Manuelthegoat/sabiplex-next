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
  const { data, totalRevenue, totalSales, unrecordedSales } = await getAnalytics(userId);
  return (
    <div className="page-shell min-h-full p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Teacher studio</p><h1 className="mt-1 text-3xl font-black tracking-tight">Earnings</h1><p className="mt-2 text-slate-500">Confirmed Paystack course payments and sales.</p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <DataCard value={totalSales} label="Total Enrollments" />
          <DataCard value={totalRevenue} label="Recorded gross revenue" shouldFormat />
          <DataCard value={unrecordedSales} label="Older sales without payment record" />
        </div>
        <p className="mb-4 text-xs leading-5 text-slate-500">Revenue shows the confirmed amount received by the platform. Older purchases without a recorded Paystack amount are excluded. Teacher payouts are not processed from this dashboard.</p>
        <Chart data={data} />
      </div></div>
    </div>
  );
};

export default AnalyticsPage;
