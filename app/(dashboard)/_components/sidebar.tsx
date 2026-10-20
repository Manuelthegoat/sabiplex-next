import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r border-slate-200/80 flex flex-col overflow-y-auto bg-slate-950 text-white shadow-xl">
      <div className="p-7 pb-10">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
