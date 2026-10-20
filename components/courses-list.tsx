import { Category, Course } from "@prisma/client"
import { CourseCard } from "@/components/course-card"


type CourseWithProgressWithCategory = Course & {
    category: Category | null
    chapters: {id: string} []
    progress: number | null
    reviews?: {rating: number}[]
}

interface CoursesListProps {
    items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({
    items
}: CoursesListProps) => {
    return (
        <div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => (
               <CourseCard 
                key={item.id}
                id={item.id}
                title={item.title}
                imageUrl={item.imageUrl!}
                chaptersLength={item.chapters.length}
                price={item.price!}
                progress={item.progress}
                category={item?.category?.name!}
                ratingAverage={item.reviews?.length ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length : null}
                reviewCount={item.reviews?.length ?? 0}
               />
            ))}
        </div>
        {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 text-center text-sm text-muted-foreground mt-6">No courses here yet. Try exploring a different topic.</div>
        )}
        </div>
    )
}
