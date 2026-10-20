import { getProgress } from "@/actions/get-progress"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CourseSidebar } from "./_components/course-sidebar"
import { CourseNavbar } from "./_components/course-navbar"

const CourseLayout = async ({
    children,
    params
}: {
    children: React.ReactNode
    params: {courseId: string}
}) => {

    const {userId} = auth()

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId: userId ?? "__anonymous__"
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    })

    if (!course) {
        return redirect("/")
    }

    const progressCount = userId ? await getProgress(userId, course.id) : 0

    return (
        <div className="min-h-full bg-slate-50">
            <div className="h-[76px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <main className="md:pl-80 pt-[76px] min-h-full">

            {children}
            </main>
        </div>
    )
}

export default CourseLayout
