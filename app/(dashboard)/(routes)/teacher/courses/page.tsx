
import { auth } from "@clerk/nextjs/server";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const CoursesPage = async () => {
const {userId} = auth()

if (!userId) {
    return redirect("/")
}

const courses = await db.course.findMany({
    where: {
        userId
    },
    orderBy: {
        createdAt: "desc"
    }
})
    return ( 
        <div className="page-shell min-h-full p-5 md:p-8">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Teacher studio</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Your courses</h1>
            <p className="mt-2 text-slate-500">Create, refine, and publish learning experiences.</p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6"><DataTable columns={columns} data={courses} /></div>
          </div>
        </div>
     );
}
 
export default CoursesPage;
