"use client"

import { Archive, Award, BarChart, Compass, GraduationCap, Layout, List, MessageCircle, UserRound } from "lucide-react"
import { SidebarItem } from "./sidebar-item"
import { usePathname } from "next/navigation"

const guestroutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: '/dashboard',
    },
    {
        icon: Compass,
        label: "Browse",
        href: '/search',
    },
    {
        icon: Archive,
        label: "My learning library",
        href: '/library',
    },
    {
        icon: MessageCircle,
        label: "Community forum",
        href: '/forum',
    },
    {
        icon: GraduationCap,
        label: "Teach on Sabiplex",
        href: '/teacher-mode',
    },
    {
        icon: Award,
        label: "Achievements",
        href: '/achievements',
    },
]
const teacherRoutes = [
    {
        icon: Layout,
        label: "Learner mode",
        href: '/dashboard',
    },
    {
        icon: List,
        label: "Courses",
        href: '/teacher/courses',
    },
    {
        icon: UserRound,
        label: "Teacher profile",
        href: '/teacher/profile',
    },
    {
        icon: BarChart,
        label: "Earnings",
        href: '/teacher/analytics',
    },
]

export const SidebarRoutes = () => {
    const pathname = usePathname()

    const isTeacherPage = pathname?.startsWith("/teacher/")
    const routes = isTeacherPage ? teacherRoutes : guestroutes
    return(
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem 
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}
