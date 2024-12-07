"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { useState, useTransition, useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname.includes("/courses");
  const isSearchPage = pathname === "/search";

  const onClick = (href: string) => {
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
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onClick("/")}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onClick("/teacher/courses")}
            >
              Teacher Mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};
