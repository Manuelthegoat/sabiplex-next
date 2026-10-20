"use client"

import { Archive, BarChart, Compass, Layout, List } from "lucide-react"
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
]
const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: '/teacher/courses',
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: '/teacher/analytics',
    },
]

export const SidebarRoutes = () => {
    const pathname = usePathname()

    const isTeacherPage = pathname?.includes("/teacher")
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
