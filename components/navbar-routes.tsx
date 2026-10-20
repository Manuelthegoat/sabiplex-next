"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

export function NavbarRoutes() {
  const pathname = usePathname(); const router = useRouter();
  const { userId } = useAuth();
  const isTeacherPage = pathname?.startsWith("/teacher"); const isCoursePage = pathname?.includes("/courses"); const isSearchPage = pathname === "/search";
  return <>{isSearchPage && <div className="hidden md:block"><SearchInput /></div>}<div className="ml-auto flex gap-2">{(isTeacherPage || isCoursePage) ? <Link href="/"><Button size="sm" variant="ghost"><LogOut className="mr-2 h-4 w-4" />Exit</Button></Link> : isTeacher(userId) ? <Link href="/teacher/courses"><Button size="sm" variant="ghost">Teacher Mode</Button></Link> : null}<UserButton afterSignOutUrl="/" /></div></>;
}
