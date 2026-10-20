import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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
