import { hasTeacherAccess } from "@/lib/teacher"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const TeacherLayout = async ({
    children
} : {
    children: React.ReactNode
}) => {
    const {userId} = auth()
    if (!(await hasTeacherAccess(userId))) {
        return redirect("/teacher-mode")
    }
    return <>{children}</>
}
export default TeacherLayout
