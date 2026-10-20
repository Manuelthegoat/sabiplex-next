import { NavbarRoutes } from "@/components/navbar-routes"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { CourseMobileSidebar } from "./course-mobile-sidebar"

interface CourseNavbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    }
    progressCount: number
}


export const CourseNavbar = ({
    course,
    progressCount
}: CourseNavbarProps) => {
    return (
        <div className="h-full flex items-center border-b border-slate-200/80 bg-white/85 px-5 shadow-sm backdrop-blur-xl">
            <CourseMobileSidebar
                course={course}
                progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
    )
}
