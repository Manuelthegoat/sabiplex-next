import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const profile = await db.userProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!profile) redirect("/profile/setup");

  return (
    <div className="min-h-full">
      <div className="h-[76px] md:pl-64 fixed inset-y-0 w-full z-50 print:hidden">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 print:hidden">
        <Sidebar />
      </div>
      <main className="md:pl-64 pt-[76px] min-h-full print:pl-0 print:pt-0">{children}</main>
    </div>
  );
};

export default DashboardLayout;
