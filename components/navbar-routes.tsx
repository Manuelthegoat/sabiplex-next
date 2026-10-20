"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { NotificationBell } from "./notification-bell";

export function NavbarRoutes() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const isTeacherPage = pathname?.startsWith("/teacher/"); const isCoursePage = pathname?.includes("/courses"); const isSearchPage = pathname === "/search";
  const modeHref = isTeacherPage ? "/dashboard" : isCoursePage ? "/dashboard" : "/teacher-mode";
  const modeLabel = isTeacherPage ? "Learner mode" : isCoursePage ? "Dashboard" : "Teach on Sabiplex";
  return <>{isSearchPage && <div className="hidden md:block"><SearchInput /></div>}<div className="ml-auto flex items-center gap-2">{userId && <Link href={modeHref}><Button size="sm" variant="ghost">{modeLabel}</Button></Link>}{userId && <NotificationBell />}<UserButton afterSignOutUrl="/" /></div></>;
}
