"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const IsActive = pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    NProgress.start();
    setIsLoading(true);

    startTransition(() => {
      router.push(href);
    });
  };

  useEffect(() => {
    if (!isPending) {
      NProgress.done();
      setIsLoading(false);
    }
  }, [isPending]);

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "mx-3 flex items-center gap-x-2 rounded-xl px-4 text-left text-sm font-medium text-slate-400 transition-all hover:bg-white/10 hover:text-white",
        IsActive &&
          "bg-indigo-500/20 text-white hover:bg-indigo-500/20 hover:text-white"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-400", IsActive && "text-indigo-300")}
        />
        {label}
      </div>
    </button>
  );
};
